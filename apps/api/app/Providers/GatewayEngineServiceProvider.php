<?php

declare(strict_types=1);

namespace App\Providers;

use App\Services\Gateway\AsaasGateway;
use App\Services\Gateway\CircuitBreaker;
use App\Services\Gateway\CredentialManager;
use App\Services\Gateway\GatewayEngine;
use App\Services\Gateway\GatewayRegistry;
use App\Services\Gateway\PagBankGateway;
use Illuminate\Support\ServiceProvider;

class GatewayEngineServiceProvider extends ServiceProvider
{
    public function register(): void
    {
        $this->app->singleton(GatewayRegistry::class, function () {
            $registry = new GatewayRegistry();

            $registry->register('asaas', AsaasGateway::class);
            $registry->register('pagbank', PagBankGateway::class);

            return $registry;
        });

        $this->app->singleton(CredentialManager::class, function () {
            return new CredentialManager();
        });

        $this->app->singleton(CircuitBreaker::class, function () {
            return new CircuitBreaker();
        });

        $this->app->singleton(GatewayEngine::class, function ($app) {
            return new GatewayEngine(
                $app[GatewayRegistry::class],
                $app[CredentialManager::class],
                $app[CircuitBreaker::class],
            );
        });
    }

    public function boot(): void
    {
        //
    }
}
