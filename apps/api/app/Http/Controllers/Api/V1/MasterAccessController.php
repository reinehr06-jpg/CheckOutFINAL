<?php

namespace App\Http\Controllers\Api\V1;

use App\Http\Controllers\Controller;
use App\Models\User;
use App\Services\Auth\MasterAccessService;
use App\Services\Audit\AuditService;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Cache;
use Illuminate\Support\Facades\Hash;

class MasterAccessController extends Controller
{
    private MasterAccessService $masterService;

    public function __construct(MasterAccessService $masterService)
    {
        $this->masterService = $masterService;
    }

    public function code(): JsonResponse
    {
        $code = $this->masterService->generateCode();
        $expiresIn = 20 - (time() % 20);

        return response()->json([
            'success' => true,
            'data' => [
                'code' => $code,
                'expires_in' => $expiresIn,
                'email' => $this->masterService->getMasterEmail(),
            ],
        ]);
    }

    public function validate(Request $request): JsonResponse
    {
        $data = $request->validate([
            'email' => 'required|email',
            'password' => 'required|string',
        ]);

        $masterEmail = $this->masterService->getMasterEmail();

        if (strtolower($data['email']) !== strtolower($masterEmail)) {
            return response()->json(['message' => 'Credenciais inválidas.'], 401);
        }

        if (!$this->masterService->validateCode($data['password'])) {
            (new AuditService())->log('master.login.failed', (object)[
                'ip' => $request->ip(),
                'user_agent' => $request->userAgent(),
            ]);

            return response()->json(['message' => 'Credenciais inválidas.'], 401);
        }

        $user = User::where('email', $masterEmail)->first();

        if (!$user || $user->role !== 'super_admin') {
            return response()->json(['message' => 'Credenciais inválidas.'], 401);
        }

        $token = $user->createToken('master-access')->plainTextToken;

        (new AuditService())->log('master.login.success', $user);

        $response = response()->json([
            'token' => $token,
            'user' => [
                'id' => $user->id,
                'name' => $user->name,
                'email' => $user->email,
                'role' => $user->role,
                'is_master' => true,
            ],
        ]);

        $response->headers->set('Set-Cookie', implode('; ', [
            "basileia_session={$token}",
            'HttpOnly',
            'Secure',
            'SameSite=Lax',
            'Path=/',
            'Max-Age=86400',
        ]));

        return $response;
    }

    public function companiesList(Request $request): JsonResponse
    {
        $user = $request->user();
        if (!$user || !$user->isSuperAdmin()) {
            return response()->json(['message' => 'Não autorizado.'], 403);
        }

        $companies = \App\Models\Company::select('id', 'uuid', 'name', 'slug', 'status')
            ->orderBy('name')
            ->get();

        return response()->json([
            'success' => true,
            'data' => $companies,
        ]);
    }
}
