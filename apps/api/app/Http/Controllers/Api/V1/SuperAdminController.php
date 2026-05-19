<?php

namespace App\Http\Controllers\Api\V1;

use App\Http\Controllers\Controller;
use App\Models\Company;
use App\Models\ImpersonationSession;
use App\Models\User;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Cache;

class SuperAdminController extends Controller
{
    public function companies(Request $request): JsonResponse
    {
        $query = Company::query()->withCount([
            'users',
            'connectedSystems',
            'checkoutExperiences',
        ]);

        if ($request->filled('search')) {
            $search = $request->search;
            $query->where(function ($q) use ($search) {
                $q->where('name', 'like', "%{$search}%")
                  ->orWhere('slug', 'like', "%{$search}%")
                  ->orWhere('email', 'like', "%{$search}%");
            });
        }

        if ($request->filled('status')) {
            $query->where('status', $request->status);
        }

        $companies = $query->orderBy('created_at', 'desc')
            ->paginate($request->get('per_page', 20));

        return response()->json([
            'success' => true,
            'data' => $companies,
        ]);
    }

    public function companyUsers(int $companyId): JsonResponse
    {
        $company = Company::find($companyId);

        if (!$company) {
            return response()->json([
                'success' => false,
                'error' => 'company_not_found',
            ], 404);
        }

        $users = User::where('company_id', $companyId)
            ->select('id', 'uuid', 'name', 'email', 'role', 'status',
                     'two_factor_enabled', 'last_login_at', 'created_at')
            ->orderBy('created_at', 'desc')
            ->get();

        return response()->json([
            'success' => true,
            'data' => [
                'company' => [
                    'id' => $company->id,
                    'name' => $company->name,
                    'slug' => $company->slug,
                    'status' => $company->status,
                ],
                'users' => $users,
            ],
        ]);
    }

    public function startImpersonation(Request $request): JsonResponse
    {
        $user = $request->user();

        if (!$user->canImpersonate()) {
            return response()->json([
                'success' => false,
                'error' => 'forbidden',
            ], 403);
        }

        $data = $request->validate([
            'company_id' => 'required|integer|exists:companies,id',
            'user_id' => 'nullable|integer|exists:users,id',
            'reason' => 'nullable|string|max:500',
        ]);

        $impersonationKey = 'impersonate_' . $user->id;
        Cache::forget($impersonationKey);

        $company = Company::find($data['company_id']);

        $session = ImpersonationSession::create([
            'super_admin_id' => $user->id,
            'target_company_id' => $data['company_id'],
            'target_user_id' => $data['user_id'] ?? null,
            'ip_address' => $request->ip(),
            'user_agent' => $request->userAgent(),
            'reason' => $data['reason'] ?? null,
            'started_at' => now(),
        ]);

        Cache::put($impersonationKey, [
            'company_id' => $data['company_id'],
            'user_id' => $data['user_id'] ?? null,
            'session_id' => $session->id,
            'started_at' => now()->toISOString(),
        ], now()->addHours(4));

        \App\Models\AuditLog::create([
            'uuid' => \Illuminate\Support\Str::uuid(),
            'company_id' => null,
            'user_id' => $user->id,
            'event' => 'super_admin.impersonation_started',
            'entity_type' => 'company',
            'entity_id' => $data['company_id'],
            'metadata' => [
                'target_company' => $company->name,
                'target_user_id' => $data['user_id'] ?? null,
                'reason' => $data['reason'] ?? null,
                'session_id' => $session->id,
            ],
            'ip_address_hash' => hash('sha256', $request->ip()),
            'user_agent' => $request->userAgent(),
            'request_id' => $request->attributes->get('request_id'),
        ]);

        return response()->json([
            'success' => true,
            'message' => "Impersonando empresa: {$company->name}",
            'data' => [
                'company' => [
                    'id' => $company->id,
                    'name' => $company->name,
                    'slug' => $company->slug,
                ],
                'session_id' => $session->id,
            ],
        ]);
    }

    public function stopImpersonation(Request $request): JsonResponse
    {
        $user = $request->user();
        $impersonationKey = 'impersonate_' . $user->id;
        $data = Cache::get($impersonationKey);

        if (!$data) {
            return response()->json([
                'success' => false,
                'error' => 'not_impersonating',
            ], 400);
        }

        if (isset($data['session_id'])) {
            $session = ImpersonationSession::find($data['session_id']);
            if ($session) {
                $session->end();
            }
        }

        Cache::forget($impersonationKey);

        return response()->json([
            'success' => true,
            'message' => 'Impersonacao encerrada.',
        ]);
    }

    public function impersonationStatus(Request $request): JsonResponse
    {
        $user = $request->user();
        $impersonationKey = 'impersonate_' . $user->id;
        $data = Cache::get($impersonationKey);

        if (!$data) {
            return response()->json([
                'success' => true,
                'impersonating' => false,
            ]);
        }

        $company = Company::find($data['company_id']);

        return response()->json([
            'success' => true,
            'impersonating' => true,
            'data' => [
                'company' => $company ? [
                    'id' => $company->id,
                    'name' => $company->name,
                    'slug' => $company->slug,
                ] : null,
                'started_at' => $data['started_at'],
            ],
        ]);
    }

    public function impersonationHistory(Request $request): JsonResponse
    {
        $user = $request->user();

        $sessions = ImpersonationSession::where('super_admin_id', $user->id)
            ->with(['targetCompany:id,name,slug', 'targetUser:id,name,email'])
            ->orderBy('started_at', 'desc')
            ->paginate(20);

        return response()->json([
            'success' => true,
            'data' => $sessions,
        ]);
    }
}
