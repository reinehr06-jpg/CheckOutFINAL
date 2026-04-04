<!DOCTYPE html>
<html lang="pt-BR">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Pagamento Realizado</title>
    <style>
        body { font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; background: #f5f5f5; padding: 20px; display: flex; justify-content: center; align-items: center; min-height: 100vh; margin: 0; }
        .success-container { max-width: 400px; background: white; border-radius: 12px; padding: 40px; text-align: center; box-shadow: 0 2px 10px rgba(0,0,0,0.1); }
        .success-icon { width: 80px; height: 80px; background: #22c55e; border-radius: 50%; display: flex; align-items: center; justify-content: center; margin: 0 auto 24px; }
        .success-icon svg { width: 40px; height: 40px; color: white; }
        h1 { font-size: 24px; color: #111827; margin-bottom: 12px; }
        p { color: #6b7280; margin-bottom: 24px; }
        .amount { font-size: 32px; font-weight: bold; color: #16a34a; margin-bottom: 24px; }
        .details { background: #f3f4f6; padding: 16px; border-radius: 8px; text-align: left; margin-bottom: 24px; }
        .details p { margin-bottom: 8px; font-size: 14px; color: #374151; }
        .details strong { color: #111827; }
    </style>
</head>
<body>
    <div class="success-container">
        <div class="success-icon">
            <svg fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="3" d="M5 13l4 4L19 7"></path>
            </svg>
        </div>
        <h1>Pagamento Realizado!</h1>
        <p>Obrigado pelo seu pagamento. Em breve você receberá a confirmação por e-mail.</p>
        
        <div class="amount">R$ {{ number_format($transaction->amount, 2, ',', '.') }}</div>
        
        <div class="details">
            <p><strong>Status:</strong> {{ ucfirst($transaction->status) }}</p>
            <p><strong>ID:</strong> {{ $transaction->asaas_payment_id }}</p>
            <p><strong>Data:</strong> {{ $transaction->paid_at ? $transaction->paid_at->format('d/m/Y H:i') : now()->format('d/m/Y H:i') }}</p>
        </div>
    </div>
</body>
</html>