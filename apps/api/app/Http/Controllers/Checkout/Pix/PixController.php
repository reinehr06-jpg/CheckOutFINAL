<?php

declare(strict_types=1);

namespace App\Http\Controllers\Checkout\Pix;

use App\Helpers\CheckoutResponse;
use App\Helpers\PaymentStatusMapper;
use App\Http\Controllers\Checkout\AbstractCheckoutController;
use App\Http\Requests\ProcessPixPaymentRequest;
use App\Models\Subscription;
use App\Models\Transaction;
use App\Services\CheckoutService;
use App\Services\Payment\PixPaymentService;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Log;

/**
 * Controller de pagamento via PIX.
 *
 * [Fase 3.2] View: checkout.pix / checkout.pix.success
 * [Fase 3.3] Request: ProcessPixPaymentRequest
 * [Fase 3.4] Respostas: CheckoutResponse
 * [Fase 4.5] Payment method: PaymentStatusMapper::mapPaymentMethod()
 */
class PixController extends AbstractCheckoutController
{
    public function __construct(
        \App\Services\AsaasPaymentService $asaasService,
        \App\Services\WebhookNotifierService $webhookNotifier,
        private PixPaymentService $pixService,
    ) {
        parent::__construct($asaasService, $webhookNotifier);
    }

    /**
     * Processa pagamento via PIX.
     *
     * @param ProcessPixPaymentRequest $request Requisição validada.
     * @param string                   $uuid    UUID da transação.
     */
    public function process(string $uuid, Request $request): mixed
    {
        app(ProcessPixPaymentRequest::class);

        $resource = CheckoutService::findResource($uuid);
        $transaction = $resource instanceof Transaction ? $resource : null;

        if (!$transaction) {
            return CheckoutResponse::notFound('Transação não encontrada');
        }

        // [BUG-15] bloqueia empresa A acessando transação de empresa B
        if ($guard = $this->assertOwnership($transaction, $request)) {
            return $guard;
        }

        try {
            $result = $this->pixService->charge(
                [
                    'amountBRL' => $request->input('amountBRL', $transaction->amount),
                    'description' => $request->input('description', $transaction->description),
                    'remoteIp' => $request->ip(),
                ],
                [
                    'name' => $request->input('customerData.name'),
                    'email' => $request->input('customerData.email'),
                    'document' => $request->input('customerData.document'),
                ]
            );

            $transaction->update([
                'asaas_payment_id' => $result['gatewayId'],
                'payment_method' => PaymentStatusMapper::mapPaymentMethod('PIX'),
                'status' => 'pending',
            ]);

            return CheckoutResponse::success([
                'paymentMethod' => 'pix',
                'qrCodeBase64' => $result['qrCodeBase64'],
                'qrCodePayload' => $result['qrCodePayload'],
                'expiresAt' => $result['expiresAt'],
                'gatewayId' => $result['gatewayId'],
            ]);
        } catch (\Throwable $e) {
            Log::error('PixController: erro', ['uuid' => $uuid, 'error' => $e->getMessage()]);
            return CheckoutResponse::error($e->getMessage());
        }
    }

    protected function getPaymentMethod(): string
    {
        return 'pix';
    }
    protected function getPaymentService(): mixed
    {
        return $this->pixService;
    }
    protected function getViewName(): string
    {
        return 'checkout.pix';
    }
    protected function getSuccessViewName(): string
    {
        return 'checkout.pix.success';
    }
    protected function getSource(): string
    {
        return Transaction::SOURCE_CHECKOUT;
    }
    protected function getDefaultBillingType(): string
    {
        return 'PIX';
    }
    protected function needsPixData(): bool
    {
        return true;
    }

    protected function getFallbackView(
        Transaction|Subscription $transaction,
        array $asaasPayment,
        array $customerData,
        ?array $pixData,
        string $plano,
        string $ciclo,
        array $i18n,
        Request $request
    ): mixed {
        return view($this->getViewName(), compact(
            'transaction',
            'asaasPayment',
            'customerData',
            'pixData',
            'plano',
            'ciclo'
        ));
    }
}
