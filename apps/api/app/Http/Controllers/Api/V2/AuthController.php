<?php

namespace App\Http\Controllers\Api\V2;

use App\Http\Controllers\Controller;
use App\Models\RefreshToken;
use App\Models\User;
use App\Services\Audit\AuditService;
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

        $user = User::where('email', $data['email'])->first();

        if (! $user || ! Hash::check($data['password'], $user->password)) {
            return response()->json(['message' => 'Credenciais inválidas.'], 401);
        }

        if ($user->status !== 'active') {
            return response()->json(['message' => 'Conta inativa.'], 403);
        }

        if ($user->locked_until && now()->lessThan($user->locked_until)) {
            return response()->json(['message' => 'Conta temporariamente bloqueada.'], 423);
        }

        $user->update(['failed_login_attempts' => 0, 'locked_until' => null]);

        $tokenInstance = $user->createToken('next-dashboard', ['*'], now()->addMinutes(15));
        $token = $tokenInstance->plainTextToken;

        $refreshTokenData = $this->issueRefreshToken($user, $tokenInstance->accessToken->id);

        (new AuditService())->log('user.login', $user);

        $responseData = [
            'token' => $token,
            'refresh_token' => $refreshTokenData['plain'],
            'expires_in' => 900,
            'user'  => [
                'id'              => $user->id,
                'name'            => $user->name,
                'email'           => $user->email,
                'role'            => $user->role,
                'two_factor_enabled' => $user->two_factor_enabled,
                'company_id'      => $user->company_id,
            ],
        ];

        $response = response()->json($responseData);

        $response->headers->set('Set-Cookie', implode('; ', [
            "basileia_session={$token}",
            'HttpOnly',
            'Secure',
            'SameSite=Lax',
            'Path=/',
            'Max-Age=900',
        ]));

        return $response;
    }

    public function refresh(Request $request): JsonResponse
    {
        $data = $request->validate([
            'refresh_token' => 'required|string',
        ]);

        $refreshHash = hash('sha256', $data['refresh_token']);
        $storedToken = RefreshToken::where('refresh_token_hash', $refreshHash)->first();

        if (!$storedToken || !$storedToken->isValid()) {
            return response()->json(['message' => 'Refresh token inválido ou expirado.'], 401);
        }

        $user = User::find($storedToken->user_id);
        if (!$user || $user->status !== 'active') {
            return response()->json(['message' => 'Conta inativa.'], 403);
        }

        // Revoke old tokens
        $storedToken->update(['revoked_at' => now()]);
        $user->tokens()->where('id', $storedToken->token_id)->delete();

        // Issue new pair
        $newTokenInstance = $user->createToken('next-dashboard', ['*'], now()->addMinutes(15));
        $newToken = $newTokenInstance->plainTextToken;

        $refreshTokenData = $this->issueRefreshToken($user, $newTokenInstance->accessToken->id);

        (new AuditService())->log('user.token.refresh', $user);

        $response = response()->json([
            'token' => $newToken,
            'refresh_token' => $refreshTokenData['plain'],
            'expires_in' => 900,
        ]);

        $response->headers->set('Set-Cookie', implode('; ', [
            "basileia_session={$newToken}",
            'HttpOnly',
            'Secure',
            'SameSite=Lax',
            'Path=/',
            'Max-Age=900',
        ]));

        return $response;
    }

    public function logout(Request $request): JsonResponse
    {
        $user = $request->user();
        $token = $user->currentAccessToken();

        if ($token) {
            RefreshToken::where('token_id', $token->id)->update(['revoked_at' => now()]);
            $token->delete();
        }

        return response()->json(['message' => 'Deslogado com sucesso.']);
    }

    public function me(Request $request): JsonResponse
    {
        $user = $request->user()->load('company');
        return response()->json([
            'id'         => $user->id,
            'name'       => $user->name,
            'email'      => $user->email,
            'role'       => $user->role,
            'company_id' => $user->company_id,
            'company'    => $user->company?->only('id', 'name', 'logo_url'),
            'two_factor_enabled' => $user->two_factor_enabled,
        ]);
    }

    public function verify2fa(Request $request): JsonResponse
    {
        $user = $request->user();
        if (!$user) {
            return response()->json(['message' => 'Não autenticado.'], 401);
        }

        $data = $request->validate([
            'code' => 'required|string|size:6',
        ]);

        $twoFactorService = app(\App\Services\TwoFactorAuthService::class);

        if ($twoFactorService->verifyCode($user, $data['code'])) {
            $user->update(['last_auth_at' => now()]);
            return response()->json([
                'success' => true,
                'message' => '2FA verificado com sucesso.',
            ]);
        }

        return response()->json([
            'message' => 'Código inválido ou expirado.',
        ], 422);
    }

    private function issueRefreshToken(User $user, int $tokenId): array
    {
        $plain = bin2hex(random_bytes(32));
        $hash = hash('sha256', $plain);

        RefreshToken::create([
            'user_id' => $user->id,
            'token_id' => $tokenId,
            'refresh_token_hash' => $hash,
            'expires_at' => now()->addDays(7),
        ]);

        return ['plain' => $plain, 'hash' => $hash];
    }
}
