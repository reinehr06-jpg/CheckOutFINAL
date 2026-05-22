<?php

use App\Http\Controllers\Api\V1\MasterAccessController;
use App\Http\Middleware\MasterAccessGuard;
use App\Http\Middleware\MasterRateLimiter;
use Illuminate\Support\Facades\Route;

Route::prefix('v1')
    ->middleware(['api', MasterRateLimiter::class])
    ->group(function () {
        // 2FA + code (acessado via URL dinâmica — MasterRouteServiceProvider)
        // Estes endpoints só existem aqui para compatibilidade com a página do dashboard

        Route::post('auth/master/validate', [MasterAccessController::class, 'validate']);

        Route::middleware('auth:sanctum')->group(function () {
            Route::get('auth/master/companies', [MasterAccessController::class, 'companiesList']);
        });
    });
