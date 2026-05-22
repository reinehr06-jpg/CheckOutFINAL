<?php

declare(strict_types=1);

namespace App\Services\Auth;

class MasterUrlService
{
    private string $seed;

    public function __construct()
    {
        $seedHex = config('master.url_seed');
        if (empty($seedHex)) {
            throw new \RuntimeException('MASTER_SEED_HEX nao configurado no .env');
        }
        $this->seed = sodium_hex2bin($seedHex);
    }

    public function todayPath(): string
    {
        $date = date('Y-m-d');
        $hash = hash_hmac('sha256', $date, $this->seed);
        return '/adm/' . substr($hash, 0, 24);
    }

    public function isValidPath(string $requestPath): bool
    {
        $expected = $this->todayPath();
        return hash_equals($expected, '/' . ltrim($requestPath, '/'));
    }
}
