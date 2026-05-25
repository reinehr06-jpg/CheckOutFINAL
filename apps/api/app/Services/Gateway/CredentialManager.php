<?php

declare(strict_types=1);

namespace App\Services\Gateway;

use App\Models\Gateway;
use App\Models\GatewayAccount;
use App\Models\GatewayConfig;
use App\Models\GatewayCredential;
use Illuminate\Support\Facades\Log;

class CredentialManager
{
    public function getCredentials(Gateway $gateway): array
    {
        $credentials = [];

        // Path 1: GatewayConfig (K/V with AsTenantEncrypted cast)
        $configs = $gateway->configs()->get();
        foreach ($configs as $config) {
            $credentials[$config->key] = $config->value;
        }

        // Path 2: GatewayCredential (K/V linked via GatewayAccount)
        $gatewayAccounts = GatewayAccount::where('company_id', $gateway->company_id)
            ->where('gateway_type', $gateway->slug)
            ->get();

        foreach ($gatewayAccounts as $account) {
            $creds = $account->credentials()->get();
            foreach ($creds as $cred) {
                $credentials[$cred->key] = $cred->encrypted_value;
            }

                // Path 3: settings JSON column on GatewayAccount
            if (!empty($account->settings) && is_array($account->settings)) {
                $credentials = array_merge($credentials, $account->settings);
            }
        }

        return $credentials;
    }

    public function setCredential(Gateway $gateway, string $key, mixed $value): void
    {
        $gateway->setConfig($key, $value);
    }

    public function removeCredential(Gateway $gateway, string $key): void
    {
        $gateway->configs()->where('key', $key)->delete();
    }

    public function setCredentialsFromArray(Gateway $gateway, array $credentials): void
    {
        foreach ($credentials as $key => $value) {
            $this->setCredential($gateway, $key, $value);
        }
    }

    public function getCredential(Gateway $gateway, string $key, mixed $default = null): mixed
    {
        $creds = $this->getCredentials($gateway);
        return $creds[$key] ?? $default;
    }

    public function getProviderCredentials(Gateway $gateway): array
    {
        $type = strtolower($gateway->type ?? $gateway->slug ?? '');
        $all = $this->getCredentials($gateway);

        $providerCreds = match ($type) {
            'asaas' => array_intersect_key($all, array_flip(['api_key', 'access_token', 'sandbox', 'environment'])),
            'pagbank' => array_intersect_key($all, array_flip(['api_token', 'token', 'sandbox', 'environment'])),
            'stripe' => array_intersect_key($all, array_flip(['secret_key', 'publishable_key', 'webhook_secret'])),
            default => $all,
        };

        return $providerCreds;
    }
}
