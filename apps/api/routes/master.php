<?php

use Illuminate\Support\Facades\Route;
use App\Http\Controllers\Api\V1\MasterAccessController;

Route::prefix('v1')->group(function () {
    Route::get('auth/master/code', [MasterAccessController::class, 'code']);
    Route::post('auth/master/validate', [MasterAccessController::class, 'validate']);

    Route::middleware('auth:sanctum')->group(function () {
        Route::get('auth/master/companies', [MasterAccessController::class, 'companiesList']);
    });
});
