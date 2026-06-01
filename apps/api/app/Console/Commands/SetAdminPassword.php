<?php

declare(strict_types=1);

namespace App\Console\Commands;

use App\Models\User;
use Illuminate\Console\Command;
use Illuminate\Support\Facades\Hash;

/**
 * [BUG-13] REMOVIDA senha hardcoded 'BasileiaCheck2026!9909' do repositório.
 *
 * Senha hardcoded = qualquer pessoa com acesso ao Git entra como admin.
 *
 * Uso:
 *   php artisan admin:set-password admin@empresa.com          ← gera aleatória
 *   php artisan admin:set-password admin@empresa.com --password=MinhaS3nh@Fort3
 */
class SetAdminPassword extends Command
{
    protected $signature = 'admin:set-password
        {email          : E-mail do usuário}
        {--password=    : Senha desejada (opcional — gera aleatória se omitida)}';

    protected $description = 'Define senha de admin de forma segura (sem senha hardcoded).';

    public function handle(): int
    {
        $email = $this->argument('email');
        // Busca case-insensitive
        $user = User::whereRaw('LOWER(email) = ?', [strtolower(trim($email))])->first();

        if (!$user) {
            $this->error("❌ Usuário não encontrado: {$email}");
            return self::FAILURE;
        }

        $password = $this->option('password');
        $generated = false;

        if (empty($password)) {
            if ($this->confirm('Deseja digitar a nova senha manualmente?', true)) {
                $password = $this->secret('Digite a nova senha para o usuário (mínimo 12 caracteres)');
                while (empty($password) || strlen($password) < 12) {
                    $this->error('❌ A senha deve ter no mínimo 12 caracteres.');
                    $password = $this->secret('Digite a nova senha para o usuário (mínimo 12 caracteres)');
                }
            } else {
                $password = $this->generateStrongPassword();
                $generated = true;
            }
        }

        if (strlen($password) < 12) {
            $this->error('❌ A senha deve ter no mínimo 12 caracteres.');
            return self::FAILURE;
        }

        $user->update([
            'password' => Hash::make($password),
            'password_changed_at' => now(),
            'must_change_password' => false,
        ]);

        $this->info("✅ Senha atualizada com sucesso para: {$user->email}");

        if ($generated) {
            $this->line("--------------------------------------------------");
            $this->warn("🔑 SENHA GERADA COM SEGURANÇA:");
            $this->info($password);
            $this->line("--------------------------------------------------");
            $this->warn("⚠️  Salve esta senha agora — ela não será mostrada novamente.");
        }

        return self::SUCCESS;
    }

    private function generateStrongPassword(): string
    {
        $lower = 'abcdefghjkmnpqrstuvwxyz';
        $upper = 'ABCDEFGHJKMNPQRSTUVWXYZ';
        $numbers = '23456789';
        $symbols = '!@#$%&*-+=';

        // Garante ao menos 1 de cada tipo
        $password = $lower[random_int(0, strlen($lower) - 1)]
            . $upper[random_int(0, strlen($upper) - 1)]
            . $numbers[random_int(0, strlen($numbers) - 1)]
            . $symbols[random_int(0, strlen($symbols) - 1)];

        $all = $lower . $upper . $numbers . $symbols;
        for ($i = 0; $i < 14; $i++) {
            $password .= $all[random_int(0, strlen($all) - 1)];
        }

        return str_shuffle($password);
    }
}