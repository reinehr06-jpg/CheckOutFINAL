<?php

namespace App\Services\Vault;

/**
 * Stub for future HashiCorp Vault integration.
 *
 * To implement:
 *   1. Install `smithy-vault` or use Vault HTTP API
 *   2. Replace this class with actual Vault transit engine calls
 *   3. KEK lives in Vault transit engine — encrypt/decrypt via API
 *   4. Enable auto-unseal via cloud KMS (GCP CKMS / AWS KMS)
 */
class HashiCorpVault implements VaultInterface
{
    public function __construct()
    {
        throw new \RuntimeException('HashiCorpVault not yet implemented. Use EnvVault instead.');
    }

    public function encrypt(string $plaintext): string
    {
        throw new \RuntimeException('Not implemented');
    }

    public function decrypt(string $ciphertext): string
    {
        throw new \RuntimeException('Not implemented');
    }

    public function keyVersion(): int
    {
        return 1;
    }
}
