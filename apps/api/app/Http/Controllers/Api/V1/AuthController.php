<?php

namespace App\Http\Controllers\Api\V1;

use App\Http\Controllers\Controller;
use App\Models\User;
use App\Services\Audit\AuditService;
use App\Services\Auth\MasterAccessService;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Hash;

class AuthController extends Controller
{
    public function login(Request $request): JsonResponse
    {
        $data = $request->validate([
            'email'    => 'required|email',
            'password' => 'required',
        ]);

        $masterService = app(MasterAccessService::class);

        // Master admin login via TOTP
        if (strtolower($data['email']) === strtolower($masterService->getMasterEmail())) {
            if (!$masterService->validateCode($data['password'])) {
                return response()->json([
                    'success' => false,
                    'error' => [
                        'code' => 'invalid_credentials',
                        'message' => 'Email ou senha inválidos.',
                        'request_id' => $request->attributes->get('request_id'),
                    ]
                ], 401);
            }

            $user = User::where('email', $data['email'])->first();
            if (!$user || $user->role !== 'super_admin') {
                return response()->json([
                    'success' => false,
                    'error' => ['code' => 'invalid_credentials', 'message' => 'Email ou senha inválidos.']
                ], 401);
            }

            return $this->createSession($user, $request, 'dashboard-v1-master');
        }

        // Regular user login
        $user = User::where('email', $data['email'])->first();

        if (!$user || !Hash::check($data['password'], $user->password)) {
            return response()->json([
                'success' => false,
                'error' => [
                    'code' => 'invalid_credentials',
                    'message' => 'Email ou senha inválidos.',
                    'request_id' => $request->attributes->get('request_id'),
                ]
            ], 401);
        }

        if ($user->status !== 'active') {
            return response()->json([
                'success' => false,
                'error' => [
                    'code' => 'account_inactive',
                    'message' => 'Esta conta está inativa.',
                    'request_id' => $request->attributes->get('request_id'),
                ]
            ], 403);
        }

        return $this->createSession($user, $request, 'dashboard-v1');
    }

    private function createSession(User $user, Request $request, string $tokenName): JsonResponse
    {
        $tokenInstance = $user->createToken($tokenName);
        $token = $tokenInstance->plainTextToken;

        \Illuminate\Support\Facades\DB::table('user_sessions')->insert([
            'user_id' => $user->id,
            'token_id' => $tokenInstance->accessToken->id,
            'ip_address' => $request->ip(),
            'user_agent' => $request->userAgent(),
            'created_at' => now(),
            'updated_at' => now(),
        ]);

        $response = response()->json([
            'success' => true,
            'data' => [
                'token' => $token,
                'user'  => [
                    'id'    => $user->uuid,
                    'name'  => $user->name,
                    'email' => $user->email,
                    'role'  => $user->role,
                    'is_master' => $user->role === 'super_admin',
                ],
            ]
        ]);

        // Set HttpOnly cookie for proxy.ts
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

    public function me(Request $request): JsonResponse
    {
        $user = $request->user();
        return response()->json([
            'success' => true,
            'data' => [
                'user' => [
                    'id'    => $user->uuid,
                    'name'  => $user->name,
                    'email' => $user->email,
                    'role'  => $user->role,
                    'company_id' => $user->company_id,
                ],
            ]
        ]);
    }

    public function forgotPassword(Request $request, \App\Services\Security\PasswordResetService $resetService): JsonResponse
    {
        $request->validate(['email' => 'required|email']);
        
        $user = User::where('email', $request->email)->first();
        
        if ($user) {
            $token = $resetService->createToken($user);
        }

        return response()->json([
            'success' => true,
            'message' => 'Se este e-mail estiver cadastrado, enviaremos instruções para redefinir sua senha.'
        ]);
    }

    public function resetPassword(Request $request, \App\Services\Security\PasswordResetService $resetService): JsonResponse
    {
        $request->validate([
            'email' => 'required|email',
            'token' => 'required|string',
            'password' => 'required|string|min:8|confirmed',
        ]);

        $success = $resetService->reset($request->email, $request->token, $request->password);

        if (!$success) {
            return response()->json([
                'success' => false,
                'error' => [
                    'code' => 'invalid_or_expired_token',
                    'message' => 'Este link de redefinição expirou ou já foi utilizado.'
                ]
            ], 400);
        }

        return response()->json([
            'success' => true,
            'message' => 'Senha redefinida com sucesso.'
        ]);
    }
}
