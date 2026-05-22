<?php

namespace App\Services\Vault;

interface VaultInterface
{
    public function encrypt(string $plaintext): string;

    public function decrypt(string $ciphertext): string;

    public function keyVersion(): int;
}
