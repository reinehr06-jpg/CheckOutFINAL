<?php

declare(strict_types=1);

namespace App\Services\Gateway;

class ConnectionResult
{
    public function __construct(
        public readonly bool $success,
        public readonly string $message,
        public readonly ?int $latencyMs = null,
        public readonly array $providerInfo = [],
        public readonly array $errors = [],
    ) {}
}
