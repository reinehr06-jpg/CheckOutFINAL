<?php

namespace App\Services\Crypto;

use App\Models\TenantKey;
use App\Services\Vault\VaultInterface;
use App\Services\Vault\VaultProvider;
use Illuminate\Support\Facades\DB;
use RuntimeException;

class TenantEncryption
{
    private VaultInterface $vault;

    public function __construct(?VaultInterface $vault = null)
    {
        $this->vault = $vault ?? VaultProvider::make();
    }

    public function encrypt(string $plaintext, ?int $companyId = null): string
    {
        $companyId = $companyId ?? $this->resolveCompanyId();
        $dek = $this->loadDek($companyId);

        $nonce = random_bytes(SODIUM_CRYPTO_SECRETBOX_NONCEBYTES);
        $ciphertext = sodium_crypto_secretbox($plaintext, $nonce, $dek);
        return base64_encode($nonce . $ciphertext);
    }

    public function decrypt(string $ciphertext, ?int $companyId = null): string
    {
        $companyId = $companyId ?? $this->resolveCompanyId();
        $dek = $this->loadDek($companyId);

        $decoded = base64_decode($ciphertext, true);
        if ($decoded === false || strlen($decoded) < SODIUM_CRYPTO_SECRETBOX_NONCEBYTES) {
            throw new RuntimeException('Invalid ciphertext');
        }

        $nonce = substr($decoded, 0, SODIUM_CRYPTO_SECRETBOX_NONCEBYTES);
        $encrypted = substr($decoded, SODIUM_CRYPTO_SECRETBOX_NONCEBYTES);

        $plaintext = sodium_crypto_secretbox_open($encrypted, $nonce, $dek);
        if ($plaintext === false) {
            throw new RuntimeException('Decryption failed: invalid DEK or tampered data');
        }

        return $plaintext;
    }

    public function loadDek(int $companyId): string
    {
        $tenantKey = TenantKey::where('company_id', $companyId)->first();

        if (!$tenantKey) {
            return $this->createDek($companyId);
        }

        return $this->decryptDek($tenantKey->encrypted_dek);
    }

    public function createDek(int $companyId): string
    {
        $dek = random_bytes(SODIUM_CRYPTO_AEAD_XCHACHA20POLY1305_IETF_KEYBYTES);
        $encryptedDek = $this->wrapDek($dek);

        TenantKey::create([
            'company_id' => $companyId,
            'encrypted_dek' => $encryptedDek,
            'kek_version' => $this->vault->keyVersion(),
        ]);

        return $dek;
    }

    public function wrapDek(string $dek): string
    {
        return $this->vault->encrypt($dek);
    }

    public function unwrapDek(string $encryptedDek): string
    {
        return $this->vault->decrypt($encryptedDek);
    }

    private function decryptDek(string $encryptedDek): string
    {
        return $this->unwrapDek($encryptedDek);
    }

    public function rewrapAllDek(int $oldVersion): int
    {
        $keys = TenantKey::where('kek_version', $oldVersion)->get();
        $count = 0;

        foreach ($keys as $tenantKey) {
            DB::transaction(function () use ($tenantKey) {
                $dek = $this->unwrapDek($tenantKey->encrypted_dek);
                $tenantKey->encrypted_dek = $this->wrapDek($dek);
                $tenantKey->kek_version = $this->vault->keyVersion();
                $tenantKey->rotated_at = now();
                $tenantKey->save();
            });
            $count++;
        }

        return $count;
    }

    public function rotateDek(int $companyId): void
    {
        $tenantKey = TenantKey::where('company_id', $companyId)->firstOrFail();
        $oldDek = $this->decryptDek($tenantKey->encrypted_dek);

        $tenantKey->encrypted_dek = $this->wrapDek($oldDek);
        $tenantKey->kek_version = $this->vault->keyVersion();
        $tenantKey->rotated_at = now();
        $tenantKey->save();
    }

    private function resolveCompanyId(): int
    {
        $companyId = \App\Services\TenantContext::companyId()
            ?? auth()->user()?->company_id;

        if (!$companyId) {
            throw new RuntimeException('Cannot resolve company_id for encryption');
        }

        return $companyId;
    }
}
