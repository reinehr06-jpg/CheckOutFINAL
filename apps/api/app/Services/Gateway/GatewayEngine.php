<?php

declare(strict_types=1);

namespace App\Services\Gateway;

use App\Events\GatewayConnected;
use App\Events\GatewayDisconnected;
use App\Events\GatewayHealthChanged;
use App\Events\GatewayTestFailed;
use App\Models\Gateway;
use App\Models\GatewayHealthSnapshot;
use App\Services\Gateway\CircuitBreaker;
use RuntimeException;

class GatewayEngine
{
    public function __construct(
        private readonly GatewayRegistry $registry,
        private readonly CredentialManager $credentials,
        private readonly CircuitBreaker $circuitBreaker,
    ) {}

    public function resolve(Gateway $gateway): GatewayInterface
    {
        if (!$this->circuitBreaker->isAvailable($gateway)) {
            throw new RuntimeException(
                "Gateway [{$gateway->name}] is currently {$this->circuitBreaker->getState($gateway)}. " .
                'Automatic reset pending.'
            );
        }

        return $this->registry->makeDriver($gateway);
    }

    public function connect(Gateway $gateway, array $credentials): ConnectionResult
    {
        $this->credentials->setCredentialsFromArray($gateway, $credentials);

        $result = $this->test($gateway);
        return $result;
    }

    public function test(Gateway $gateway): ConnectionResult
    {
        $driver = $this->registry->makeDriver($gateway);
        $result = $driver->testConnection();

        if ($result->success) {
            $this->circuitBreaker->recordSuccess($gateway);
            $this->recordHealthSnapshot($gateway, $result);
            $this->updateGatewayStatus($gateway, 'active', $result);

            event(new GatewayConnected($gateway, $result));
        } else {
            $failures = $this->circuitBreaker->recordFailure($gateway);
            $this->recordHealthSnapshot($gateway, $result);
            $this->updateGatewayStatus($gateway, null, $result);

            event(new GatewayTestFailed($gateway, $result, $failures));
        }

        return $result;
    }

    public function disconnect(Gateway $gateway, string $reason = 'manual'): void
    {
        $previousStatus = $gateway->status;

        $gateway->update(['status' => 'inactive']);

        $this->circuitBreaker->reset($gateway);

        event(new GatewayDisconnected($gateway, $reason));

        event(new GatewayHealthChanged(
            $gateway,
            $previousStatus,
            'inactive',
            ['reason' => $reason]
        ));
    }

    public function getDriver(Gateway $gateway): GatewayInterface
    {
        return $this->registry->makeDriver($gateway);
    }

    public function getRegistry(): GatewayRegistry
    {
        return $this->registry;
    }

    public function getCircuitBreaker(): CircuitBreaker
    {
        return $this->circuitBreaker;
    }

    private function updateGatewayStatus(Gateway $gateway, ?string $status, ConnectionResult $result): void
    {
        $update = [
            'last_tested_at' => now(),
            'last_test_status' => $result->success ? 'success' : 'failed',
        ];

        if ($status !== null && $gateway->status !== $status) {
            $previousStatus = $gateway->status;
            $update['status'] = $status;
        }

        $gateway->update($update);

        if (isset($previousStatus)) {
            event(new GatewayHealthChanged(
                $gateway,
                $previousStatus,
                $status,
                ['latency_ms' => $result->latencyMs]
            ));
        }
    }

    private function recordHealthSnapshot(Gateway $gateway, ConnectionResult $result): void
    {
        GatewayHealthSnapshot::create([
            'company_id' => $gateway->company_id,
            'gateway_id' => $gateway->id,
            'avg_latency_ms' => $result->latencyMs,
            'total_transactions' => 0,
            'timeout_count' => $result->success ? 0 : 1,
            'last_approved_at' => $result->success ? now() : null,
            'last_failed_at' => $result->success ? null : now(),
        ]);
    }
}
