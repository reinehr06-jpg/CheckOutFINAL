<?php

namespace App\Http\Middleware;

use App\Models\Transaction;
use Closure;
use Illuminate\Http\Request;
use Illuminate\Support\Str;
use Symfony\Component\HttpFoundation\Response;

class EnforceSecureTokenization
{
    public function handle(Request $request, Closure $next): Response
    {
        try {
            // Skip for API routes - they handle tokenization themselves
            if ($request->is('api/*') || $request->is('api')) {
                return $next($request);
            }

            // Skip for webhook routes
            if ($request->is('webhooks/*') || $request->is('api/webhooks/*')) {
                return $next($request);
            }

            // Only apply to web routes with asaas_payment_id
            if ($request->has('asaas_payment_id') && !$request->routeIs('checkout.*')) {
                $asaasPaymentId = $request->get('asaas_payment_id');
                $transaction = Transaction::where('asaas_payment_id', $asaasPaymentId)->first();

                if (!$transaction) {
                    $transaction = Transaction::create([
                        'uuid' => (string) Str::uuid(),
                        'company_id' => \App\Models\Company::first()?->id ?? 1,
                        'asaas_payment_id' => $asaasPaymentId,
                        'source' => 'global_interceptor',
                        'amount' => $request->get('valor', 0),
                        'description' => $request->get('plano', 'Pagamento Basiléia'),
                        'payment_method' => 'credit_card',
                        'status' => 'pending',
                        'customer_name' => $request->get('cliente', ''),
                        'customer_email' => $request->get('email', ''),
                        'customer_document' => $request->get('documento', ''),
                        'customer_phone' => $request->get('whatsapp', ''),
                    ]);
                }

                return redirect()->away(route('checkout.show', $transaction->uuid), 301);
            }
        } catch (\Exception $e) {
            \Illuminate\Support\Facades\Log::error('EnforceSecureTokenization Error', [
                'error' => $e->getMessage(),
                'trace' => $e->getTraceAsString()
            ]);
        }

        return $next($request);
    }
}