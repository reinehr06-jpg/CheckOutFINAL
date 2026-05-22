<?php

namespace App\Services\Vault;

use RuntimeException;

class EnvVault implements VaultInterface
{
    private string $key;
    private int $version;

    public function __construct()
    {
        $raw = config('security.encryption_key');

        if (empty($raw)) {
            throw new RuntimeException('SECURITY_ENCRYPTION_KEY not set in environment');
        }

        $this->key = base64_decode($raw);
        $this->version = (int) config('security.kek_version', 1);

        if (strlen($this->key) !== SODIUM_CRYPTO_SECRETBOX_KEYBYTES) {
            throw new RuntimeException(sprintf(
                'SECURITY_ENCRYPTION_KEY must be %d bytes base64-encoded (got %d)',
                SODIUM_CRYPTO_SECRETBOX_KEYBYTES,
                strlen($this->key)
            ));
        }
    }

    public function encrypt(string $plaintext): string
    {
        $nonce = random_bytes(SODIUM_CRYPTO_SECRETBOX_NONCEBYTES);
        $ciphertext = sodium_crypto_secretbox($plaintext, $nonce, $this->key);
        return base64_encode($nonce . $ciphertext);
    }

    public function decrypt(string $ciphertext): string
    {
        $decoded = base64_decode($ciphertext, true);
        if ($decoded === false || strlen($decoded) < SODIUM_CRYPTO_SECRETBOX_NONCEBYTES) {
            throw new RuntimeException('Invalid ciphertext');
        }

        $nonce = substr($decoded, 0, SODIUM_CRYPTO_SECRETBOX_NONCEBYTES);
        $encrypted = substr($decoded, SODIUM_CRYPTO_SECRETBOX_NONCEBYTES);

        $plaintext = sodium_crypto_secretbox_open($encrypted, $nonce, $this->key);
        if ($plaintext === false) {
            throw new RuntimeException('Decryption failed: invalid key or tampered data');
        }

        return $plaintext;
    }

    public function keyVersion(): int
    {
        return $this->version;
    }
}
