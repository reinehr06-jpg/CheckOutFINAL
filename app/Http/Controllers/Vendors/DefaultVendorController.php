<?php

namespace App\Http\Controllers\Vendors;

use App\Http\Controllers\Controller;
use App\Models\Transaction;
use App\Services\AsaasPaymentService;
use App\Services\WebhookNotifierService;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Log;
use Illuminate\Support\Str;

class DefaultVendorController extends Controller
{
    public function __construct(
        private AsaasPaymentService $asaasService,
        private WebhookNotifierService $webhookNotifier,
    ) {}

    public function handle(Request $request, string $asaasPaymentId)
    {
        try {
            Log::info('DefaultVendor: Iniciando checkout', [
                'asaas_payment_id' => $asaasPaymentId,
                'params' => $request->all(),
            ]);

            $apiKey = config('services.asaas.api_key');
            
            if (empty($apiKey)) {
                $defaultGateway = \App\Models\Gateway::where('status', 'active')
                    ->where('is_default', true)
                    ->first() ?? \App\Models\Gateway::where('status', 'active')->first();
                    
                if ($defaultGateway) {
                    $apiKey = $defaultGateway->getConfig('api_key');
                    config(['services.asaas.api_key' => $apiKey]);
                }
            }

            if (empty($apiKey)) {
                Log::warning('DefaultVendor: ASAAS_API_KEY not configured');
                throw new \RuntimeException('Gateway not configured (API Key is missing)');
            }

            $asaasPayment = $this->asaasService->getPayment($asaasPaymentId);
            
            if (!$asaasPayment) {
                Log::warning('DefaultVendor: Payment not found', [
                    'asaas_payment_id' => $asaasPaymentId,
                ]);
                return view('checkout.error', ['message' => 'Pagamento não encontrado']);
            }

            $pixData = [];
            if (isset($asaasPayment['billingType']) && $asaasPayment['billingType'] === 'PIX') {
                $pixData = $this->asaasService->getPixQrCode($asaasPaymentId) ?? [];
            }

            $customer = $asaasPayment['customer'] ?? [];
            $billingType = $asaasPayment['billingType'] ?? strtoupper($request->get('metodo', $request->get('forma_pagamento', 'CREDIT_CARD')));
            
            $isCustomerArray = is_array($customer);
            
            $customerData = [
                'name' => ($isCustomerArray ? ($customer['name'] ?? null) : null) ?? $request->get('cliente', ''),
                'email' => ($isCustomerArray ? ($customer['email'] ?? null) : null) ?? $request->get('email', ''),
                'phone' => ($isCustomerArray ? ($customer['phone'] ?? null) : null) ?? $request->get('whatsapp', ''),
                'document' => ($isCustomerArray ? ($customer['cpfCnpj'] ?? null) : null) ?? $request->get('documento', ''),
                'address' => [
                    'street' => $isCustomerArray ? ($customer['address'] ?? '') : '',
                    'number' => $isCustomerArray ? ($customer['addressNumber'] ?? '') : '',
                    'neighborhood' => $isCustomerArray ? ($customer['neighborhood'] ?? '') : '',
                    'city' => $isCustomerArray ? ($customer['city'] ?? '') : '',
                    'state' => $isCustomerArray ? ($customer['state'] ?? '') : '',
                    'postalCode' => $isCustomerArray ? ($customer['postalCode'] ?? '') : '',
                ],
            ];

            $transaction = Transaction::where('asaas_payment_id', $asaasPaymentId)->first();

            $plano = $request->get('plano', $asaasPayment['description'] ?? 'Plano');
            $ciclo = $request->get('ciclo', 'mensal');

            if (!$transaction) {
                $companyId = $request->get('company_id', \App\Models\Company::first()?->id ?? 1);

                $transaction = Transaction::create([
                    'uuid' => (string) Str::uuid(),
                    'company_id' => $companyId,
                    'asaas_payment_id' => $asaasPaymentId,
                    'source' => 'default_vendor',
                    'external_id' => $request->get('venda_id', ''),
                    'callback_url' => config('basileia.callback_url', $request->get('callback_url', '')),
                    'amount' => $asaasPayment['value'] ?? $request->get('valor', 0),
                    'description' => $asaasPayment['description'] ?? 'Pagamento',
                    'payment_method' => $this->mapPaymentMethod($billingType),
                    'status' => 'pending',
                    'customer_name' => $customerData['name'],
                    'customer_email' => $customerData['email'],
                    'customer_phone' => $customerData['phone'],
                    'customer_document' => $customerData['document'],
                    'customer_address' => json_encode($customerData['address']),
                    'metadata' => [
                        'plano' => $plano,
                        'ciclo' => $ciclo,
                        'venda_id' => $request->get('venda_id', ''),
                        'hash' => $request->get('hash', ''),
                    ],
                ]);

                Log::info('DefaultVendor: Transação criada', [
                    'transaction_id' => $transaction->id,
                    'uuid' => $transaction->uuid,
                ]);
            }

            return view('checkout.premium', [
                'step' => $request->get('success') ? 3 : 1,
                'transaction' => $transaction,
                'paymentMethod' => strtolower($asaasPayment['billingType'] ?? 'pix'),
                'asaasPayment' => $asaasPayment,
                'customerData' => $customerData,
                'plano' => $plano,
                'ciclo' => $ciclo,
                'pixData' => $pixData ?? ['payload' => '', 'encodedImage' => ''],
            ])->render();
        } catch (\Exception $e) {
            Log::error('DefaultVendor: FATAL ERROR', [
                'msg' => $e->getMessage(),
                'file' => $e->getFile(),
                'line' => $e->getLine()
            ]);
            return "Erro Fatal: " . $e->getMessage() . " em " . $e->getFile() . ":" . $e->getLine();
        }
    }

    public function process(Request $request, string $asaasPaymentId)
    {
        $transaction = Transaction::where('asaas_payment_id', $asaasPaymentId)->firstOrFail();

        $request->validate([
            'card_number' => 'required|string',
            'card_name' => 'required|string',
            'card_expiry' => 'required|string',
            'card_cvv' => 'required|string',
        ]);

        try {
            $asaasResponse = $this->asaasService->processCardPayment($asaasPaymentId, [
                'card_number' => $request->input('card_number'),
                'card_name' => $request->input('card_name'),
                'card_expiry' => $request->input('card_expiry'),
                'card_cvv' => $request->input('card_cvv'),
                'card_document' => $transaction->customer_document,
                'card_email' => $transaction->customer_email,
                'card_phone' => $transaction->customer_phone,
            ]);

            $status = $this->mapStatus($asaasResponse['status'] ?? '');
            $paidAt = in_array($asaasResponse['status'] ?? '', ['CONFIRMED', 'RECEIVED']) ? now() : null;

            $transaction->update([
                'status' => $status,
                'paid_at' => $paidAt,
                'gateway_response' => json_encode($asaasResponse),
            ]);

            $this->webhookNotifier->notify($transaction);

            return redirect()->to(route('basileia.checkout.show', $asaasPaymentId) . '?success=1');
        } catch (\Exception $e) {
            Log::error('DefaultVendor: Payment failed', ['error' => $e->getMessage()]);
            return back()->withErrors(['payment' => $e->getMessage()])->withInput();
        }
    }

    public function success(string $uuid)
    {
        $transaction = Transaction::where('uuid', $uuid)->firstOrFail();
        return redirect()->to(route('basileia.checkout.show', $transaction->asaas_payment_id) . '?success=1');
    }

    private function mapPaymentMethod(string $billingType): string
    {
        return match ($billingType) {
            'CREDIT_CARD' => 'credit_card',
            'PIX' => 'pix',
            'BOLETO' => 'boleto',
            default => 'credit_card',
        };
    }

    private function mapStatus(string $asaasStatus): string
    {
        return match ($asaasStatus) {
            'CONFIRMED', 'RECEIVED', 'RECEIVED_IN_CASH' => 'approved',
            'PENDING', 'AWAITING_RISK_ANALYSIS' => 'pending',
            'OVERDUE' => 'overdue',
            'REFUNDED', 'REFUND_REQUESTED', 'CHARGEBACK_REQUESTED' => 'refunded',
            'CANCELED', 'DELETED' => 'cancelled',
            default => 'pending',
        };
    }
}