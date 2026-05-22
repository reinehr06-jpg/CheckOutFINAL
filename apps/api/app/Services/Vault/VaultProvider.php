<?php

namespace App\Services\Vault;

class VaultProvider
{
    public static function make(): VaultInterface
    {
        $driver = config('security.vault.driver', 'env');

        return match ($driver) {
            'env' => app(EnvVault::class),
            'hashicorp' => app(HashiCorpVault::class),
            default => throw new \RuntimeException("Unknown vault driver: {$driver}"),
        };
    }
}
