<?php

namespace App\Http\Middleware;

use App\Models\TokenAuditLog;
use Closure;
use Illuminate\Http\Request;
use Carbon\Carbon;
use Symfony\Component\HttpFoundation\Response;

class CheckTokenExpiration
{
    public function handle(Request $request, Closure $next): Response
    {
        $user = $request->user();

        if (!$user) {
            return response()->json([
                'success' => false,
                'error' => ['code' => 'unauthenticated', 'message' => 'Não autenticado.']
            ], 401);
        }

        $token = $user->currentAccessToken();

        // Se o token tem prazo de expiração definido e já passou
        if ($token && $token->expires_at && Carbon::now()->greaterThan($token->expires_at)) {
            // Registra como expirado nos logs
            TokenAuditLog::create([
                'user_id'    => $user->id,
                'token_id'   => $token->id,
                'action'     => 'expired',
                'ip_address' => $request->ip(),
                'user_agent' => $request->userAgent(),
                'metadata'   => ['expired_at' => $token->expires_at->toIso8601String()],
            ]);

            // Revoga o token expirado do banco
            $token->delete();

            return response()->json([
                'success' => false,
                'error' => [
                    'code' => 'token_expired',
                    'message' => 'Sua sessão expirou. Faça login novamente.',
                ]
            ], 401);
        }

        return $next($request);
    }
}
