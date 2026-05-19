<?php

namespace App\Http\Controllers\Api\V1;

use App\Http\Controllers\Controller;
use App\Services\PaymentService;
use Illuminate\Http\Request;
use Illuminate\Http\Response;

class PaymentController extends Controller
{
    public function __construct(private PaymentService $paymentService)
    {
    }

    public function index(Request $request)
    {
        $user = auth()->user();
        $companyId = TenantContext::companyId();

        $query = \App\Models\Payment::query();

        // Super admin ve todos os pagamentos
        if ($user && $user->isSuperAdmin() && !$user->company_id) {
            // Sem filtro de company_id
        } elseif ($companyId) {
            $query->where('company_id', $companyId);
        } else {
            return response()->json([
                'success' => true,
                'data' => [],
                'meta' => ['current_page' => 1, 'last_page' => 1, 'total' => 0, 'request_id' => $request->attributes->get('request_id')],
            ]);
        }

        $payments = $query->with(['order', 'gatewayAccount'])->latest()->paginate($request->per_page ?? 20);

        return response()->json([
            'success' => true,
            'data' => $payments->getCollection()->map(fn($p) => [
                'id' => $p->id,
                'uuid' => $p->uuid,
                'customer' => $p->order?->customer_name ?? 'N/A',
                'method' => $p->method,
                'gateway' => $p->gatewayAccount?->name ?? 'N/A',
                'value' => 'R$ ' . number_format($p->amount / 100, 2, ',', '.'),
                'status' => $p->status,
                'risk' => 'low',
                'created_at' => $p->created_at->format('d/m H:i'),
            ]),
            'meta' => [
                'current_page' => $payments->currentPage(),
                'last_page' => $payments->lastPage(),
                'total' => $payments->total(),
                'request_id' => $request->attributes->get('request_id'),
            ]
        ]);
    }

    public function process(Request $request)
    {
        $request->validate([
            'transaction_uuid' => 'required|string|exists:transactions,uuid',
            'payment_method' => 'required|in:pix,boleto,credit_card,debit_card',
            'card' => 'required_if:payment_method,credit_card,debit_card|array',
            'card.number' => 'required_if:payment_method,credit_card,debit_card|string',
            'card.holder_name' => 'required_if:payment_method,credit_card,debit_card|string|max:255',
            'card.expiry_month' => 'required_if:payment_method,credit_card,debit_card|integer|min:1|max:12',
            'card.expiry_year' => 'required_if:payment_method,credit_card,debit_card|integer|min:' . date('Y'),
            'card.cvv' => 'required_if:payment_method,credit_card,debit_card|string|min:3|max:4',
            'card.installments' => 'sometimes|integer|min:1|max:12',
        ]);

        $payment = $this->paymentService->process($request->validated(), \App\Services\TenantContext::companyId());

        return response()->json([
            'payment' => $payment,
        ], Response::HTTP_CREATED);
    }

    public function status(Request $request, string $uuid)
    {
        $integration = $request->attributes->get('integration');

        $payment = $this->paymentService->findByUuid($uuid, $integration);

        if (!$payment) {
            return response()->json(['message' => 'Pagamento não encontrado.'], Response::HTTP_NOT_FOUND);
        }

        return response()->json(['payment' => $payment]);
    }

    public function pix(Request $request, string $uuid)
    {
        $integration = $request->attributes->get('integration');

        $pixData = $this->paymentService->getPixData($uuid, $integration);

        if (!$pixData) {
            return response()->json(['message' => 'Dados PIX não encontrados.'], Response::HTTP_NOT_FOUND);
        }

        return response()->json(['pix' => $pixData]);
    }

    public function boleto(Request $request, string $uuid)
    {
        $integration = $request->attributes->get('integration');

        $boletoData = $this->paymentService->getBoletoData($uuid, $integration);

        if (!$boletoData) {
            return response()->json(['message' => 'Dados do boleto não encontrados.'], Response::HTTP_NOT_FOUND);
        }

        return response()->json(['boleto' => $boletoData]);
    }
}
