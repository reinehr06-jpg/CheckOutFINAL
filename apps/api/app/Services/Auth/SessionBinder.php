<?php

declare(strict_types=1);

namespace App\Services\Auth;

use Illuminate\Http\Request;

class SessionBinder
{
    public function fingerprint(Request $request): string
    {
        return hash('sha256', implode('|', [
            $request->ip(),
            $request->userAgent(),
            config('master.url_seed', ''),
        ]));
    }

    public function bind(Request $request): void
    {
        session()->put('master_fingerprint', $this->fingerprint($request));
        session()->put('master_bound_at', now()->timestamp);
    }

    public function check(Request $request): bool
    {
        $stored = session()->get('master_fingerprint');
        if (empty($stored)) {
            return false;
        }
        return hash_equals($stored, $this->fingerprint($request));
    }

    public function isExpired(): bool
    {
        $boundAt = session()->get('master_bound_at', 0);
        return (now()->timestamp - $boundAt) > 1200;
    }
}
