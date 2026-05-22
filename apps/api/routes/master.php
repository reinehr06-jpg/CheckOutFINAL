<?php

use App\Http\Controllers\Api\V1\MasterAccessController;
use App\Http\Middleware\MasterRateLimiter;
use Illuminate\Support\Facades\Route;

Route::prefix('v1')
    ->middleware(['api', 'ip.allowlist', MasterRateLimiter::class])
    ->group(function () {
        Route::post('auth/master/validate', [MasterAccessController::class, 'validate']);

        Route::get('master/link/{token}', [MasterAccessController::class, 'consumeLink'])
            ->name('master.link.consume');

        Route::middleware(['auth:sanctum', 'zero.trust', 'scope.company'])->group(function () {
            Route::get('auth/master/companies', [MasterAccessController::class, 'companiesList']);
            Route::post('master/link', [MasterAccessController::class, 'generateLink']);
        });
    });
