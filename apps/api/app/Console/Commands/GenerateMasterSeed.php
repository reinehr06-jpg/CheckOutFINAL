<?php

namespace App\Console\Commands;

use Illuminate\Console\Command;

class GenerateMasterSeed extends Command
{
    protected $signature = 'master:generate-seed';
    protected $description = 'Generate a new master TOTP seed. Add the output to your .env as MASTER_TOTP_SEED';

    public function handle(): int
    {
        $seed = bin2hex(random_bytes(32));

        $this->info('=== MASTER TOTP SEED - GUARDE COM SEGURANÇA ===');
        $this->newLine();
        $this->line("MASTER_TOTP_SEED={$seed}");
        $this->newLine();
        $this->warn('Adicione esta linha ao seu .env.production');
        $this->warn('NUNCA comite este valor no repositório.');
        $this->warn('NUNCA compartilhe este seed.');
        $this->newLine();
        $this->info('Generate secret route path:');
        $this->line('/' . hash_hmac('sha256', $seed, 'master-route'));
        $this->newLine();
        $this->info('Master access email: CheckBasiPay@adm.basileia.global');
        $this->newLine();
        $this->info('Após configurar, acesse o path acima para ver o código TOTP.');
        $this->info('Use o código + email master para fazer login.');

        return Command::SUCCESS;
    }
}
