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
        $payment = $request->input('payment');

        if (!$event || !$payment) {
            return response()->json(['error' => 'Invalid payload'], 400);
        }

        Log::info('AsaasWebhook: Event received', [
            'event' => $event,
            'payment_id' => $payment['id'] ?? null,
        ]);

        $transaction = Transaction::where('asaas_payment_id', $payment['id'])->first();

        if (!$transaction) {
            Log::warning('AsaasWebhook: Transaction not found', [
                'asaas_payment_id' => $payment['id'],
            ]);
            // Return 200 to Asaas to stop retries if transaction truly doesn't exist anymore
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

        $status = match ($payment['status'] ?? '') {
            'RECEIVED', 'CONFIRMED' => 'approved',
            'PENDING', 'AWAITING_RISK_ANALYSIS' => 'pending',
            'OVERDUE' => 'overdue',
            'CANCELED', 'DELETED' => 'cancelled',
            'REFUNDED', 'REFUND_REQUESTED' => 'refunded',
            default => 'unknown',
        };

        $transaction->update([
            'status' => $status,
            'paid_at' => in_array($payment['status'], ['RECEIVED', 'CONFIRMED']) ? now() : ($transaction->paid_at),
        ]);

        $this->webhookNotifier->notify($transaction);

        return response()->json(['ok' => true]);
    }
}