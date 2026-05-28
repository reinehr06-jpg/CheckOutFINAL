<?php

namespace App\Services\Auth;

use App\Models\Company;
use App\Models\User;
use App\Services\Audit\AuditService;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Str;

class CompanyRegistrationService
{
    public function register(array $data): array
    {
        return DB::transaction(function () use ($data) {
            $company = Company::create([
                'name' => $data['company_name'],
                'display_name' => $data['company_name'],
                'slug' => Str::slug($data['company_name']) . '-' . Str::random(6),
                'document' => $data['document'] ?? null,
                'document_type' => $data['document_type'] ?? null,
                'email' => $data['email'],
                'phone' => $data['phone'] ?? null,
                'country' => $data['country'] ?? 'BR',
                'status' => 'active',
                'plan' => 'trial',
            ]);

            $user = User::create([
                'company_id' => $company->id,
                'name' => $data['name'],
                'email' => $data['email'],
                'password' => Hash::make($data['password']),
                'role' => 'admin',
                'status' => 'active',
                'must_change_password' => false,
                'password_changed_at' => now(),
            ]);

            app(AuditService::class)->log('company.registered', $user, [
                'company_id' => $company->id,
                'company_name' => $company->name,
                'country' => $company->country,
            ]);

            return ['company' => $company, 'user' => $user];
        });
    }
}
