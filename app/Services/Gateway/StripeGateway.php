<?php

namespace App\Services\Gateway;

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Http;

class StripeGateway implements GatewayInterface
{
    private string $apiKey;

    public function __construct()
    {
        $this->apiKey = config('services.stripe.key');
    }

    public function createCustomer(array $data): array
    {
        // Stripe Customer Implementation
        return ['id' => 'cus_' . uniqid(), 'email' => $data['email']];
    }

    public function createPayment(array $data): array
    {
        // Stripe Payment Intent Implementation
        return ['id' => 'pi_' . uniqid(), 'status' => 'requires_payment_method'];
    }

    public function createSubscription(array $data): array
    {
        return ['id' => 'sub_' . uniqid()];
    }

    public function getPayment(string $paymentId): array
    {
        return ['id' => $paymentId, 'status' => 'succeeded'];
    }

    public function cancelPayment(string $paymentId): array
    {
        return ['id' => $paymentId, 'status' => 'canceled'];
    }

    public function refundPayment(string $paymentId, ?float $amount = null): array
    {
        return ['id' => 're_' . uniqid(), 'status' => 'succeeded'];
    }

    public function generatePix(array $data): array
    {
        return $this->createPayment($data);
    }

    public function generateBoleto(array $data): array
    {
        return $this->createPayment($data);
    }

    public function processWebhook(Request $request): array
    {
        return ['event' => $request->input('type'), 'raw' => $request->all()];
    }

    public function createSplit(array $data): array
    {
        return [];
    }
}
