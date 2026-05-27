<?php

declare(strict_types=1);

namespace App\Console\Commands;

use App\Models\User;
use Illuminate\Console\Command;
use Illuminate\Support\Facades\Hash;

class CheckUserCommand extends Command
{
    protected $signature = 'admin:check-user
        {email? : E-mail do usuário a verificar}
        {--password= : Senha para testar a validação}';

    protected $description = 'Verifica os usuários existentes no banco de dados e valida senhas.';

    public function handle(): int
    {
        $email = $this->argument('email');
        $password = $this->option('password');

        if ($email) {
            $user = User::where('email', strtolower(trim($email)))->first();
            if (!$user) {
                $this->error("❌ Usuário não encontrado com o e-mail: {$email}");
                
                // Busca aproximada caso haja diferença de casing no banco
                $approximate = User::whereRaw('LOWER(email) = ?', [strtolower(trim($email))])->first();
                if ($approximate) {
                    $this->warn("⚠️ Encontramos um usuário com e-mail semelhante, mas com letras maiúsculas/minúsculas diferentes: {$approximate->email}");
                }
                return self::FAILURE;
            }

            $this->info("=== Informações do Usuário ===");
            $this->line("Nome: {$user->name}");
            $this->line("E-mail: {$user->email}");
            $this->line("Role: {$user->role}");
            $this->line("Status: {$user->status}");
            $this->line("E-mail verificado em: {$user->email_verified_at}");
            $this->line("Tentativas falhas: {$user->failed_attempts}");

            if ($password) {
                if (Hash::check($password, $user->password)) {
                    $this->info("✅ A senha informada é VÁLIDA para este usuário.");
                } else {
                    $this->error("❌ A senha informada é INVÁLIDA para este usuário.");
                }
            } else {
                $this->warn("💡 Passe a opção --password=\"sua_senha\" para verificar se ela bate com o hash no banco.");
            }
        } else {
            $users = User::all();
            if ($users->isEmpty()) {
                $this->warn("⚠️ Nenhum usuário encontrado no banco de dados.");
                return self::SUCCESS;
            }

            $this->info("=== Lista de Usuários no Banco ===");
            $headers = ['ID', 'UUID', 'Nome', 'E-mail', 'Role', 'Status'];
            $data = $users->map(fn($u) => [$u->id, $u->uuid, $u->name, $u->email, $u->role, $u->status])->toArray();
            $this->table($headers, $data);
            
            $this->info("\n💡 Para verificar um usuário específico e testar sua senha, rode:");
            $this->line("php artisan admin:check-user {email} --password={senha}");
        }

        return self::SUCCESS;
    }
}
