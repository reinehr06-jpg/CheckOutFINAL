<?php

namespace App\Services\Crypto;

use App\Models\Transaction;
use RuntimeException;

/**
 * TransactionSigner — Assinatura Criptográfica de Transações
 *
 * Gera e verifica assinaturas HMAC-SHA256 para garantir a integridade
 * das transações. Qualquer modificação direta no banco de dados invalidará a assinatura.
 */
class TransactionSigner
{
    private CryptoProvider $crypto;

    public function __construct(CryptoProvider $crypto)
    {
        $this->crypto = $crypto;
    }

    /**
     * Assina uma transação e retorna a assinatura em base64.
     */
    public function sign(Transaction $transaction): string
    {
        $payload = $this->buildPayload($transaction);
        return $this->crypto->sign($payload);
    }

    /**
     * Verifica se a assinatura de uma transação é válida.
     */
    public function verify(Transaction $transaction): bool
    {
        if (empty($transaction->signature)) {
            return false;
        }

        $payload = $this->buildPayload($transaction);
        return $this->crypto->verify($payload, $transaction->signature);
    }

    /**
     * Constrói o payload canônico para assinatura.
     */
    private function buildPayload(Transaction $transaction): string
    {
        // Os campos críticos que definem a integridade da transação
        $data = [
            'id' => $transaction->id,
            'company_id' => $transaction->company_id,
            'amount' => $transaction->amount,
            'currency' => $transaction->currency ?? 'BRL',
            'status' => $transaction->status,
            'gateway' => $transaction->gateway ?? 'unknown',
        ];

        // Ordenar as chaves para garantir consistência
        ksort($data);

        return json_encode($data);
    }
}
