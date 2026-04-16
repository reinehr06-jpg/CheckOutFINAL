<?php

namespace App\Http\Controllers;

use App\Models\Transaction;
use App\Services\WebhookNotifierService;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Log;

class AsaasWebhookController extends Controller
{
    public function __construct(
        private WebhookNotifierService $webhookNotifier,
    ) {}

    public function handle(Request $request)
    {
        $event = $request->input('event');
        $data = $request->input('payment') ?? $request->input('subscription');

        if (!$event || !$data) {
            Log::warning('AsaasWebhook: Missing data in payload', ['payload' => $request->all()]);
            return response()->json(['error' => 'Invalid payload'], 400);
        }

        $paymentId = $data['id'] ?? null;

        Log::info('AsaasWebhook: Event received', [
            'event' => $event,
            'id' => $paymentId,
        ]);

        // Search in both Transactions and Subscriptions
        $transaction = Transaction::where('asaas_payment_id', $paymentId)->first()
                    ?? Transaction::where('gateway_id', $paymentId)->first()
                    ?? \App\Models\Subscription::where('gateway_subscription_id', $paymentId)->first();

        if (!$transaction) {
            Log::warning('AsaasWebhook: Resource not found locally', [
                'asaas_id' => $paymentId,
            ]);
            return response()->json(['ok' => true]);
        }

        // --- Per-Gateway Token Validation ---
        $gateway = $transaction->gateway;
        $expectedToken = $gateway ? $gateway->getConfig('webhook_token') : config('services.asaas.webhook_token');
        $receivedToken = $request->header('asaas-access-token');

        if ($expectedToken && $receivedToken !== $expectedToken) {
            Log::warning('AsaasWebhook: Invalid token for gateway ' . ($gateway->id ?? 'unknown'), [
                'received' => $receivedToken,
            ]);
            return response()->json(['error' => 'Unauthorized'], 403);
        }
        // ------------------------------------

        $status = match ($data['status'] ?? '') {
            'RECEIVED', 'CONFIRMED', 'RECEIVED_IN_CASH' => 'approved',
            'PENDING', 'AWAITING_RISK_ANALYSIS' => 'pending',
            'OVERDUE' => 'overdue',
            'CANCELED', 'DELETED' => 'cancelled',
            'REFUNDED', 'REFUND_REQUESTED' => 'refunded',
            default => 'unknown',
        };

        $transaction->update([
            'status' => $status,
            'paid_at' => in_array($data['status'] ?? '', ['RECEIVED', 'CONFIRMED', 'RECEIVED_IN_CASH']) ? now() : ($transaction->paid_at),
        ]);

        $this->webhookNotifier->notify($transaction);

        return response()->json(['ok' => true]);
    }
}