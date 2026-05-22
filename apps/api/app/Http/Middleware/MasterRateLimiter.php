<?php

declare(strict_types=1);

namespace App\Http\Middleware;

use Closure;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Cache;
use Symfony\Component\HttpFoundation\Response;

class MasterRateLimiter
{
    public function handle(Request $request, Closure $next): Response
    {
        $ip = $request->ip();
        $key = "master_rate_limit:{$ip}";

        $attempts = (int) Cache::get($key, 0);

        if ($attempts >= 3) {
            $bannedKey = "master_banned:{$ip}";
            if (Cache::has($bannedKey)) {
                return response()->json(['error' => 'Too many attempts. Try again later.'], 429);
            }

            Cache::put($bannedKey, true, 900);
            Cache::forget($key);

            return response()->json(['error' => 'Too many attempts. Blocked for 15 minutes.'], 429);
        }

        Cache::put($key, $attempts + 1, 60);

        $response = $next($request);

        if ($response->getStatusCode() === 200) {
            Cache::forget($key);
        }

        return $response;
    }
}
