<?php

declare(strict_types=1);

namespace App\Http\Middleware;

use Closure;
use Illuminate\Http\Request;
use Symfony\Component\HttpFoundation\Response;

class Master2FAMiddleware
{
    public function handle(Request $request, Closure $next): Response
    {
        if (!session()->has('master_2fa_verified') || session('master_2fa_verified') !== true) {
            return response()->json(['error' => '2FA required'], 403);
        }

        if (session()->get('master_2fa_expires', 0) < now()->timestamp) {
            session()->forget('master_2fa_verified');
            session()->forget('master_2fa_expires');
            return response()->json(['error' => '2FA session expired'], 403);
        }

        return $next($request);
    }
}
