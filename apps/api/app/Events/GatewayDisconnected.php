<?php

namespace App\Events;

use App\Models\Gateway;
use Illuminate\Foundation\Events\Dispatchable;
use Illuminate\Queue\SerializesModels;

class GatewayDisconnected
{
    use Dispatchable, SerializesModels;

    public function __construct(
        public Gateway $gateway,
        public string $reason,
    ) {}
}
