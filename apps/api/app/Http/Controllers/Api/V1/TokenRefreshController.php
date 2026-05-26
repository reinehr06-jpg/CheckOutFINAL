<?php

namespace App\Http\Controllers\Api\V1;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Str;
use Carbon\Carbon;

class TokenRefreshController extends Controller
{
    /**
     * Atualiza o token de acesso (access token) e rotaciona o refresh token.
     * Implementação de Refresh Token Rotation para mitigar roubo de tokens.
     */
    public function refresh(Request $request)
    {
        $request->validate([
            'refresh_token' => 'required|string',
        ]);

        $tokenStr = $request->input('refresh_token');

        // Busca o refresh token (hash SHA-256 armazenado no banco se necessário,
        // ou plain-text dependendo da implementação. Usaremos plain-text indexado aqui)
        $refreshToken = DB::table('refresh_tokens')
            ->where('token', hash('sha256', $tokenStr))
            ->first();

        if (!$refreshToken) {
            return response()->json(['message' => 'Refresh token inválido ou já revogado.'], 401);
        }

        // Se o token já foi usado (rotation foi comprometido ou duplo envio lícito mas tardio)
        if ($refreshToken->revoked_at) {
            // DETECTADO REPLAY ATTACK: um refresh token já usado tentou ser usado novamente.
            // Revoga TODOS os refresh tokens ativos deste usuário imediatamente (ou os descendentes da mesma família).
            DB::table('refresh_tokens')
                ->where('user_id', $refreshToken->user_id)
                ->update(['revoked_at' => now()]);

            // Também revoga os tokens Sanctum ativos associados a essa sessão/usuário
            // (Assumindo que temos o user_id)
            $user = \App\Models\User::find($refreshToken->user_id);
            if ($user) {
                $user->tokens()->delete();
                \Illuminate\Support\Facades\Log::alert("Token replay attack detectado. Todas as sessões revogadas para o usuário {$user->id}.");
            }

            return response()->json(['message' => 'Tentativa de reuso de token detectada. Sessão encerrada por segurança.'], 403);
        }

        // Verifica expiração
        if (Carbon::parse($refreshToken->expires_at)->isPast()) {
            return response()->json(['message' => 'Refresh token expirado. Faça login novamente.'], 401);
        }

        // Token válido: Revoga o token atual (marcado como usado)
        DB::table('refresh_tokens')
            ->where('id', $refreshToken->id)
            ->update(['revoked_at' => now()]);

        // Gera novo par de tokens (Access Token Sanctum + Novo Refresh Token)
        $user = \App\Models\User::find($refreshToken->user_id);

        if (!$user || $user->status !== 'active' || $user->isLocked()) {
            return response()->json(['message' => 'Usuário inativo ou bloqueado.'], 403);
        }

        // Gera novo Sanctum Access Token
        // Revoga o token sanctum atrelado a este refresh (opcional, pode deixar expirar)
        // Por segurança extra, vamos revogar o específico (se tivermos a relação)
        // ou simplesmente gerar um novo e depender da expiração curta.
        $newAccessToken = $user->createToken('dashboard_access')->plainTextToken;

        // Gera novo Refresh Token
        $rawRefreshToken = Str::random(60);
        $hashedRefreshToken = hash('sha256', $rawRefreshToken);

        DB::table('refresh_tokens')->insert([
            'user_id' => $user->id,
            'token' => $hashedRefreshToken,
            'family_id' => $refreshToken->family_id ?? Str::uuid(), // Mantém a família
            'expires_at' => now()->addDays(7),
            'created_at' => now(),
        ]);

        return response()->json([
            'access_token' => $newAccessToken,
            'refresh_token' => $rawRefreshToken, // Apenas este retorno conhecerá o raw token
            'token_type' => 'Bearer',
        ]);
    }
}
