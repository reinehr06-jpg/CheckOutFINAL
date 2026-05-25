<?php

namespace App\Events;

use App\Models\Gateway;
use Illuminate\Foundation\Events\Dispatchable;
use Illuminate\Queue\SerializesModels;

class GatewayHealthChanged
{
    use Dispatchable, SerializesModels;

    public function __construct(
        public Gateway $gateway,
        public string $previousStatus,
        public string $newStatus,
        public array $metrics,
    ) {}
}
