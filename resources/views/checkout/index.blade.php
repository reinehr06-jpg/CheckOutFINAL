<!DOCTYPE html>
<html lang="pt-BR">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <meta name="csrf-token" content="{{ csrf_token() }}">
    <title>{{ $transaction->description ?? 'Pagamento' }} - Basileia</title>
    <script defer src="https://cdn.jsdelivr.net/npm/alpinejs@3.x.x/dist/cdn.min.js"></script>
    <link rel="preconnect" href="https://fonts.googleapis.com">
    <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
    <link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;800&display=swap" rel="stylesheet">
    <style>
        * { margin: 0; padding: 0; box-sizing: border-box; }

        body {
            font-family: 'Inter', sans-serif;
            min-height: 100vh;
            display: flex;
            align-items: center;
            justify-content: center;
            background:
                radial-gradient(circle at 10% 85%, rgba(120,80,200,0.15), transparent 30%),
                radial-gradient(circle at 90% 15%, rgba(255,255,255,0.25), transparent 25%),
                #efedf6;
        }

        .main-card {
            width: 1100px;
            height: 650px;
            border-radius: 28px;
            overflow: hidden;
            background: #fff;
            box-shadow: 0 20px 60px rgba(80,40,140,0.12);
            display: grid;
            grid-template-columns: 49% 51%;
            position: relative;
        }

        /* ==================== LEFT PANEL ==================== */
        .left-panel {
            background: linear-gradient(145deg, #5a1d9a 0%, #7b2ff7 50%, #9944dd 100%);
            padding: 40px 44px 30px;
            display: flex;
            flex-direction: column;
            position: relative;
            overflow: hidden;
        }

        .left-panel::before {
            content: '';
            position: absolute;
            top: -40%;
            right: -30%;
            width: 80%;
            height: 80%;
            background: radial-gradient(circle, rgba(255,255,255,0.08) 0%, transparent 70%);
            pointer-events: none;
        }

        .brand {
            display: flex;
            align-items: center;
            gap: 12px;
            margin-bottom: 20px;
            position: relative;
            z-index: 2;
        }
        .brand-icon {
            width: 48px;
            height: 48px;
            border-radius: 10px;
            background: #fff;
            color: #7c2ef0;
            display: flex;
            align-items: center;
            justify-content: center;
            font-size: 26px;
            font-weight: 800;
        }
        .brand-text {
            color: #fff;
            font-size: 28px;
            font-weight: 700;
        }

        .plan-badge {
            display: inline-block;
            padding: 10px 24px;
            border-radius: 999px;
            background: rgba(255,255,255,0.18);
            color: #fff;
            font-size: 13px;
            font-weight: 600;
            letter-spacing: 0.8px;
            margin-bottom: 20px;
            width: fit-content;
            position: relative;
            z-index: 2;
        }

        .plan-title {
            color: #fff;
            font-size: 48px;
            font-weight: 700;
            line-height: 1.1;
            margin-bottom: 6px;
            position: relative;
            z-index: 2;
        }

        .price-row {
            display: flex;
            align-items: baseline;
            gap: 8px;
            color: #fff;
            margin-bottom: 30px;
            position: relative;
            z-index: 2;
        }
        .price-currency { font-size: 24px; font-weight: 500; }
        .price-value { font-size: 56px; font-weight: 800; line-height: 1; }
        .price-period { font-size: 15px; font-weight: 500; opacity: 0.85; text-transform: uppercase; letter-spacing: 0.5px; }

        .features {
            display: flex;
            flex-direction: column;
            gap: 22px;
            position: relative;
            z-index: 2;
            margin-bottom: auto;
        }
        .feature-item {
            display: grid;
            grid-template-columns: 30px 1fr;
            column-gap: 14px;
            align-items: start;
        }
        .feature-icon {
            width: 28px;
            height: 28px;
            border-radius: 50%;
            background: #54d28a;
            color: #fff;
            display: flex;
            align-items: center;
            justify-content: center;
            font-size: 15px;
            font-weight: 700;
            margin-top: 2px;
        }
        .feature-title { color: #fff; font-size: 17px; font-weight: 600; }
        .feature-desc { color: rgba(255,255,255,0.82); font-size: 14px; margin-top: 2px; }

        .left-bottom {
            position: relative;
            z-index: 2;
            margin-top: auto;
            padding-top: 20px;
            border-top: 1px solid rgba(255,255,255,0.1);
        }
        .left-security-title { color: #fff; font-size: 18px; font-weight: 600; }
        .left-security-desc { color: rgba(255,255,255,0.8); font-size: 13px; margin-top: 4px; }

        .card-brands {
            display: flex;
            align-items: center;
            gap: 16px;
            background: rgba(255,255,255,0.92);
            padding: 10px 20px;
            border-radius: 10px;
            margin-top: 14px;
            width: fit-content;
        }
        .card-brands svg { height: 26px; width: auto; }

        /* ==================== RIGHT PANEL ==================== */
        .right-panel {
            background: #fbf8fc;
            padding: 36px 48px 24px;
            display: flex;
            flex-direction: column;
            position: relative;
        }

        .locale-switcher {
            position: absolute;
            right: 48px;
            top: 36px;
        }
        .locale-switcher select {
            height: 36px;
            padding: 0 12px;
            border: 1px solid #ddd7e8;
            border-radius: 8px;
            background: #fff;
            color: #3f3558;
            font-size: 13px;
            font-weight: 500;
            cursor: pointer;
            font-family: 'Inter', sans-serif;
        }
        .locale-switcher select:focus { outline: none; border-color: #7b2ff7; }

        .form-title {
            color: #221749;
            font-size: 26px;
            font-weight: 700;
            margin-bottom: 14px;
        }

        .payment-via {
            display: flex;
            align-items: center;
            gap: 12px;
            margin-bottom: 18px;
        }
        .payment-label { color: #817796; font-size: 13px; font-weight: 500; }
        .payment-chip {
            padding: 8px 16px;
            border-radius: 8px;
            background: linear-gradient(90deg, #7b35f4, #9b59b6);
            color: #fff;
            font-size: 12px;
            font-weight: 600;
        }

        .form-label {
            display: block;
            color: #43395d;
            font-size: 13px;
            font-weight: 500;
            margin-bottom: 6px;
        }
        .form-input {
            width: 100%;
            height: 44px;
            border: 1px solid #e1dbe9;
            border-radius: 10px;
            background: #fbf9fd;
            color: #2b2340;
            padding: 0 14px;
            font-size: 14px;
            font-family: 'Inter', sans-serif;
            transition: border-color 0.2s, box-shadow 0.2s;
        }
        .form-input::placeholder { color: #a99fbb; }
        .form-input:focus { outline: none; border-color: #7b2ff7; box-shadow: 0 0 0 3px rgba(123,47,247,0.08); }

        .form-helper { color: #9d94ae; font-size: 12px; margin-top: 4px; margin-bottom: 10px; }
        .form-group { margin-bottom: 10px; }
        .form-row { display: grid; grid-template-columns: 1fr 1fr; gap: 14px; }

        .cta-button {
            width: 100%;
            height: 48px;
            border: none;
            border-radius: 12px;
            background: linear-gradient(90deg, #7b2ff7, #a855f7);
            color: #fff;
            font-size: 15px;
            font-weight: 700;
            cursor: pointer;
            transition: transform 0.2s, box-shadow 0.2s;
            box-shadow: 0 6px 16px rgba(123,47,247,0.25);
            margin-top: 8px;
            font-family: 'Inter', sans-serif;
        }
        .cta-button:hover { transform: translateY(-2px); box-shadow: 0 10px 24px rgba(123,47,247,0.35); }

        .security-footer {
            display: flex;
            align-items: center;
            gap: 8px;
            color: #3ca95c;
            font-size: 13px;
            font-weight: 500;
            margin-top: 12px;
        }

        .footer-note {
            position: absolute;
            left: 50%;
            bottom: 16px;
            transform: translateX(-50%);
            color: #9b8fb5;
            font-size: 12px;
            white-space: nowrap;
        }
    </style>
</head>
<body
    x-data="{
        country: 'BR',
        cfg: null,
        configs: {
            BR: {
                locale: 'pt-BR', currency: 'BRL', symbol: 'R$',
                amount: {{ $transaction->amount }},
                billingLabel: 'COBRANÇA MENSAL',
                documentLabel: 'DOCUMENTO DO PAGADOR (CPF OU CNPJ)',
                documentPlaceholder: '000.000.000-00',
                documentMax: 18,
                btnPrefix: 'Assinar Plano por',
                emailLabel: 'E-MAIL DE ACESSO AO PAINEL',
                emailHelper: 'Este e-mail receberá suas credenciais de login.',
                cardLabel: 'NÚMERO DO CARTÃO',
                expiryLabel: 'EXPIRAÇÃO',
                cvcLabel: 'CVC',
                nameLabel: 'NOME COMPLETO (ESCRITO NO CARTÃO)',
                payTitle: 'Pagamento Seguro',
                viaLabel: 'PAGAMENTO VIA:',
                chipLabel: 'CARTÃO DE CRÉDITO',
                secureText: 'Pagamento 100% Seguro',
                secureLeft: 'Pagamento 100% Seguro',
                secureLeftDesc: 'Seus dados são protegidos por criptografia SSL.',
                badge: 'PLANO PROFISSIONAL ATIVADO',
                planName: 'Plano Mensal',
                features: [
                    { t: 'Gestão com IA Integrada', d: 'Aplicação para solicitações da igreja.' },
                    { t: 'Automação de Cultos', d: 'Lembretes e avisos 100% automáticos.' },
                    { t: 'Células e Eventos', d: 'Controle total de presença, cursos e células.' }
                ],
                showDoc: true
            },
            US: {
                locale: 'en-US', currency: 'USD', symbol: 'US$',
                amount: 39.90,
                billingLabel: 'MONTHLY BILLING',
                documentLabel: 'PAYER DOCUMENT',
                documentPlaceholder: 'SSN or Tax ID',
                documentMax: 20,
                btnPrefix: 'Subscribe for',
                emailLabel: 'ACCESS EMAIL',
                emailHelper: 'This email will receive your login credentials.',
                cardLabel: 'CARD NUMBER',
                expiryLabel: 'EXPIRY',
                cvcLabel: 'CVC',
                nameLabel: 'FULL NAME (AS ON CARD)',
                payTitle: 'Secure Payment',
                viaLabel: 'PAYMENT METHOD:',
                chipLabel: 'CREDIT CARD',
                secureText: '100% Secure Payment',
                secureLeft: '100% Secure Payment',
                secureLeftDesc: 'Your data is protected with SSL encryption.',
                badge: 'PROFESSIONAL PLAN ACTIVATED',
                planName: 'Monthly Plan',
                features: [
                    { t: 'AI-Integrated Management', d: 'Application for church requests.' },
                    { t: 'Service Automation', d: 'Reminders and alerts 100% automatic.' },
                    { t: 'Cells & Events', d: 'Full control of attendance, courses and cells.' }
                ],
                showDoc: false
            },
            PT: {
                locale: 'pt-PT', currency: 'EUR', symbol: '€',
                amount: 36.90,
                billingLabel: 'COBRANÇA MENSAL',
                documentLabel: 'DOCUMENTO DO PAGADOR',
                documentPlaceholder: 'NIF',
                documentMax: 12,
                btnPrefix: 'Subscrever por',
                emailLabel: 'E-MAIL DE ACESSO',
                emailHelper: 'Este e-mail receberá as suas credenciais de acesso.',
                cardLabel: 'NÚMERO DO CARTÃO',
                expiryLabel: 'VALIDADE',
                cvcLabel: 'CVC',
                nameLabel: 'NOME COMPLETO (ESCRITO NO CARTÃO)',
                payTitle: 'Pagamento Seguro',
                viaLabel: 'PAGAMENTO VIA:',
                chipLabel: 'CARTÃO DE CRÉDITO',
                secureText: 'Pagamento 100% Seguro',
                secureLeft: 'Pagamento 100% Seguro',
                secureLeftDesc: 'Os seus dados estão protegidos por encriptação SSL.',
                badge: 'PLANO PROFISSIONAL ATIVADO',
                planName: 'Plano Mensal',
                features: [
                    { t: 'Gestão com IA Integrada', d: 'Aplicação para solicitações da igreja.' },
                    { t: 'Automação de Cultos', d: 'Lembretes e avisos 100% automáticos.' },
                    { t: 'Células e Eventos', d: 'Controlo total de presença, cursos e células.' }
                ],
                showDoc: true
            }
        },
        init() { this.cfg = this.configs[this.country]; },
        switchCountry(code) {
            if (this.configs[code]) {
                this.country = code;
                this.cfg = this.configs[code];
            }
        },
        fmt() {
            try {
                return new Intl.NumberFormat(this.cfg.locale, { style: 'currency', currency: this.cfg.currency }).format(this.cfg.amount);
            } catch(e) { return this.cfg.symbol + ' ' + this.cfg.amount.toFixed(2); }
        },
        fmtDec() { return this.cfg.amount.toFixed(2).replace('.', ','); }
    }"
>
    <section class="main-card">
        <!-- LEFT -->
        <div class="left-panel">
            <div class="brand">
                <div class="brand-icon">B</div>
                <div class="brand-text">Basileia</div>
            </div>

            <div class="plan-badge" x-text="cfg.badge"></div>
            <h1 class="plan-title" x-text="cfg.planName"></h1>

            <div class="price-row">
                <span class="price-currency" x-text="cfg.symbol"></span>
                <span class="price-value" x-text="fmtDec()"></span>
                <span class="price-period" x-text="cfg.billingLabel"></span>
            </div>

            <div class="features">
                <template x-for="f in cfg.features" :key="f.t">
                    <div class="feature-item">
                        <div class="feature-icon">✓</div>
                        <div>
                            <div class="feature-title" x-text="f.t"></div>
                            <div class="feature-desc" x-text="f.d"></div>
                        </div>
                    </div>
                </template>
            </div>

            <div class="left-bottom">
                <div class="left-security-title" x-text="cfg.secureLeft"></div>
                <div class="left-security-desc" x-text="cfg.secureLeftDesc"></div>
                <div class="card-brands">
                    <svg viewBox="0 0 60 20"><text x="0" y="16" font-size="15" font-weight="bold" fill="#1A1F71">VISA</text></svg>
                    <svg viewBox="0 0 70 20"><circle cx="22" cy="10" r="8" fill="#EB001B" opacity="0.85"/><circle cx="32" cy="10" r="8" fill="#F79E1B" opacity="0.85"/></svg>
                    <svg viewBox="0 0 50 20"><rect x="2" y="1" width="46" height="18" rx="3" fill="#006FCF"/><text x="25" y="14" font-size="9" fill="white" text-anchor="middle" font-weight="bold">AMEX</text></svg>
                    <svg viewBox="0 0 50 20"><text x="2" y="15" font-size="14" font-weight="bold" fill="#FF6600">elo</text></svg>
                </div>
            </div>
        </div>

        <!-- RIGHT -->
        <div class="right-panel">
            <div class="locale-switcher">
                <select @change="switchCountry($event.target.value)" x-model="country">
                    <option value="BR">🇧🇷 Brasil</option>
                    <option value="US">🇺🇸 United States</option>
                    <option value="PT">🇵🇹 Portugal</option>
                </select>
            </div>

            <h2 class="form-title" x-text="cfg.payTitle"></h2>

            <div class="payment-via">
                <span class="payment-label" x-text="cfg.viaLabel"></span>
                <span class="payment-chip" x-text="cfg.chipLabel"></span>
            </div>

            <form method="POST" action="{{ route('checkout.process', $transaction->uuid) }}">
                @csrf
                <input type="hidden" name="payment_method" value="credit_card">

                <div class="form-group">
                    <label class="form-label" x-text="cfg.emailLabel"></label>
                    <input type="email" name="email" class="form-input" value="{{ $transaction->customer_email ?? '' }}" placeholder="email@exemplo.com" required>
                    <div class="form-helper" x-text="cfg.emailHelper"></div>
                </div>

                <div class="form-group">
                    <label class="form-label" x-text="cfg.cardLabel"></label>
                    <input type="text" name="card_number" class="form-input" maxlength="19" placeholder="0000 0000 0000 0000" required>
                </div>

                <div class="form-row">
                    <div>
                        <label class="form-label" x-text="cfg.expiryLabel"></label>
                        <input type="text" name="card_expiry" class="form-input" maxlength="5" placeholder="MM/AA" required>
                    </div>
                    <div>
                        <label class="form-label" x-text="cfg.cvcLabel"></label>
                        <input type="text" name="card_cvv" class="form-input" maxlength="4" placeholder="123" required>
                    </div>
                </div>

                <div class="form-group" style="margin-top: 6px;">
                    <label class="form-label" x-text="cfg.nameLabel"></label>
                    <input type="text" name="card_holder_name" class="form-input" placeholder="FULANO DE TAL" required style="text-transform: uppercase;">
                </div>

                <div class="form-group" x-show="cfg.showDoc">
                    <label class="form-label" x-text="cfg.documentLabel"></label>
                    <input type="text" name="cpf_cnpj" class="form-input" :maxlength="cfg.documentMax" :placeholder="cfg.documentPlaceholder" required>
                </div>

                <button type="submit" class="cta-button">
                    <span x-text="cfg.btnPrefix + ' ' + fmt()"></span>
                </button>
            </form>

            <div class="security-footer">
                <svg width="15" height="15" fill="none" stroke="#3ca95c" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"/></svg>
                <span x-text="cfg.secureText"></span>
            </div>
        </div>

        <div class="footer-note">© 2024 Basileia Vendas - Enterprise Cloud Operations</div>
    </section>
</body>
</html>
