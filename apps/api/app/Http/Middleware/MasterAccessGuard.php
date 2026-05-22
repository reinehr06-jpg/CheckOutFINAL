<?php

namespace App\Http\Middleware;

use App\Services\Auth\MasterUrlService;
use Closure;
use Illuminate\Http\Request;
use Symfony\Component\HttpFoundation\Response;

class MasterAccessGuard
{
    public function handle(Request $request, Closure $next): Response
    {
        try {
            $service = app(MasterUrlService::class);
        } catch (\RuntimeException) {
            abort(404);
        }

        $requestPath = trim($request->path(), '/');

        if (!$service->isValidPath($requestPath)) {
            abort(404);
        }

        return $next($request);
    }
}
