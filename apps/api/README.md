# Basileia API — Checkout Engine

## Arquitetura

```
app/Http/Controllers/
├── Checkout/                          ← Controllers ativos
│   ├── AbstractCheckoutController.php  ← Base comum (show, status, success, ownership)
│   ├── Card/CardController.php         ← Pagamento com cartão
│   ├── Pix/PixController.php           ← Pagamento via PIX
│   ├── Boleto/BoletoController.php     ← Pagamento via Boleto
│   └── EventCheckoutController.php     ← Checkout de eventos
├── CheckoutController.php             ← @deprecated — use Card/Pix/Boleto
├── AsaasCheckoutController.php        ← @deprecated — use Card/Pix/Boleto
└── BasileiaCheckoutController.php     ← @deprecated — use Card/Pix/Boleto

app/Services/
├── CheckoutService.php                ← Lógica central (findResource, buildCustomerData,
│                                          createTransaction, status polling, i18n, SPA, success token)
├── Gateway/
│   ├── GatewayInterface.php           ← Contrato de gateway
│   ├── GatewayFactory.php             ← Factory unificado
│   ├── GatewayResolver.php            ← Resolução por prioridade
│   ├── AsaasGateway.php               ← Driver Asaas API v3
│   └── PagBankGateway.php             ← Driver PagBank API v4
├── Payment/
│   ├── CardPaymentService.php         ← Processamento de cartão
│   ├── PixPaymentService.php          ← Processamento de PIX
│   └── BoletoPaymentService.php       ← Processamento de boleto
└── AsaasPaymentService.php            ← @deprecated — use Gateway/* + Payment/*

app/Helpers/
├── PaymentStatusMapper.php            ← Mapeamento de status (mapStatus, isPaid, mapPaymentMethod)
└── CheckoutResponse.php               ← Respostas padronizadas (success, error, validationError)

app/Http/Requests/
├── ProcessPaymentRequest.php          ← Request genérico (legado)
├── ProcessCardPaymentRequest.php      ← Validação de cartão
├── ProcessPixPaymentRequest.php       ← Validação de PIX
└── ProcessBoletoPaymentRequest.php    ← Validação de boleto
```

## Fluxo de Pagamento

```
SPA (checkout-app/) ou Blade (resources/views/)
        │
        ▼
  CardController / PixController / BoletoController
        │
        ├── process(FormRequest $request, string $uuid)
        │       ├── CheckoutService::findResource($uuid)
        │       ├── assertOwnership($transaction)      ← [BUG-15]
        │       ├── CardPaymentService::charge()        ← ou Pix/Boleto
        │       ├── PaymentStatusMapper::mapStatus()
        │       └── CheckoutResponse::success()
        │
        ├── show($uuid)  ← herdado de AbstractCheckoutController
        │       ├── CheckoutService::findResource()
        │       ├── getAsaasPaymentWithFallback()
        │       ├── buildCustomerData()
        │       ├── createTransactionIfNotExists()
        │       ├── renderSpa() ou getFallbackView()
        │       └── loadI18n()
        │
        ├── status($uuid)  ← herdado
        │       └── checkAndUpdateStatus()
        │
        └── success($uuidOrToken)  ← herdado
                ├── resolveSuccessToken()
                └── buildSuccessData()
```

## Convenções

### Views
- `checkout.{method}` — página de pagamento (ex: `checkout.card`, `checkout.pix`)
- `checkout.{method}.success` — página de sucesso (ex: `checkout.card.success`)

### Respostas JSON
Todas as respostas seguem o formato `CheckoutResponse`:
```json
{ "ok": true, "status": "success", "data": { ... } }
{ "ok": false, "status": "error", "error": "mensagem" }
```

### FormRequests
Cada método de pagamento tem seu próprio FormRequest:
- `ProcessCardPaymentRequest` — valida cartão (card_name, card_number, cvv, etc.)
- `ProcessPixPaymentRequest` — valida customerData (name, email, document)
- `ProcessBoletoPaymentRequest` — valida customerData (name, email, document, cep, address)

### Source
Todas as transações usam `Transaction::SOURCE_CHECKOUT = 'checkout'`.

### Status
Sempre usar `PaymentStatusMapper`:
- `PaymentStatusMapper::mapStatus($gatewayStatus)` → status interno
- `PaymentStatusMapper::isPaid($gatewayStatus)` → bool
- `PaymentStatusMapper::mapPaymentMethod($billingType)` → método interno
