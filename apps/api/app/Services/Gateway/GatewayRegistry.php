<?php

declare(strict_types=1);

namespace App\Services\Gateway;

use App\Models\Gateway;
use InvalidArgumentException;
use RuntimeException;

class GatewayRegistry
{
    private array $providers = [];

    public function register(string $providerKey, string $driverClass): void
    {
        if (!is_subclass_of($driverClass, GatewayInterface::class)) {
            throw new InvalidArgumentException(
                "Driver {$driverClass} must implement " . GatewayInterface::class
            );
        }

        $this->providers[$providerKey] = [
            'class' => $driverClass,
            'key' => $driverClass::getProviderKey(),
            'methods' => $driverClass::supportedMethods(),
        ];
    }

    public function all(): array
    {
        return $this->providers;
    }

    public function has(string $providerKey): bool
    {
        return isset($this->providers[$providerKey]);
    }

    public function getProvider(string $providerKey): ?array
    {
        return $this->providers[$providerKey] ?? null;
    }

    public function getDriverClass(string $providerKey): string
    {
        if (!isset($this->providers[$providerKey])) {
            throw new InvalidArgumentException(
                "Gateway provider '{$providerKey}' is not registered. Available: " . implode(', ', array_keys($this->providers))
            );
        }

        return $this->providers[$providerKey]['class'];
    }

    public function makeDriver(Gateway $gateway): GatewayInterface
    {
        $type = strtolower($gateway->type ?? $gateway->slug ?? '');

        if (!isset($this->providers[$type])) {
            throw new RuntimeException(
                "GatewayRegistry: no driver registered for type '{$type}'. Available: " . implode(', ', array_keys($this->providers))
            );
        }

        $class = $this->providers[$type]['class'];

        if (!method_exists($class, 'fromGatewayModel')) {
            throw new RuntimeException(
                "Gateway driver {$class} must implement a static fromGatewayModel() factory method."
            );
        }

        return $class::fromGatewayModel($gateway);
    }

    public function getCapabilities(): array
    {
        $capabilities = [];
        foreach ($this->providers as $key => $provider) {
            $capabilities[$key] = [
                'key' => $provider['key'],
                'methods' => $provider['methods'],
            ];
        }
        return $capabilities;
    }
}
