<?php

namespace App\Listeners;

use App\Events\GatewayConnected;
use App\Events\GatewayDisconnected;
use App\Events\GatewayHealthChanged;
use App\Events\GatewayTestFailed;
use App\Models\AuditLog;

class LogGatewayEvent
{
    public function handle($event): void
    {
        $gateway = $event->gateway;

        $eventType = match (true) {
            $event instanceof GatewayConnected => 'gateway.connected',
            $event instanceof GatewayDisconnected => 'gateway.disconnected',
            $event instanceof GatewayHealthChanged => 'gateway.health_changed',
            $event instanceof GatewayTestFailed => 'gateway.test_failed',
            default => 'gateway.unknown',
        };

        $metadata = [
            'gateway_slug' => $gateway->slug,
            'gateway_name' => $gateway->name,
        ];

        if ($event instanceof GatewayConnected) {
            $metadata['latency_ms'] = $event->result->latencyMs;
        }

        if ($event instanceof GatewayTestFailed) {
            $metadata['latency_ms'] = $event->result->latencyMs;
            $metadata['consecutive_failures'] = $event->consecutiveFailures;
            $metadata['errors'] = $event->result->errors;
        }

        if ($event instanceof GatewayHealthChanged) {
            $metadata['previous_status'] = $event->previousStatus;
            $metadata['new_status'] = $event->newStatus;
            $metadata['metrics'] = $event->metrics;
        }

        AuditLog::create([
            'company_id' => $gateway->company_id,
            'event' => $eventType,
            'entity_type' => 'gateway',
            'entity_id' => $gateway->id,
            'metadata' => $metadata,
        ]);
    }
}
