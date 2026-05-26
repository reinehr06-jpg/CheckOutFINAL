<?php

namespace App\Services\Crypto;

use RuntimeException;

/**
 * CryptoProvider — Crypto-Agility Layer
 *
 * Abstraction layer that allows swapping the underlying encryption algorithm
 * without changing application code. Required by NIST and NSA for critical systems.
 *
 * Usage:
 *   $crypto = CryptoProvider::make();
 *   $ciphertext = $crypto->encrypt($plaintext);
 *   $plaintext = $crypto->decrypt($ciphertext);
 *   $signature = $crypto->sign($data);
 *   $valid = $crypto->verify($data, $signature);
 */
class CryptoProvider
{
    private string $algorithm;
    private string $key;

    private const SUPPORTED_ALGORITHMS = [
        'aes-256-gcm',
        'xchacha20-poly1305',
        'sodium-secretbox',
    ];

    public function __construct(?string $algorithm = null, ?string $key = null)
    {
        $this->algorithm = $algorithm ?? config('security.crypto_algorithm', 'xchacha20-poly1305');
        $rawKey = $key ?? config('security.encryption_key');

        if (empty($rawKey)) {
            throw new RuntimeException('SECURITY_ENCRYPTION_KEY not set.');
        }

        $this->key = base64_decode($rawKey);

        if (!in_array($this->algorithm, self::SUPPORTED_ALGORITHMS)) {
            throw new RuntimeException("Unsupported crypto algorithm: {$this->algorithm}");
        }
    }

    public static function make(?string $algorithm = null): self
    {
        return new self($algorithm);
    }

    public function algorithm(): string
    {
        return $this->algorithm;
    }

    /**
     * Encrypt plaintext using the configured algorithm.
     * Returns base64-encoded string with format: algorithm_version:nonce:ciphertext
     */
    public function encrypt(string $plaintext): string
    {
        $result = match ($this->algorithm) {
            'aes-256-gcm' => $this->encryptAesGcm($plaintext),
            'xchacha20-poly1305' => $this->encryptXChaCha($plaintext),
            'sodium-secretbox' => $this->encryptSodiumSecretbox($plaintext),
            default => throw new RuntimeException("Algorithm not implemented: {$this->algorithm}"),
        };

        // Prefix with algorithm version for crypto-agility (allows decryption with old algos)
        return "v1:{$this->algorithm}:" . base64_encode($result);
    }

    /**
     * Decrypt ciphertext. Auto-detects algorithm from prefix for backward compatibility.
     */
    public function decrypt(string $envelope): string
    {
        // Parse envelope format: v1:algorithm:base64_data
        $parts = explode(':', $envelope, 3);

        if (count($parts) === 3 && $parts[0] === 'v1') {
            $algorithm = $parts[1];
            $data = base64_decode($parts[2], true);
        } else {
            // Legacy format — try current algorithm on raw base64
            $algorithm = $this->algorithm;
            $data = base64_decode($envelope, true);
        }

        if ($data === false) {
            throw new RuntimeException('Invalid ciphertext: base64 decode failed.');
        }

        return match ($algorithm) {
            'aes-256-gcm' => $this->decryptAesGcm($data),
            'xchacha20-poly1305' => $this->decryptXChaCha($data),
            'sodium-secretbox' => $this->decryptSodiumSecretbox($data),
            default => throw new RuntimeException("Cannot decrypt: unknown algorithm '{$algorithm}'."),
        };
    }

    /**
     * Sign data with HMAC-SHA256 using a derived signing key.
     */
    public function sign(string $data): string
    {
        $signingKey = hash('sha256', $this->key . ':signing', true);
        return base64_encode(hash_hmac('sha256', $data, $signingKey, true));
    }

    /**
     * Verify an HMAC-SHA256 signature.
     */
    public function verify(string $data, string $signature): bool
    {
        $expected = $this->sign($data);
        return hash_equals($expected, $signature);
    }

    /**
     * Re-encrypt data from one algorithm to the current algorithm.
     * Used during algorithm migration.
     */
    public function reEncrypt(string $envelope): string
    {
        $plaintext = $this->decrypt($envelope);
        return $this->encrypt($plaintext);
    }

    // ── AES-256-GCM ──────────────────────────────────────────────────────

    private function encryptAesGcm(string $plaintext): string
    {
        $this->validateKeyLength(32);
        $iv = random_bytes(12);
        $tag = '';
        $ciphertext = openssl_encrypt($plaintext, 'aes-256-gcm', $this->key, OPENSSL_RAW_DATA, $iv, $tag);

        if ($ciphertext === false) {
            throw new RuntimeException('AES-256-GCM encryption failed.');
        }

        return $iv . $tag . $ciphertext;
    }

    private function decryptAesGcm(string $data): string
    {
        $this->validateKeyLength(32);
        $iv = substr($data, 0, 12);
        $tag = substr($data, 12, 16);
        $ciphertext = substr($data, 28);

        $plaintext = openssl_decrypt($ciphertext, 'aes-256-gcm', $this->key, OPENSSL_RAW_DATA, $iv, $tag);

        if ($plaintext === false) {
            throw new RuntimeException('AES-256-GCM decryption failed.');
        }

        return $plaintext;
    }

    // ── XChaCha20-Poly1305 ───────────────────────────────────────────────

    private function encryptXChaCha(string $plaintext): string
    {
        $this->validateKeyLength(SODIUM_CRYPTO_AEAD_XCHACHA20POLY1305_IETF_KEYBYTES);
        $nonce = random_bytes(SODIUM_CRYPTO_AEAD_XCHACHA20POLY1305_IETF_NPUBBYTES);
        $ciphertext = sodium_crypto_aead_xchacha20poly1305_ietf_encrypt($plaintext, '', $nonce, $this->key);

        return $nonce . $ciphertext;
    }

    private function decryptXChaCha(string $data): string
    {
        $this->validateKeyLength(SODIUM_CRYPTO_AEAD_XCHACHA20POLY1305_IETF_KEYBYTES);
        $nonceLen = SODIUM_CRYPTO_AEAD_XCHACHA20POLY1305_IETF_NPUBBYTES;
        $nonce = substr($data, 0, $nonceLen);
        $ciphertext = substr($data, $nonceLen);

        $plaintext = sodium_crypto_aead_xchacha20poly1305_ietf_decrypt($ciphertext, '', $nonce, $this->key);

        if ($plaintext === false) {
            throw new RuntimeException('XChaCha20-Poly1305 decryption failed.');
        }

        return $plaintext;
    }

    // ── Sodium SecretBox (XSalsa20-Poly1305) ─────────────────────────────

    private function encryptSodiumSecretbox(string $plaintext): string
    {
        $this->validateKeyLength(SODIUM_CRYPTO_SECRETBOX_KEYBYTES);
        $nonce = random_bytes(SODIUM_CRYPTO_SECRETBOX_NONCEBYTES);
        $ciphertext = sodium_crypto_secretbox($plaintext, $nonce, $this->key);

        return $nonce . $ciphertext;
    }

    private function decryptSodiumSecretbox(string $data): string
    {
        $this->validateKeyLength(SODIUM_CRYPTO_SECRETBOX_KEYBYTES);
        $nonceLen = SODIUM_CRYPTO_SECRETBOX_NONCEBYTES;
        $nonce = substr($data, 0, $nonceLen);
        $ciphertext = substr($data, $nonceLen);

        $plaintext = sodium_crypto_secretbox_open($ciphertext, $nonce, $this->key);

        if ($plaintext === false) {
            throw new RuntimeException('Sodium SecretBox decryption failed.');
        }

        return $plaintext;
    }

    private function validateKeyLength(int $expected): void
    {
        if (strlen($this->key) !== $expected) {
            throw new RuntimeException("Key length mismatch: expected {$expected} bytes, got " . strlen($this->key));
        }
    }
}
