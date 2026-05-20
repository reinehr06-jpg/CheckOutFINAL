<?php

use Illuminate\Support\Facades\Route;

Route::get('/', function () {
    return redirect(config('app.frontend_url', env('FRONTEND_URL', 'http://localhost:3000')));
});

Route::get('/health', function () {
    return response()->json([
        'status'  => 'ok',
        'mode'    => 'api-only',
        'version' => config('app.version', '2.0'),
        'time'    => now()->toIso8601String(),
    ]);
});

Route::get('/login', function () {
    return response()->json([
        'message' => 'Please access the dashboard at the frontend URL.',
        'frontend_url' => config('app.frontend_url', env('FRONTEND_URL', 'http://localhost:3000')),
    ]);
});
