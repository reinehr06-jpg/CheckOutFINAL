<?php

namespace App\Console\Commands;

use App\Models\Company;
use App\Services\Crypto\TenantEncryption;
use Illuminate\Console\Command;

class EncryptExistingData extends Command
{
    protected $signature = 'basileia:encrypt-existing-data
        {--company= : Encrypt only for specific company ID}';

    protected $description = 'Re-encrypt all existing sensitive data with per-tenant DEK';

    public function handle(TenantEncryption $encryption): int
    {
        $companyId = $this->option('company');

        $companies = $companyId
            ? Company::where('id', $companyId)->get()
            : Company::all();

        if ($companies->isEmpty()) {
            $this->warn('No companies found.');
            return self::SUCCESS;
        }

        $bar = $this->output->createProgressBar($companies->count());
        $bar->start();

        foreach ($companies as $company) {
            $this->processCompany($company, $encryption);
            $bar->advance();
        }

        $bar->finish();
        $this->newLine();
        $this->info('Encryption complete.');

        return self::SUCCESS;
    }

    private function processCompany(Company $company, TenantEncryption $encryption): void
    {
        $companyId = $company->id;

        // Ensure DEK exists for this company
        $encryption->loadDek($companyId);

        // Re-encrypt gateway credentials
        $credentials = \App\Models\GatewayCredential::whereHas('gatewayAccount.gateway', function ($q) use ($companyId) {
            $q->where('company_id', $companyId);
        })->get();

        foreach ($credentials as $credential) {
            if (empty($credential->getRawOriginal('encrypted_value'))) {
                continue;
            }

            $credential->company_id = $companyId;

            try {
                $plaintext = decrypt($credential->getRawOriginal('encrypted_value'));
                $credential->encrypted_value = $plaintext;
                $credential->save();
            } catch (\Exception $e) {
                $this->warn("Credential ID {$credential->id}: {$e->getMessage()}");
            }
        }

        // Re-encrypt gateway configs
        $configs = \App\Models\GatewayConfig::whereHas('gateway', function ($q) use ($companyId) {
            $q->where('company_id', $companyId);
        })->get();

        foreach ($configs as $config) {
            if (empty($config->getRawOriginal('value'))) {
                continue;
            }

            $config->company_id = $companyId;

            try {
                $plaintext = decrypt($config->getRawOriginal('value'));
                $config->value = $plaintext;
                $config->save();
            } catch (\Exception $e) {
                $this->warn("Config ID {$config->id}: {$e->getMessage()}");
            }
        }

        // Re-encrypt company keys
        $companyKey = \App\Models\CompanyKey::find($companyId);
        if ($companyKey && !empty($companyKey->getRawOriginal('key'))) {
            $plaintext = $companyKey->getRawOriginal('key');
            $companyKey->key = $plaintext;
            $companyKey->save();
        }
    }
}
