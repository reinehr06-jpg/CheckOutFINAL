<?php

namespace App\Services\Auth;

use Illuminate\Support\Facades\Cache;

class OneTimeMasterLink
{
    private string $signingKey;
    private int $ttlSeconds;

    public function __construct()
    {
        $this->signingKey = config('master.url_seed');
        $this->ttlSeconds = (int) config('master.link_ttl_seconds', 30);
    }

    public function generate(MasterUrlService $urlService): string
    {
        $path = $urlService->todayPath();
        $expiresAt = now()->addSeconds($this->ttlSeconds)->timestamp;
        $nonce = bin2hex(random_bytes(8));

        $payload = "{$path}:{$expiresAt}:{$nonce}";
        $signature = $this->sign($payload);

        $token = base64_encode("{$payload}:{$signature}");

        return $token;
    }

    public function verify(string $token): ?string
    {
        $decoded = base64_decode($token, true);
        if ($decoded === false || $decoded === '') {
            return null;
        }

        $parts = explode(':', $decoded);
        if (count($parts) !== 4) {
            return null;
        }

        [$path, $expiresAt, $nonce, $signature] = $parts;

        if ((int) $expiresAt < now()->timestamp) {
            return null;
        }

        $payload = "{$path}:{$expiresAt}:{$nonce}";
        $expectedSig = $this->sign($payload);

        if (!hash_equals($expectedSig, $signature)) {
            return null;
        }

        $cacheKey = "master_link_used:{$nonce}";
        if (Cache::has($cacheKey)) {
            return null;
        }

        Cache::put($cacheKey, true, $this->ttlSeconds);

        return $path;
    }

    private function sign(string $payload): string
    {
        return substr(
            hash_hmac('sha256', $payload, $this->signingKey),
            0,
            16
        );
    }
}
