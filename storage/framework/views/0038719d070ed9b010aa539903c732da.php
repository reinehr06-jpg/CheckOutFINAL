<!DOCTYPE html>
<html lang="pt-BR">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <meta name="csrf-token" content="<?php echo e(csrf_token()); ?>">
    <title><?php echo e($transaction->description ?? 'Pagamento'); ?> - Basileia</title>
    <script defer src="https://cdn.jsdelivr.net/npm/alpinejs@3.x.x/dist/cdn.min.js"></script>
    <link rel="preconnect" href="https://fonts.googleapis.com">
    <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
    <link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;800&display=swap" rel="stylesheet">
    <style>
        * {
            margin: 0;
            padding: 0;
            box-sizing: border-box;
            font-family: 'Inter', sans-serif;
        }

        body {
            background: linear-gradient(135deg, #f3f0f7, #e9e4ef);
            min-height: 100vh;
            display: flex;
            align-items: center;
            justify-content: center;
        }

        .container {
            width: 1100px;
            height: 650px;
            border-radius: 20px;
            box-shadow: 0 20px 40px rgba(0,0,0,0.1);
            overflow: hidden;
            display: grid;
            grid-template-columns: 1fr 1fr;
            position: relative;
            z-index: 1;
        }

        /* LEFT PANEL */
        .left-panel {
            background: linear-gradient(145deg, #5f2c82, #9c27b0, #d16ba5);
            padding: 40px;
            display: flex;
            flex-direction: column;
            color: #FFFFFF;
            position: relative;
        }

        .left-panel::after {
            content: '';
            position: absolute;
            top: 0;
            left: 0;
            right: 0;
            bottom: 0;
            background: rgba(255,255,255,0.08);
            pointer-events: none;
        }

        .left-panel > * {
            position: relative;
            z-index: 1;
        }

        .logo {
            display: flex;
            align-items: center;
            gap: 10px;
            margin-bottom: 24px;
        }

        .logo-icon {
            background: #ffffff;
            color: #7B2FF7;
            border-radius: 8px;
            padding: 6px 10px;
            font-weight: bold;
            font-size: 28px;
        }

        .logo-text {
            font-size: 28px;
            font-weight: 700;
            color: #FFFFFF;
        }

        .badge {
            background: rgba(255,255,255,0.15);
            color: #FFFFFF;
            padding: 6px 14px;
            border-radius: 20px;
            font-size: 12px;
            letter-spacing: 0.5px;
            display: inline-block;
            margin-bottom: 24px;
            width: fit-content;
        }

        .plan-title {
            font-size: 40px;
            font-weight: 700;
            margin-bottom: 8px;
        }

        .plan-price {
            font-size: 48px;
            font-weight: 800;
            margin-bottom: 4px;
        }

        .plan-billing {
            font-size: 14px;
            opacity: 0.8;
            margin-bottom: 32px;
        }

        .features {
            list-style: none;
            flex: 1;
        }

        .features li {
            display: flex;
            gap: 10px;
            margin-bottom: 16px;
            align-items: flex-start;
        }

        .feature-check {
            background: #2ecc71;
            color: white;
            width: 20px;
            height: 20px;
            border-radius: 50%;
            display: flex;
            align-items: center;
            justify-content: center;
            font-size: 12px;
            flex-shrink: 0;
            margin-top: 2px;
        }

        .feature-text {
            font-size: 16px;
            font-weight: 600;
        }

        .feature-sub {
            font-size: 14px;
            opacity: 0.8;
            margin-top: 2px;
        }

        .security-badge {
            margin-top: auto;
            display: flex;
            align-items: center;
            gap: 8px;
            font-size: 16px;
            font-weight: 600;
        }

        .security-badge span {
            opacity: 0.7;
            font-size: 14px;
            font-weight: 400;
        }

        .card-brands {
            display: flex;
            gap: 12px;
            background: rgba(255,255,255,0.9);
            padding: 10px;
            border-radius: 10px;
            margin-top: 16px;
            width: fit-content;
        }

        .card-brands img {
            height: 24px;
        }

        /* RIGHT PANEL */
        .right-panel {
            background: #FFFFFF;
            padding: 40px;
            display: flex;
            flex-direction: column;
        }

        .payment-title {
            font-size: 24px;
            font-weight: 700;
            color: #2c2c2c;
            margin-bottom: 8px;
        }

        .payment-badge {
            background: linear-gradient(135deg, #7B2FF7, #9B59B6);
            color: white;
            padding: 8px 14px;
            border-radius: 8px;
            font-size: 12px;
            display: inline-block;
            margin-bottom: 24px;
            width: fit-content;
        }

        .form-group {
            margin-bottom: 16px;
        }

        .form-label {
            display: block;
            font-size: 12px;
            font-weight: 500;
            color: #666;
            margin-bottom: 6px;
        }

        .form-input {
            width: 100%;
            padding: 14px;
            border-radius: 10px;
            border: 1px solid #e0e0e0;
            background: #f9f9fb;
            font-size: 14px;
            font-family: 'Inter', sans-serif;
            transition: all 0.2s;
        }

        .form-input:focus {
            outline: none;
            border: 1px solid #7B2FF7;
            box-shadow: 0 0 0 2px rgba(123,47,247,0.1);
        }

        .form-row {
            display: grid;
            grid-template-columns: 1fr 1fr;
            gap: 12px;
        }

        .method-selector {
            display: flex;
            gap: 8px;
            margin-bottom: 20px;
        }

        .method-option {
            flex: 1;
            padding: 12px 16px;
            border-radius: 10px;
            border: 1px solid #e0e0e0;
            background: #f9f9fb;
            cursor: pointer;
            text-align: center;
            font-size: 13px;
            font-weight: 500;
            color: #2c2c2c;
            transition: all 0.2s;
        }

        .method-option:hover {
            border-color: #7B2FF7;
        }

        .method-option.active {
            background: linear-gradient(135deg, #7B2FF7, #9B59B6);
            color: white;
            border-color: transparent;
        }

        .cta-button {
            width: 100%;
            background: linear-gradient(135deg, #7B2FF7, #B06AB3);
            color: white;
            font-size: 16px;
            font-weight: 600;
            padding: 16px;
            border-radius: 12px;
            border: none;
            cursor: pointer;
            transition: 0.3s;
            margin-top: 16px;
        }

        .cta-button:hover {
            transform: translateY(-2px);
            box-shadow: 0 10px 20px rgba(123,47,247,0.3);
        }

        .security-footer {
            margin-top: auto;
            display: flex;
            align-items: center;
            gap: 8px;
            color: #2ecc71;
            font-size: 14px;
            font-weight: 500;
        }

        .powered-by {
            margin-top: 16px;
            font-size: 11px;
            color: #999;
        }

        /* PIX Content */
        .pix-content {
            text-align: center;
            padding: 20px 0;
        }

        .pix-qrcode {
            background: #f9f9fb;
            border: 1px solid #e0e0e0;
            border-radius: 12px;
            padding: 16px;
            display: inline-block;
            margin-bottom: 16px;
        }

        .pix-code {
            background: #f9f9fb;
            border: 1px solid #e0e0e0;
            border-radius: 8px;
            padding: 12px;
            font-size: 11px;
            word-break: break-all;
            color: #666;
            margin-bottom: 12px;
        }

        .pix-copy {
            color: #7B2FF7;
            font-size: 14px;
            font-weight: 500;
            cursor: pointer;
            border: none;
            background: none;
        }

        /* Boleto Content */
        .boleto-content {
            text-align: center;
            padding: 40px 0;
        }

        /* Responsive */
        @media (max-width: 1100px) {
            .container {
                width: 95%;
                height: auto;
                grid-template-columns: 1fr;
            }
            .left-panel {
                padding: 32px;
            }
            .right-panel {
                padding: 32px;
            }
            .plan-title {
                font-size: 32px;
            }
            .plan-price {
                font-size: 36px;
            }
        }
    </style>
</head>
<body>
    <div class="container" x-data="{ 
        method: '<?php echo e($paymentMethod ?? 'credit_card'); ?>',
        country: 'Brasil',
        countries: {
            'Brasil': { lang: 'pt-BR', currency: 'BRL', symbol: 'R$' },
            'United States': { lang: 'en-US', currency: 'USD', symbol: '$' },
            'España': { lang: 'es-ES', currency: 'EUR', symbol: '€' },
            'Portugal': { lang: 'pt-PT', currency: 'EUR', symbol: '€' }
        },
        translations: {
            'pt-BR': {
                securePayment: 'Pagamento Seguro',
                creditCard: 'Cartão de Crédito',
                pix: 'PIX',
                boleto: 'Boleto',
                cardNumber: 'Número do Cartão',
                fullName: 'Nome Completo',
                expiry: 'Validade',
                cvc: 'CVC',
                pay: 'Assinar',
                secure: 'Conexão Segura',
                poweredBy: 'Powered by',
                scanQr: 'Escaneie o QR Code ou copie o código',
                copyCode: 'Copiar código',
                generateBoleto: 'Gerar Boleto',
                viewBoleto: 'Visualizar Boleto',
                dueDate: 'Vencimento'
            },
            'en-US': {
                securePayment: 'Secure Payment',
                creditCard: 'Credit Card',
                pix: 'PIX',
                boleto: 'Boleto',
                cardNumber: 'Card Number',
                fullName: 'Full Name',
                expiry: 'Expiry',
                cvc: 'CVC',
                pay: 'Subscribe',
                secure: 'Secure Connection',
                poweredBy: 'Powered by',
                scanQr: 'Scan QR Code or copy the code',
                copyCode: 'Copy code',
                generateBoleto: 'Generate Boleto',
                viewBoleto: 'View Boleto',
                dueDate: 'Due Date'
            },
            'es-ES': {
                securePayment: 'Pago Seguro',
                creditCard: 'Tarjeta de Crédito',
                pix: 'PIX',
                boleto: 'Boleto',
                cardNumber: 'Número de Tarjeta',
                fullName: 'Nombre Completo',
                expiry: 'Vencimiento',
                cvc: 'CVC',
                pay: 'Suscribir',
                secure: 'Conexión Segura',
                poweredBy: 'Desarrollado por',
                scanQr: 'Escanee el código QR o copie el código',
                copyCode: 'Copiar código',
                generateBoleto: 'Generar Boleto',
                viewBoleto: 'Ver Boleto',
                dueDate: 'Vencimiento'
            },
            'pt-PT': {
                securePayment: 'Pagamento Seguro',
                creditCard: 'Cartão de Crédito',
                pix: 'PIX',
                boleto: 'Boleto',
                cardNumber: 'Número do Cartão',
                fullName: 'Nome Completo',
                expiry: 'Validade',
                cvc: 'CVC',
                pay: 'Subscrever',
                secure: 'Conexão Segura',
                poweredBy: 'Desenvolvido por',
                scanQr: 'Digitalize o código QR ou copie o código',
                copyCode: 'Copiar código',
                generateBoleto: 'Gerar Boleto',
                viewBoleto: 'Ver Boleto',
                dueDate: 'Vencimento'
            }
        },
        t(key) { return this.translations[this.countries[this.country]?.lang || 'pt-BR']?.[key] || key; },
        formatCurrency(amount) {
            const sym = this.countries[this.country]?.symbol || 'R$';
            return sym + ' ' + amount.toFixed(2).replace('.', ',');
        }
    }">

        <!-- LEFT PANEL -->
        <div class="left-panel">
            <div class="logo">
                <div class="logo-icon">B</div>
                <span class="logo-text">Basileia</span>
            </div>

            <div style="display: flex; gap: 10px; align-items: center; margin-bottom: 24px;">
                <span class="badge">PLANO PROFISSIONAL ATIVADO</span>
                <select x-model="country" style="background: rgba(255,255,255,0.15); color: white; border: none; padding: 6px 12px; border-radius: 20px; font-size: 12px; cursor: pointer;">
                    <template x-for="c in Object.keys(countries)" :key="c">
                        <option :value="c" x-text="c" :style="{color: '#2c2c2c'}"></option>
                    </template>
                </select>
            </div>

            <h1 class="plan-title"><?php echo e($transaction->description ?? 'Plano Profissional'); ?></h1>
            <div class="plan-price" x-text="formatCurrency(<?php echo e($transaction->amount); ?>)"></div>
            <p class="plan-billing"><?php echo e($transaction->customer_name ?? 'Basileia Global'); ?></p>

            <ul class="features">
                <li>
                    <div class="feature-check">✓</div>
                    <div>
                        <div class="feature-text">Gestão com IA</div>
                        <div class="feature-sub">Automação inteligente para sua igreja</div>
                    </div>
                </li>
                <li>
                    <div class="feature-check">✓</div>
                    <div>
                        <div class="feature-text">Automação Completa</div>
                        <div class="feature-sub">Economize tempo com processos automáticos</div>
                    </div>
                </li>
                <li>
                    <div class="feature-check">✓</div>
                    <div>
                        <div class="feature-text">Suporte 24/7</div>
                        <div class="feature-sub">Equipe dedicada sempre disponível</div>
                    </div>
                </li>
                <li>
                    <div class="feature-check">✓</div>
                    <div>
                        <div class="feature-text">Relatórios Avançados</div>
                        <div class="feature-sub">Analytics detalhados para decisões</div>
                    </div>
                </li>
            </ul>

            <div class="security-badge">
                🔐
                <span>Suas Informações estão Protegidas</span>
            </div>

            <div class="card-brands">
                <svg width="32" height="20" viewBox="0 0 32 20"><rect width="32" height="20" rx="3" fill="#1A1F71"/><circle cx="12" cy="10" r="6" fill="#EB001B" opacity="0.8"/><circle cx="20" cy="10" r="6" fill="#F79E1B" opacity="0.8"/></svg>
                <svg width="32" height="20" viewBox="0 0 32 20"><rect width="32" height="20" rx="3" fill="#006FCF"/><text x="16" y="13" font-size="8" fill="white" text-anchor="middle" font-weight="bold">AMEX</text></svg>
                <svg width="32" height="20" viewBox="0 0 32 20"><rect width="32" height="20" rx="3" fill="#FF5F00"/><rect x="8" y="6" width="7" height="8" rx="4" fill="#EB001B"/><rect x="17" y="6" width="7" height="8" rx="4" fill="#F79E1B"/></svg>
            </div>
        </div>

        <!-- RIGHT PANEL -->
        <div class="right-panel">
            <h2 class="payment-title" x-text="t('securePayment')"></h2>

            <!-- Method Selector -->
            <div class="method-selector">
                <div class="method-option" :class="{'active': method === 'credit_card'}" @click="method = 'credit_card'" x-text="t('creditCard')"></div>
                <div class="method-option" :class="{'active': method === 'pix'}" @click="method = 'pix'" x-text="t('pix')"></div>
                <div class="method-option" :class="{'active': method === 'boleto'}" @click="method = 'boleto'" x-text="t('boleto')"></div>
            </div>

            <!-- Credit Card Form -->
            <div x-show="method === 'credit_card'" x-cloak style="flex: 1; display: flex; flex-direction: column;">
                <form method="POST" action="<?php echo e(route('checkout.process', $transaction->uuid)); ?>" style="flex: 1; display: flex; flex-direction: column;">
                    <?php echo csrf_field(); ?>
                    <input type="hidden" name="payment_method" value="credit_card">
                    
                    <div class="form-group">
                        <label class="form-label" x-text="t('cardNumber')"></label>
                        <input type="text" name="card_number" required maxlength="19" placeholder="0000 0000 0000 0000" class="form-input">
                    </div>

                    <div class="form-group">
                        <label class="form-label" x-text="t('fullName')"></label>
                        <input type="text" name="card_holder_name" required placeholder="NOME COMO ESTÁ NO CARTÃO" class="form-input" style="text-transform: uppercase;">
                    </div>

                    <div class="form-row">
                        <div>
                            <label class="form-label" x-text="t('expiry')"></label>
                            <input type="text" name="card_expiry" required maxlength="5" placeholder="MM/AA" class="form-input">
                        </div>
                        <div>
                            <label class="form-label" x-text="t('cvc')"></label>
                            <input type="text" name="card_cvv" required maxlength="4" placeholder="123" class="form-input">
                        </div>
                    </div>

                    <button type="submit" class="cta-button">
                        🔒 <span x-text="t('pay')"></span> <span x-text="formatCurrency(<?php echo e($transaction->amount); ?>)"></span>
                    </button>
                </form>
            </div>

            <!-- PIX Content -->
            <div x-show="method === 'pix'" x-cloak class="pix-content" style="flex: 1;">
                <?php if($transaction->pix_qr_code ?? false): ?>
                    <div class="pix-qrcode">
                        <img src="data:image/png;base64,<?php echo e($transaction->pix_qr_code_image ?? ''); ?>" alt="QR Code PIX" width="180" height="180">
                    </div>
                    <p style="font-size: 13px; color: #666; margin-bottom: 12px;" x-text="t('scanQr')"></p>
                    <div class="pix-code"><?php echo e($transaction->pix_copy_paste ?? ''); ?></div>
                    <button onclick="navigator.clipboard.writeText('<?php echo e($transaction->pix_copy_paste ?? ''); ?>')" class="pix-copy" x-text="t('copyCode')"></button>
                <?php else: ?>
                    <form method="POST" action="<?php echo e(route('checkout.process', $transaction->uuid)); ?>">
                        <?php echo csrf_field(); ?>
                        <input type="hidden" name="payment_method" value="pix">
                        <button type="submit" class="cta-button" x-text="t('pay') + ' ' + formatCurrency(<?php echo e($transaction->amount); ?>)"></button>
                    </form>
                <?php endif; ?>
            </div>

            <!-- Boleto Content -->
            <div x-show="method === 'boleto'" x-cloak class="boleto-content" style="flex: 1;">
                <?php if($transaction->boleto_url ?? false): ?>
                    <a href="<?php echo e($transaction->boleto_url); ?>" target="_blank" class="cta-button" style="display: block; text-decoration: none;">
                        📄 <span x-text="t('viewBoleto')"></span>
                    </a>
                    <?php if($transaction->boleto_expiration): ?>
                        <p style="font-size: 13px; color: #666; margin-top: 16px;">
                            <span x-text="t('dueDate')"></span>: <?php echo e($transaction->boleto_expiration); ?>

                        </p>
                    <?php endif; ?>
                <?php else: ?>
                    <form method="POST" action="<?php echo e(route('checkout.process', $transaction->uuid)); ?>">
                        <?php echo csrf_field(); ?>
                        <input type="hidden" name="payment_method" value="boleto">
                        <button type="submit" class="cta-button" x-text="t('pay') + ' ' + formatCurrency(<?php echo e($transaction->amount); ?>)"></button>
                    </form>
                <?php endif; ?>
            </div>

            <!-- Security Footer -->
            <div class="security-footer">
                <svg width="16" height="16" fill="none" stroke="#2ecc71" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z"/></svg>
                <span x-text="t('secure')"></span>
            </div>

            <p class="powered-by">
                <span x-text="t('poweredBy')"></span> <strong>Asaas</strong>
            </p>
        </div>
    </div>
</body>
</html>
<?php /**PATH /Users/viniciusreinehr/.gemini/antigravity/scratch/Checkout/resources/views/checkout/index.blade.php ENDPATH**/ ?>