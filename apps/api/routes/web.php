<?php

use Illuminate\Support\Facades\Route;

Route::get('/', function () {
    return redirect(config('app.frontend_url', env('FRONTEND_URL', 'http://localhost:3000')));
});

// /health behind IP allowlist if enabled; no sensitive info leaked
Route::get('/health', function () {
    return response()->json([
        'status'  => 'ok',
        'time'    => now()->toIso8601String(),
    ]);
})->middleware('ip.allowlist');

Route::get('/login', function () {
    return response()->json([
        'message' => 'Please access the dashboard at the frontend URL.',
        'frontend_url' => config('app.frontend_url', env('FRONTEND_URL', 'http://localhost:3000')),
    ]);
});
