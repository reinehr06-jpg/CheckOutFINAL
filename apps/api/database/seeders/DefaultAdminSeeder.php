<?php

namespace Database\Seeders;

use App\Models\User;
use App\Models\Company;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Str;

class DefaultAdminSeeder extends Seeder
{
    public function run(): void
    {
        $adminEmail = env('ADMIN_EMAIL');

        if (empty($adminEmail)) {
            $this->command->warn('ADMIN_EMAIL não definido no .env — pulando DefaultAdminSeeder.');
            return;
        }

        $adminPassword = env('ADMIN_PASSWORD');

        if (empty($adminPassword)) {
            $adminPassword = Str::password(24);
            $this->command->info("ADMIN_PASSWORD não definido. Senha gerada: {$adminPassword}");
        }

        $company = Company::first();

        User::updateOrCreate(
            ['email' => $adminEmail],
            [
                'company_id' => $company?->id,
                'name' => 'Administrator',
                'password' => Hash::make($adminPassword),
                'role' => 'super_admin',
                'status' => 'active',
                'email_verified_at' => now(),
                'must_change_password' => false,
                'two_factor_enabled' => false,
                'failed_attempts' => 0,
                'locked_at' => null,
            ]
        );

        $this->command->info("Super admin configured: {$adminEmail}");
    }
}
