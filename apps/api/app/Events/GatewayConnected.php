<?php

namespace App\Events;

use App\Models\Gateway;
use App\Services\Gateway\ConnectionResult;
use Illuminate\Foundation\Events\Dispatchable;
use Illuminate\Queue\SerializesModels;

class GatewayConnected
{
    use Dispatchable, SerializesModels;

    public function __construct(
        public Gateway $gateway,
        public ConnectionResult $result,
    ) {}
}
