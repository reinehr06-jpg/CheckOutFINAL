<?php

declare(strict_types=1);

namespace App\Providers;

use App\Http\Controllers\Api\V1\MasterAccessController;
use App\Http\Middleware\Master2FAMiddleware;
use App\Http\Middleware\MasterRateLimiter;
use App\Services\Auth\MasterUrlService;
use Illuminate\Support\Facades\Route;
use Illuminate\Support\ServiceProvider;

class MasterRouteServiceProvider extends ServiceProvider
{
    public function boot(): void
    {
        $this->registerDynamicRoute();
        $this->registerApiRoutes();
    }

    private function registerDynamicRoute(): void
    {
        try {
            $urlService = $this->app->make(MasterUrlService::class);
            $path = $urlService->todayPath();
        } catch (\RuntimeException) {
            return;
        }

        $cleanPath = trim($path, '/');

        Route::middleware(['web', 'ip.allowlist', MasterRateLimiter::class])
            ->prefix($cleanPath)
            ->group(function () {
                Route::get('/', [MasterAccessController::class, 'showPage'])->name('master.page');
                Route::get('/url', [MasterAccessController::class, 'urlInfo'])->name('master.url-info');

                Route::post('/webauthn/register/begin', [MasterAccessController::class, 'webauthnRegisterBegin'])
                    ->name('master.webauthn.register.begin');
                Route::post('/webauthn/register/complete', [MasterAccessController::class, 'webauthnRegisterComplete'])
                    ->name('master.webauthn.register.complete');
                Route::match(['GET', 'POST'], '/webauthn/authenticate/begin', [MasterAccessController::class, 'webauthnAuthenticateBegin'])
                    ->name('master.webauthn.auth.begin');
                Route::post('/webauthn/authenticate/complete', [MasterAccessController::class, 'webauthnAuthenticateComplete'])
                    ->name('master.webauthn.auth.complete');
                Route::get('/webauthn/status', [MasterAccessController::class, 'webauthnStatus'])
                    ->name('master.webauthn.status');

                Route::post('/totp/fallback', [MasterAccessController::class, 'totpFallback'])
                    ->name('master.totp.fallback');

                Route::get('/code', [MasterAccessController::class, 'code'])
                    ->middleware(Master2FAMiddleware::class)
                    ->name('master.code');

                Route::post('/login', [MasterAccessController::class, 'validate'])
                    ->name('master.login');
            });
    }

    private function registerApiRoutes(): void
    {
        Route::middleware(['api'])
            ->prefix('api/v1')
            ->group(function () {
                Route::get('/master/webauthn/status', [MasterAccessController::class, 'webauthnStatus'])
                    ->name('api.master.webauthn.status');
            });
    }
}
