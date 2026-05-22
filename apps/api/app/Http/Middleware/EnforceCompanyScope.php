<?php

namespace App\Http\Middleware;

use Closure;
use Illuminate\Http\Request;
use Symfony\Component\HttpFoundation\Response;

class EnforceCompanyScope
{
    public function handle(Request $request, Closure $next): Response
    {
        $user = $request->user();
        if (!$user) {
            return $next($request);
        }

        // Super admin can access all companies
        if ($user->isSuperAdmin()) {
            return $next($request);
        }

        $userCompanyId = $user->company_id;

        // User without company can't access company-scoped resources
        if (!$userCompanyId) {
            return response()->json([
                'success' => false,
                'error' => ['code' => 'no_company', 'message' => 'Usuário sem empresa vinculada.'],
            ], 403);
        }

        // Store user company in request for downstream use
        $request->attributes->set('user_company_id', $userCompanyId);

        // If request targets a specific company, verify match
        $targetCompanyId = $request->route('company_id')
            ?? $request->input('company_id')
            ?? $request->header('X-Company-Id');

        if ($targetCompanyId && (int) $targetCompanyId !== $userCompanyId) {
            logger()->warning('EnforceCompanyScope: cross-company access denied', [
                'user_id' => $user->id,
                'user_company' => $userCompanyId,
                'target_company' => $targetCompanyId,
            ]);
            return response()->json([
                'success' => false,
                'error' => ['code' => 'cross_company_denied', 'message' => 'Acesso negado a empresa diferente da sua.'],
            ], 403);
        }

        return $next($request);
    }
}
