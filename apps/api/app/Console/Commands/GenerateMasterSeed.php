<?php

namespace App\Console\Commands;

use App\Services\Auth\MasterUrlService;
use Illuminate\Console\Command;

class GenerateMasterSeed extends Command
{
    protected $signature = 'master:generate-seed';
    protected $description = 'Generate seeds for the 4-layer master security system';

    public function handle(): int
    {
        $this->info('══════════════════════════════════════════════');
        $this->info('  GERADOR DE SEMENTES — ACESSO MASTER');
        $this->info('  GUARDE CADA VALOR EM LOCAL SEGURO');
        $this->info('══════════════════════════════════════════════');
        $this->newLine();

        // ── Layer 1: URL Seed ──
        $this->info('◆ CAMADA 1 — URL EFÊMERA DIÁRIA');
        $urlSeed = bin2hex(random_bytes(32));
        $this->line("MASTER_SEED_HEX={$urlSeed}");
        $this->newLine();

        if ($urlSeedEnv = env('MASTER_SEED_HEX')) {
            try {
                $service = new MasterUrlService();
                $this->line("URL de hoje: " . config('app.url') . $service->todayPath());
            } catch (\RuntimeException) {
                // skip if not configured
            }
        }
        $this->newLine();

        // ── Layer 2: WebAuthn ──
        $this->info('◆ CAMADA 2 — 2FA FÍSICO (YubiKey / WebAuthn)');
        $this->line('Acesse a URL dinâmica de hoje e registre sua YubiKey');
        $this->line('pela interface WebAuthn no navegador.');
        $this->newLine();

        // ── Layer 3: TOTP Seed ──
        $this->info('◆ CAMADA 3 — TOTP 20 SEGUNDOS');
        $totpSeed = bin2hex(random_bytes(32));
        $this->line("MASTER_TOTP_SEED={$totpSeed}");
        $this->newLine();

        // ── Master Email ──
        $this->info('◆ EMAIL MASTER');
        $this->line('MASTER_EMAIL=CheckBasiPay@adm.basileia.global');
        $this->newLine();

        $this->warn('══════════════════════════════════════════════');
        $this->warn('  INSTRUÇÕES');
        $this->warn('══════════════════════════════════════════════');
        $this->newLine();
        $this->line('1. Adicione MASTER_SEED_HEX ao .env.production (NUNCA no repositório)');
        $this->line('2. Adicione MASTER_TOTP_SEED ao .env.production');
        $this->line('3. Acesse a URL dinâmica de hoje (exibida acima se configurado)');
        $this->line('4. Na página, registre sua YubiKey (WebAuthn) como 2FA');
        $this->line('5. Após 2FA, copie o código TOTP exibido na tela');
        $this->line('6. Use o email master + código TOTP para fazer login');
        $this->newLine();
        $this->warn('  NUNCA comite estes seeds no repositório.');
        $this->warn('  NUNCA compartilhe os seeds.');
        $this->warn('  O MASTER_SEED_HEX deve ficar APENAS no painel do servidor.');

        return Command::SUCCESS;
    }
}
