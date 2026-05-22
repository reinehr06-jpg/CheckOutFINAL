<?php

namespace App\Services\Auth;

class MasterAccessService
{
    private string $seed;
    private int $window = 20;

    public function __construct()
    {
        $this->seed = config('master.totp_seed');
    }

    public function generateCode(): string
    {
        $timeSlot = (int) floor(time() / $this->window);
        $hash = hash_hmac('sha256', (string) $timeSlot, $this->seed);
        return strtoupper(substr($hash, 0, 4) . '-' . substr($hash, 4, 4));
    }

    public function validateCode(string $code): bool
    {
        $currentSlot = (int) floor(time() / $this->window);

        for ($offset = -1; $offset <= 1; $offset++) {
            $timeSlot = $currentSlot + $offset;
            if ($timeSlot < 0) continue;

            $hash = hash_hmac('sha256', (string) $timeSlot, $this->seed);
            $expected = strtoupper(substr($hash, 0, 4) . '-' . substr($hash, 4, 4));
            if (hash_equals($expected, $code)) return true;
        }

        return false;
    }

    public function generateSecretPath(): string
    {
        return hash_hmac('sha256', $this->seed, 'master-route');
    }

    public function getMasterEmail(): string
    {
        return 'CheckBasiPay@adm.basileia.global';
    }
}
