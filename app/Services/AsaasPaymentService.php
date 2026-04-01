<?php

namespace App\Services;

use Illuminate\Support\Facades\Http;
use Illuminate\Support\Facades\Log;

class AsaasPaymentService
{
    private string $apiKey;
    private string $environment;

    public function __construct()
    {
        $this->apiKey = config('gateways.asaas.api_key', env('ASAAS_API_KEY'));
        $this->environment = config('gateways.asaas.environment', env('ASAAS_ENVIRONMENT', 'sandbox'));
    }

    private function getBaseUrl(): string
    {
        return $this->environment === 'production'
            ? 'https://api.asaas.com/v3'
            : 'https://api-sandbox.asaas.com/v3';
    }

    private function request(string $method, string $endpoint, array $data = []): array
    {
        try {
            $response = Http::withHeaders([
                'access_token' => $this->apiKey,
                'Content-Type' => 'application/json',
            ])->timeout(30)->{$method}("{$this->getBaseUrl()}{$endpoint}", $data);

            if (!$response->successful()) {
                $body = $response->json();
                $message = $body['errors'][0]['description'] ?? 'Request failed';
                Log::error('AsaasPaymentService: Request failed', [
                    'method' => $method,
                    'endpoint' => $endpoint,
                    'error' => $message,
                ]);
                throw new \RuntimeException("Asaas API Error: {$message}");
            }

            return $response->json();
        } catch (\Exception $e) {
            Log::error('AsaasPaymentService: Exception', [
                'error' => $e->getMessage(),
            ]);
            throw $e;
        }
    }

    public function getPayment(string $paymentId): ?array
    {
        try {
            return $this->request('GET', "/payments/{$paymentId}");
        } catch (\Exception $e) {
            Log::warning('AsaasPaymentService: Payment not found', [
                'payment_id' => $paymentId,
            ]);
            return null;
        }
    }

    public function processCardPayment(string $paymentId, array $cardData): array
    {
        $expiry = explode('/', $cardData['card_expiry']);
        $month = trim($expiry[0] ?? '');
        $year = trim($expiry[1] ?? '');

        $holderInfo = [
            'name' => $cardData['card_name'],
            'cpfCnpj' => preg_replace('/\D/', '', $cardData['card_document'] ?? ''),
            'email' => $cardData['card_email'] ?? null,
            'phone' => preg_replace('/\D/', '', $cardData['card_phone'] ?? null),
            'address' => [
                'street' => $cardData['card_address'] ?? '',
                'number' => $cardData['card_address_number'] ?? '',
                'neighborhood' => $cardData['card_neighborhood'] ?? '',
                'city' => $cardData['card_city'] ?? '',
                'state' => $cardData['card_state'] ?? '',
                'postalCode' => preg_replace('/\D/', '', $cardData['card_cep'] ?? ''),
            ],
        ];

        $payload = [
            'creditCard' => [
                'cardNumber' => preg_replace('/\D/', '', $cardData['card_number']),
                'cardName' => $cardData['card_name'],
                'expirationMonth' => $month,
                'expirationYear' => $year,
                'cvv' => $cardData['card_cvv'],
            ],
            'creditCardHolderInfo' => $holderInfo,
        ];

        return $this->request('POST', "/payments/{$paymentId}", $payload);
    }

    public function getPaymentStatus(string $paymentId): string
    {
        $payment = $this->getPayment($paymentId);
        
        if (!$payment) {
            return 'unknown';
        }

        return match ($payment['status'] ?? '') {
            'PENDING', 'AWAITING_RISK_ANALYSIS' => 'pending',
            'RECEIVED', 'CONFIRMED', 'RECEIVED_IN_CASH' => 'approved',
            'OVERDUE' => 'overdue',
            'REFUNDED', 'REFUND_REQUESTED', 'CHARGEBACK_REQUESTED' => 'refunded',
            'CANCELED', 'DELETED' => 'cancelled',
            default => 'unknown',
        };
    }
}