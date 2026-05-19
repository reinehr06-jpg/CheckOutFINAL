<?php

namespace App\Http\Middleware;

use App\Models\Company;
use App\Services\TenantContext;
use Closure;
use Illuminate\Http\Request;

class SetTenantContext
{
    /**
     * Para requests autenticados via Sanctum (dashboard),
     * seta o TenantContext baseado no company_id do usuario.
     */
    public function handle(Request $request, Closure $next)
    {
        $user = $request->user();

        if (!$user) {
            return $next($request);
        }

        // Super admin sem company_id: nao seta tenant, permite acesso total
        if ($user->role === 'super_admin' && !$user->company_id) {
            // Nao seta TenantContext - super admin tem acesso a tudo
            // Controllers devem verificar isSuperAdmin() e ajustar queries
            return $next($request);
        }

        // Se o usuario tem company_id, seta o tenant
        if ($user->company_id) {
            $company = Company::find($user->company_id);
            if ($company) {
                TenantContext::set($company, null, null, $company->settings['environment'] ?? 'production');
            }
        }

        return $next($request);
    }
}
