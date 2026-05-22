<?php

namespace App\Http\Middleware;

use Closure;
use Illuminate\Http\Request;
use Symfony\Component\HttpFoundation\Response;

class IpAllowlist
{
    private const TRUSTED_PROXIES = ['10.0.0.0/8', '172.16.0.0/12', '192.168.0.0/16'];

    public function handle(Request $request, Closure $next): Response
    {
        $ip = $request->ip();

        $mode = config('security.ip_allowlist.mode', 'off');

        if ($mode === 'off') {
            return $next($request);
        }

        $allowedIps = config('security.ip_allowlist.ips', []);

        foreach ($allowedIps as $allowed) {
            if ($this->ipMatches($ip, $allowed)) {
                return $next($request);
            }
        }

        $this->logBlocked($request, $ip);

        return response()->json([
            'success' => false,
            'error' => [
                'code' => 'ip_blocked',
                'message' => 'Acesso não autorizado desta origem.',
            ],
        ], 403);
    }

    private function ipMatches(string $ip, string $cidr): bool
    {
        if (str_contains($cidr, '/')) {
            return $this->cidrMatch($ip, $cidr);
        }
        return $ip === $cidr;
    }

    private function cidrMatch(string $ip, string $cidr): bool
    {
        $parts = explode('/', $cidr);
        $range = $parts[0];
        $prefix = (int) ($parts[1] ?? 32);

        $ipLong = ip2long($ip);
        $rangeLong = ip2long($range);

        if ($ipLong === false || $rangeLong === false) {
            return false;
        }

        $mask = -1 << (32 - $prefix);

        return ($ipLong & $mask) === ($rangeLong & $mask);
    }

    private function logBlocked(Request $request, string $ip): void
    {
        logger()->warning('IpAllowlist blocked request', [
            'ip' => hash('sha256', $ip),
            'path' => $request->path(),
            'method' => $request->method(),
            'user_agent' => $request->userAgent(),
        ]);
    }
}
