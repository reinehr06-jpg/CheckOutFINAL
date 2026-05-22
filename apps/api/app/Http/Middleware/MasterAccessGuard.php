<?php

namespace App\Http\Middleware;

use App\Services\Auth\MasterAccessService;
use Closure;
use Illuminate\Http\Request;
use Symfony\Component\HttpFoundation\Response;

class MasterAccessGuard
{
    public function handle(Request $request, Closure $next): Response
    {
        $service = app(MasterAccessService::class);
        $expectedPath = $service->generateSecretPath();

        $requestPath = trim($request->path(), '/');
        $requestPath = preg_replace('#^api/v1/#', '', $requestPath);

        if ($requestPath !== $expectedPath) {
            abort(404);
        }

        return $next($request);
    }
}
