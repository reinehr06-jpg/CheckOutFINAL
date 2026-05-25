<?php

declare(strict_types=1);

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Support\Facades\Validator;

/**
 * Validação para pagamento com cartão de crédito.
 * Inclui verificação Luhn para número do cartão.
 */
class ProcessCardPaymentRequest extends FormRequest
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
            'card_name'        => 'required|string|min:3',
            'card_number'      => ['required', 'string', $this->luhnRule()],
            'card_expiry'      => 'required|string',
            'card_cvv'         => 'required|string|min:3|max:4',
            'customer_name'    => 'required|string|min:3',
            'email'            => 'required|email',
            'customer_document'=> 'required|string',
            'installments'     => 'nullable|integer|min:1|max:12',
            'customer_phone'   => 'nullable|string',
        ];
    }

    public function messages(): array
    {
        return [
            'card_name.required'     => 'O nome no cartão é obrigatório.',
            'card_number.required'   => 'O número do cartão é obrigatório.',
            'card_expiry.required'   => 'A data de validade é obrigatória.',
            'card_cvv.required'      => 'O CVV é obrigatório.',
            'customer_name.required' => 'O nome do cliente é obrigatório.',
            'email.required'         => 'O e-mail é obrigatório.',
            'email.email'            => 'Informe um e-mail válido.',
            'customer_document.required' => 'O documento é obrigatório.',
        ];
    }

    private function luhnRule(): \Closure
    {
        return function (string $attribute, mixed $value, \Closure $fail) {
            $service = app(\App\Services\CardValidator::class);
            $sanitized = $service->sanitize($value);
            if (!$sanitized || !$service->validate($sanitized)['valid']) {
                $fail('O número do cartão é inválido.');
            }
        };
    }
}
