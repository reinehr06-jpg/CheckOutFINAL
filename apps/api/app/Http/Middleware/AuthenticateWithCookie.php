<?php

declare(strict_types=1);

namespace App\Http\Middleware;

use Closure;
use Illuminate\Http\Request;
use Symfony\Component\HttpFoundation\Response;

class AuthenticateWithCookie
{
    /**
     * Intercepta a requisição e, se houver um cookie basileia_session, injeta-o como Bearer Token.
     */
    public function handle(Request $request, Closure $next): Response
    {
        if (!$request->hasHeader('Authorization')) {
            $token = $request->cookie('basileia_session');
            
            if (!empty($token)) {
                $request->headers->set('Authorization', 'Bearer ' . $token);
            }
        }

        return $next($request);
    }
}
