<!DOCTYPE html>
<html lang="pt-BR">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Pagamento Realizado - Checkout Basileia</title>
    <link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;800&family=Space+Grotesk:wght@500;700&display=swap" rel="stylesheet">
    <style>
        * { box-sizing: border-box; margin: 0; padding: 0; }
        body {
            font-family: 'Inter', -apple-system, BlinkMacSystemFont, sans-serif;
            background: #0f0f1a;
            min-height: 100vh;
            display: flex;
            align-items: center;
            justify-content: center;
            padding: 20px;
            position: relative;
            overflow: hidden;
        }
        body::before {
            content: '';
            position: absolute;
            top: -50%;
            left: -50%;
            width: 200%;
            height: 200%;
            background: 
                radial-gradient(circle at 30% 40%, rgba(34, 197, 94, 0.1) 0%, transparent 40%),
                radial-gradient(circle at 70% 60%, rgba(99, 102, 241, 0.08) 0%, transparent 40%);
            animation: bgPulse 20s ease-in-out infinite;
        }
        @keyframes bgPulse {
            0%, 100% { transform: translate(0, 0); }
            50% { transform: translate(-2%, -2%); }
        }
        .success-card {
            background: rgba(255, 255, 255, 0.03);
            backdrop-filter: blur(20px);
            border: 1px solid rgba(255, 255, 255, 0.08);
            border-radius: 24px;
            padding: 48px;
            width: 100%;
            max-width: 480px;
            text-align: center;
            position: relative;
            box-shadow: 
                0 25px 50px -12px rgba(0, 0, 0, 0.5),
                0 0 0 1px rgba(255, 255, 255, 0.05) inset;
        }
        .success-icon {
            width: 80px;
            height: 80px;
            background: linear-gradient(135deg, #22c55e 0%, #16a34a 100%);
            border-radius: 50%;
            display: flex;
            align-items: center;
            justify-content: center;
            margin: 0 auto 28px;
            box-shadow: 0 12px 32px rgba(34, 197, 94, 0.4);
            animation: scaleIn 0.5s cubic-bezier(0.34, 1.56, 0.64, 1);
        }
        @keyframes scaleIn {
            0% { transform: scale(0); }
            100% { transform: scale(1); }
        }
        .success-icon svg {
            width: 40px;
            height: 40px;
            color: white;
            animation: checkDraw 0.4s ease-out 0.3s forwards;
            stroke-dasharray: 100;
            stroke-dashoffset: 100;
        }
        @keyframes checkDraw {
            to { stroke-dashoffset: 0; }
        }
        h1 {
            font-family: 'Space Grotesk', sans-serif;
            font-size: 1.75rem;
            font-weight: 700;
            color: white;
            margin-bottom: 12px;
        }
        .subtitle {
            color: rgba(255, 255, 255, 0.5);
            font-size: 0.95rem;
            margin-bottom: 32px;
            line-height: 1.6;
        }
        .amount-container {
            background: rgba(34, 197, 94, 0.1);
            border: 1px solid rgba(34, 197, 94, 0.2);
            border-radius: 16px;
            padding: 24px;
            margin-bottom: 28px;
        }
        .amount-label {
            font-size: 0.75rem;
            font-weight: 600;
            color: rgba(255, 255, 255, 0.5);
            text-transform: uppercase;
            letter-spacing: 1px;
            margin-bottom: 8px;
        }
        .amount {
            font-family: 'Space Grotesk', sans-serif;
            font-size: 2.5rem;
            font-weight: 700;
            color: #22c55e;
        }
        .details {
            background: rgba(255, 255, 255, 0.03);
            border: 1px solid rgba(255, 255, 255, 0.06);
            border-radius: 12px;
            padding: 20px;
            text-align: left;
            margin-bottom: 32px;
        }
        .detail-row {
            display: flex;
            justify-content: space-between;
            padding: 12px 0;
            border-bottom: 1px solid rgba(255, 255, 255, 0.06);
        }
        .detail-row:last-child { border-bottom: none; }
        .detail-label {
            font-size: 0.85rem;
            color: rgba(255, 255, 255, 0.5);
        }
        .detail-value {
            font-size: 0.85rem;
            font-weight: 600;
            color: white;
        }
        .status-badge {
            display: inline-flex;
            align-items: center;
            gap: 6px;
            padding: 8px 16px;
            background: rgba(34, 197, 94, 0.15);
            border-radius: 20px;
            font-size: 0.8rem;
            font-weight: 600;
            color: #22c55e;
        }
        .cta-button {
            display: inline-flex;
            align-items: center;
            gap: 8px;
            padding: 14px 28px;
            background: linear-gradient(135deg, #7b2ff7 0%, #6366F1 100%);
            color: white;
            border: none;
            border-radius: 12px;
            font-size: 0.9rem;
            font-weight: 600;
            text-decoration: none;
            transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
        }
        .cta-button:hover {
            transform: translateY(-2px);
            box-shadow: 0 12px 32px rgba(123, 47, 247, 0.4);
        }
    </style>
</head>
<body>
    <div class="success-card">
        <div class="success-icon">
            <svg fill="none" stroke="currentColor" viewBox="0 0 24 24" stroke-width="3" stroke-linecap="round" stroke-linejoin="round">
                <path d="M5 13l4 4L19 7"></path>
            </svg>
        </div>
        
        <h1>Pagamento Confirmado!</h1>
        <p class="subtitle">Obrigado pelo seu pagamento. Você receberá a confirmação por e-mail em alguns minutos.</p>
        
        <div class="amount-container">
            <div class="amount-label">Valor Pago</div>
            <div class="amount">R$ {{ number_format($transaction->amount, 2, ',', '.') }}</div>
        </div>
        
        <div class="details">
            <div class="detail-row">
                <span class="detail-label">Status</span>
                <span class="status-badge">
                    <i class="fas fa-check-circle"></i>
                    {{ ucfirst($transaction->status) }}
                </span>
            </div>
            <div class="detail-row">
                <span class="detail-label">ID da Transação</span>
                <span class="detail-value" style="font-family: monospace; font-size: 0.75rem;">{{ Str::limit($transaction->asaas_payment_id ?? $transaction->uuid, 16) }}</span>
            </div>
            <div class="detail-row">
                <span class="detail-label">Data</span>
                <span class="detail-value">{{ $transaction->paid_at ? $transaction->paid_at->format('d/m/Y H:i') : now()->format('d/m/Y H:i') }}</span>
            </div>
            @if($transaction->customer_email)
            <div class="detail-row">
                <span class="detail-label">Email</span>
                <span class="detail-value">{{ $transaction->customer_email }}</span>
            </div>
            @endif
        </div>
        
        <a href="/" class="cta-button">
            <i class="fas fa-home"></i>
            Voltar ao Início
        </a>
    </div>
</body>
</html>