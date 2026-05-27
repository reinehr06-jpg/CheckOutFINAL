<?php

namespace App\Http\Controllers\Api\V2;

use App\Http\Controllers\Controller;
use App\Http\Requests\Auth\RegisterCompanyRequest;
use App\Models\RefreshToken;
use App\Models\User;
use App\Services\Audit\AuditService;
use App\Services\Auth\CompanyRegistrationService;
use App\Services\TwoFactorAuthService;
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

        $user = User::whereRaw('LOWER(email) = ?', [strtolower($data['email'])])->first();

        if (! $user || ! Hash::check($data['password'], $user->password)) {
            if ($user) {
                $user->incrementFailedAttempts();
            }
            return response()->json(['message' => 'Credenciais inválidas.'], 401);
        }

        if ($user->isLocked()) {
            return response()->json(['message' => 'Conta temporariamente bloqueada.'], 423);
        }

        if ($user->status !== 'active') {
            return response()->json(['message' => 'Conta inativa.'], 403);
        }

        $user->resetFailedAttempts();

        $tokenInstance = $user->createToken('next-dashboard', ['*'], now()->addMinutes(15));
        $token = $tokenInstance->plainTextToken;

        $refreshTokenData = $this->issueRefreshToken($user, $tokenInstance->accessToken->id);

        (new AuditService())->log('user.login', $user);

        $responseData = [
            'token' => $token,
            'refresh_token' => $refreshTokenData['plain'],
            'expires_in' => 900,
            'user'  => [
                'id'              => $user->uuid,
                'name'            => $user->name,
                'email'           => $user->email,
                'role'            => $user->role,
                'two_factor_enabled' => $user->two_factor_enabled,
                'company_id'      => $user->company_id,
            ],
            'needs_2fa_setup' => !$user->two_factor_enabled,
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
            'id'         => $user->uuid,
            'name'       => $user->name,
            'email'      => $user->email,
            'role'       => $user->role,
            'company_id' => $user->company_id,
            'company'    => $user->company?->only('id', 'name', 'logo_url'),
            'two_factor_enabled' => $user->two_factor_enabled,
        ]);
    }

    public function register(RegisterCompanyRequest $request): JsonResponse
    {
        $service = app(CompanyRegistrationService::class);
        $result = $service->register($request->validated());

        $user = $result['user'];

        $tokenInstance = $user->createToken('next-dashboard', ['*'], now()->addMinutes(15));
        $token = $tokenInstance->plainTextToken;
        $refreshTokenData = $this->issueRefreshToken($user, $tokenInstance->accessToken->id);

        (new AuditService())->log('user.registered', $user, [
            'company_id' => $result['company']->id,
            'country' => $result['company']->country,
        ]);

        $responseData = [
            'token' => $token,
            'refresh_token' => $refreshTokenData['plain'],
            'expires_in' => 900,
            'user' => [
                'id' => $user->uuid,
                'name' => $user->name,
                'email' => $user->email,
                'role' => $user->role,
                'company_id' => $user->company_id,
                'two_factor_enabled' => $user->two_factor_enabled,
            ],
            'needs_2fa_setup' => !$user->two_factor_enabled,
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

    public function setup2fa(Request $request): JsonResponse
    {
        $user = $request->user();
        if (!$user) {
            return response()->json(['message' => 'Não autenticado.'], 401);
        }

        if ($user->two_factor_enabled) {
            return response()->json(['message' => '2FA já está habilitado.'], 409);
        }

        $service = app(TwoFactorAuthService::class);
        $secret = $service->generateSecret();
        $user->update(['two_factor_secret' => $secret]);
        $qrCodeUrl = $service->generateQRCodeUrl($user);

        return response()->json([
            'success' => true,
            'data' => [
                'secret' => $secret,
                'qr_code_url' => $qrCodeUrl,
            ],
        ]);
    }

    public function enable2fa(Request $request): JsonResponse
    {
        $user = $request->user();
        if (!$user) {
            return response()->json(['message' => 'Não autenticado.'], 401);
        }

        $data = $request->validate([
            'code' => 'required|string|size:6',
        ]);

        $service = app(TwoFactorAuthService::class);

        if ($service->enable($user, $data['code'])) {
            $recoveryCodes = $user->two_factor_codes
                ? json_decode(\Illuminate\Support\Facades\Crypt::decryptString($user->two_factor_codes))
                : [];

            return response()->json([
                'success' => true,
                'message' => '2FA habilitado com sucesso.',
                'data' => [
                    'recovery_codes' => $recoveryCodes,
                ],
            ]);
        }

        return response()->json([
            'message' => 'Código inválido. Tente novamente.',
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
