# Guia de Migração — Controllers Legados → Modulares

## Resumo

Controllers antigos foram substituídos por 3 controllers modulares (um por método de pagamento), com validação segregada, respostas padronizadas e view unificada.

| Legacy | Substituído por |
|---|---|
| `CheckoutController` | `CardController`, `PixController`, `BoletoController` |
| `BasileiaCheckoutController` | `CardController`, `PixController`, `BoletoController` |
| `AsaasCheckoutController` | `CardController`, `PixController`, `BoletoController` |
| `AsaasPaymentService` | `CardPaymentService`, `PixPaymentService`, `BoletoPaymentService` |

## Mudanças nas Rotas

As rotas novas mapeiam diretamente para o controller do método:

```php
// NOVO — modular
Route::post('/checkout/card/{uuid}/process', [CardController::class, 'process']);
Route::post('/checkout/pix/{uuid}/process',   [PixController::class, 'process']);
Route::post('/checkout/boleto/{uuid}/process', [BoletoController::class, 'process']);
```

Continuam herdando de `AbstractCheckoutController`:
- `GET /checkout/{method}/{uuid}` — `show()`
- `GET /checkout/{method}/{uuid}/status` — `status()`
- `GET /checkout/{method}/success/{token}` — `success()`

## Mudanças nos FormRequests

Cada método tem seu próprio Request. Eles NÃO são intercambiáveis — a aplicação deve chamar o Request correspondente ao método de pagamento.

| Método | Request |
|---|---|
| Cartão | `ProcessCardPaymentRequest` |
| PIX | `ProcessPixPaymentRequest` |
| Boleto | `ProcessBoletoPaymentRequest` |

### Authorization

Todos os 3 Requests verificam se a transação ainda está `pending` antes de autorizar. Se o status não for `pending`, retorna 403.

## Mudanças nas Views

| Legacy | Novo |
|---|---|
| `checkout.card` | `checkout.card` (inalterado) |
| `checkout.card.success` | `checkout.card.success` (inalterado) |
| `checkout.pix` | `checkout.pix` (inalterado) |
| `checkout.pix.success` | `checkout.pix.success` (inalterado) |
| `checkout.boleto` | `checkout.boleto` (inalterado) |
| `checkout.boleto.success` | `checkout.boleto.success` (inalterado) |

Apenas os controllers legados que usavam `checkout.base`, `checkout.pix` e `checkout.boleto` foram atualizados.

## Mudanças nas Respostas JSON

Todas as respostas agora usam `CheckoutResponse`:

```php
// ANTES
return response()->json(['status' => 'success', 'data' => [...]]);

// DEPOIS
return CheckoutResponse::success($data);
```

## Mudanças no Mapeamento de Métodos

Nunca use strings literais para `payment_method`:

```php
// ERRADO
'payment_method' => 'credit_card',

// CERTO
'payment_method' => PaymentStatusMapper::mapPaymentMethod($billingType),
```

## Fluxo de Migração

1. Identificar qual controller legacy está sendo chamado.
2. Substituir pela rota do controller modular correspondente.
3. Ajustar o FormRequest para o específico do método.
4. Testar o fluxo completo (show → process → status → success).
5. Remover referências ao controller legado.

## Rollback

Se algo quebrar, as rotas legadas continuam registradas em `routes/web.php` e `routes/api.php`. Basta apontar a URL de volta para o controller antigo e reportar o bug.
