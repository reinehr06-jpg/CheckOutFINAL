<?php

declare(strict_types=1);

namespace App\Services\Gateway;

use App\Models\Gateway;
use Illuminate\Support\Facades\Cache;

class CircuitBreaker
{
    private const CACHE_PREFIX = 'gateway_cb_';
    private const DEFAULT_THRESHOLD = 3;
    private const DEGRADE_THRESHOLD = 3;
    private const INACTIVE_THRESHOLD = 5;
    private const RESET_TIMEOUT_MINUTES = 30;

    public function recordSuccess(Gateway $gateway): void
    {
        Cache::forget($this->failureKey($gateway));
        Cache::forget($this->stateKey($gateway));
    }

    public function recordFailure(Gateway $gateway): int
    {
        $key = $this->failureKey($gateway);
        $failures = (int) Cache::get($key, 0) + 1;
        Cache::put($key, $failures, now()->addDay());

        if ($failures >= self::INACTIVE_THRESHOLD) {
            $this->setState($gateway, 'inactive');
        } elseif ($failures >= self::DEGRADE_THRESHOLD) {
            $this->setState($gateway, 'degraded');
        }

        return $failures;
    }

    public function isAvailable(Gateway $gateway): bool
    {
        $state = $this->getState($gateway);

        if ($state === 'inactive') {
            $resetAt = Cache::get($this->resetKey($gateway));
            if ($resetAt && now()->lessThan($resetAt)) {
                return false;
            }
            $this->reset($gateway);
        }

        if ($state === 'degraded') {
            return $this->consecutiveFailures($gateway) < self::DEFAULT_THRESHOLD;
        }

        return true;
    }

    public function consecutiveFailures(Gateway $gateway): int
    {
        return (int) Cache::get($this->failureKey($gateway), 0);
    }

    public function getState(Gateway $gateway): string
    {
        return Cache::get($this->stateKey($gateway), 'healthy');
    }

    public function setState(Gateway $gateway, string $state): void
    {
        Cache::put($this->stateKey($gateway), $state, now()->addDay());

        if ($state === 'inactive') {
            Cache::put(
                $this->resetKey($gateway),
                now()->addMinutes(self::RESET_TIMEOUT_MINUTES),
                now()->addMinutes(self::RESET_TIMEOUT_MINUTES)
            );
        }
    }

    public function reset(Gateway $gateway): void
    {
        Cache::forget($this->failureKey($gateway));
        Cache::forget($this->stateKey($gateway));
        Cache::forget($this->resetKey($gateway));
    }

    private function failureKey(Gateway $gateway): string
    {
        return self::CACHE_PREFIX . "failures_{$gateway->id}";
    }

    private function stateKey(Gateway $gateway): string
    {
        return self::CACHE_PREFIX . "state_{$gateway->id}";
    }

    private function resetKey(Gateway $gateway): string
    {
        return self::CACHE_PREFIX . "reset_{$gateway->id}";
    }
}
