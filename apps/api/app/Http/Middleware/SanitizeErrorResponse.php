<?php

namespace App\Http\Middleware;

use Closure;
use Illuminate\Http\Request;
use Symfony\Component\HttpFoundation\Response;

class SanitizeErrorResponse
{
    public function handle(Request $request, Closure $next): Response
    {
        $response = $next($request);

        if (!app()->isProduction()) {
            return $response;
        }

        if ($response->isServerError() || $response->isNotFound()) {
            if ($response->headers->get('Content-Type') === 'application/json') {
                $content = json_decode($response->getContent(), true);

                if (is_array($content)) {
                    unset($content['file'], $content['line'], $content['trace'],
                          $content['exception'], $content['previous']);

                    $response->setContent(json_encode($content));
                }
            }
        }

        return $response;
    }
}
