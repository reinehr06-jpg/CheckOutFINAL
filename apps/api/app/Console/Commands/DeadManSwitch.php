<?php

namespace App\Console\Commands;

use Illuminate\Console\Command;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Log;

class DeadManSwitch extends Command
{
    /**
     * The name and signature of the console command.
     *
     * @var string
     */
    protected $signature = 'security:deadman-switch';

    /**
     * The console command description.
     *
     * @var string
     */
    protected $description = 'Verifica a saúde dos serviços críticos e alerta caso o sistema esteja inoperante ou sob ataque furtivo.';

    /**
     * Execute the console command.
     */
    public function handle()
    {
        $this->info('Executando verificação Dead Man Switch...');

        $errors = [];

        // 1. Verificar conexão com Banco de Dados
        try {
            DB::connection()->getPdo();
        } catch (\Exception $e) {
            $errors[] = "Falha de conexão com o Banco de Dados principal.";
        }

        // 2. Verificar se a fila de jobs está travada
        // Exemplo: Jobs pendentes por muito tempo indicam fila morta
        try {
            $stuckJobs = DB::table('jobs')->where('created_at', '<', now()->subMinutes(10))->count();
            if ($stuckJobs > 100) {
                $errors[] = "Alerta: Fila de processamento com {$stuckJobs} jobs travados há mais de 10 minutos.";
            }
        } catch (\Exception $e) {
            // Ignora se tabela não existir
        }

        // 3. Verificar última gravação de Audit Log (detectar possível freeze do sistema de log)
        // Assumindo tráfego normal, se não houver NENHUM audit log na última hora, algo está errado
        try {
            $lastAudit = \App\Models\AuditLog::latest('id')->first();
            if ($lastAudit && $lastAudit->created_at->lt(now()->subHours(24))) {
                // Em um ambiente real com tráfego, isso seria subHours(1)
                $errors[] = "Alerta: Nenhum log de auditoria registrado nas últimas 24 horas. Sistema de logging pode ter sido desativado.";
            }
        } catch (\Exception $e) {
            $errors[] = "Falha ao verificar tabela de auditoria.";
        }

        if (count($errors) > 0) {
            Log::alert('DEAD MAN SWITCH DISPARADO: Falhas críticas detectadas.', ['errors' => $errors]);
            
            // Aqui normalmente enviaríamos para PagerDuty / Opsgenie / Slack
            // Por enquanto simularemos com logger do Laravel
            
            $this->error('Dead Man Switch disparado! ' . implode(' | ', $errors));
            return self::FAILURE;
        }

        $this->info('Todos os sistemas operando normalmente (Heartbeat OK).');
        return self::SUCCESS;
    }
}
