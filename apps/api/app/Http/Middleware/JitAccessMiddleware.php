<?php

namespace App\Http\Middleware;

use Closure;
use Illuminate\Http\Request;
use Symfony\Component\HttpFoundation\Response;

class JitAccessMiddleware
{
    public function handle(Request $request, Closure $next, string $requiredRole): Response
    {
        $user = $request->user();

        if (!$user) {
            return response()->json(['message' => 'Não autenticado.'], 401);
        }

        // Super admin always has access
        if ($user->isSuperAdmin()) {
            return $next($request);
        }

        // Check if user has an active JIT session for the required role
        $hasJit = \App\Models\JitAccessRequest::where('requested_by', $user->id)
            ->where('target_role', $requiredRole)
            ->active()
            ->exists();

        if ($hasJit) {
            return $next($request);
        }

        return response()->json([
            'success' => false,
            'error' => [
                'code' => 'jit_required',
                'message' => 'Ação requer elevação de privilégio JIT. Solicite acesso em /api/v1/jit/request.',
                'required_role' => $requiredRole,
            ],
        ], 403);
    }
}
