<?php

declare(strict_types=1);

namespace App\Helpers;

use Illuminate\Http\JsonResponse;

/**
 * Respostas JSON padronizadas para toda a camada de checkout.
 *
 * [Fase 3.4] Substitui todas as respostas response()->json() manuais
 * por chamadas estáticas com formato consistente.
 */
class CheckoutResponse
{
    /**
     * Resposta de sucesso.
     *
     * @param  mixed  $data    Dados da resposta (opcional).
     * @param  string $message Mensagem de sucesso.
     * @param  int    $status  Código HTTP (default 200).
     */
    public static function success(mixed $data = null, string $message = 'OK', int $status = 200): JsonResponse
    {
        return response()->json([
            'ok'     => true,
            'status' => 'success',
            'message' => $message,
            'data'   => $data,
        ], $status);
    }

    /**
     * Resposta de erro.
     *
     * @param  string     $message Descrição do erro.
     * @param  int        $status  Código HTTP (default 400).
     * @param  array|null $extra   Campos extras para incluir no payload.
     */
    public static function error(string $message, int $status = 400, ?array $extra = null): JsonResponse
    {
        $payload = [
            'ok'     => false,
            'status' => 'error',
            'error'  => $message,
        ];

        if ($extra !== null) {
            $payload = array_merge($payload, $extra);
        }

        return response()->json($payload, $status);
    }

    /**
     * Resposta de erro de validação.
     *
     * @param  string $message Mensagem geral.
     * @param  array  $errors  Mapa campo → mensagens.
     * @param  int    $status  Código HTTP (default 422).
     */
    public static function validationError(string $message, array $errors, int $status = 422): JsonResponse
    {
        return response()->json([
            'ok'     => false,
            'status' => 'error',
            'error'  => $message,
            'errors' => $errors,
        ], $status);
    }

    /**
     * Atalho para erro 404.
     *
     * @param  string $message Mensagem (default "Recurso não encontrado").
     */
    public static function notFound(string $message = 'Recurso não encontrado'): JsonResponse
    {
        return static::error($message, 404);
    }

    /**
     * Atalho para erro 403.
     *
     * @param  string $message Mensagem (default "Acesso negado").
     */
    public static function forbidden(string $message = 'Acesso negado'): JsonResponse
    {
        return static::error($message, 403);
    }
}
