<?php

namespace App\Http\Middleware;

use Closure;
use Illuminate\Http\Request;
use Symfony\Component\HttpFoundation\Response;

class EnsureTwoFactorVerified
{
    /**
     * Handle an incoming request.
     */
    public function handle(Request $request, Closure $next): Response
    {
        $user = $request->user();

        // Se não estiver logado, o auth:sanctum já cuidou disso, mas por segurança:
        if (!$user) {
            return $next($request);
        }

        // Se o usuário não tem 2FA habilitado, segue fluxo
        if (!$user->two_factor_enabled) {
            return $next($request);
        }

        // 100% STATELESS E INFALÍVEL: Verifica se a "ability" de 2fa:verified está no token!
        // Como o token está no banco de dados, isso funciona em Vercel, Serverless, Load Balancers, etc.
        $isVerified = false;

        $token = $user->currentAccessToken();
        if ($token && is_array($token->abilities)) {
            $isVerified = in_array('2fa:verified', $token->abilities);
        }

        if (!$isVerified) {
            $isVerified = $request->session()->get('2fa_verified_at') 
                || $request->attributes->get('2fa_verified_at');
        }

        if (!$isVerified) {
            return response()->json([
                'success' => false,
                'error' => [
                    'code' => 'two_factor_required',
                    'message' => 'Confirme o código de segurança (2FA) para continuar.',
                    'request_id' => $request->header('X-Request-Id')
                ]
            ], 403);
        }

        return $next($request);
    }
}
