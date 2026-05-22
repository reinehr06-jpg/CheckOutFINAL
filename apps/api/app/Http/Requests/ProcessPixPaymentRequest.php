<?php

declare(strict_types=1);

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;

/**
 * Validação para pagamento via PIX.
 *
 * [Fase 3.3] Request segregada por método de pagamento.
 * Espera customerData com name, email, document.
 */
class ProcessPixPaymentRequest extends FormRequest
{
    public function authorize(): bool
    {
        if ($uuid = $this->route('uuid')) {
            $transaction = \App\Models\Transaction::where('uuid', $uuid)->first();
            if (!$transaction || $transaction->status !== 'pending') {
                return false;
            }
        }
        return true;
    }

    public function rules(): array
    {
        return [
            'customerData.name'     => 'required|string|min:3',
            'customerData.email'    => 'required|email',
            'customerData.document' => 'required|string',
            'customerData.phone'    => 'nullable|string',
            'amountBRL'             => 'nullable|numeric|min:0.01',
            'description'           => 'nullable|string|max:255',
        ];
    }

    public function messages(): array
    {
        return [
            'customerData.name.required'     => 'O nome é obrigatório.',
            'customerData.email.required'    => 'O e-mail é obrigatório.',
            'customerData.email.email'       => 'Informe um e-mail válido.',
            'customerData.document.required' => 'O documento é obrigatório.',
        ];
    }
}
