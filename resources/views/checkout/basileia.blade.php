<!DOCTYPE html>
<html lang="{{ $currentLocale }}">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <meta name="csrf-token" content="{{ csrf_token() }}">
    <title>{{ $plano }} - Basileia Checkout</title>
    
    <!-- Scripts -->
    <script defer src="https://cdn.jsdelivr.net/npm/alpinejs@3.x.x/dist/cdn.min.js"></script>
    <link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;800&family=Share+Tech+Mono&display=swap" rel="stylesheet">
    <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.4.0/css/all.min.css">

    <style>
        * { margin: 0; padding: 0; box-sizing: border-box; }
        html, body {
            height: 100%;
            margin: 0;
            padding: 0;
            overflow-x: hidden;
            background: linear-gradient(135deg, #667eea 0%, #764ba2 50%, #6b3fa0 100%);
        }
        body {
            font-family: 'Inter', sans-serif;
            min-height: 100vh;
            min-height: 100dvh;
            display: flex;
            align-items: center;
            justify-content: center;
            background: linear-gradient(135deg, #667eea 0%, #764ba2 50%, #6b3fa0 100%);
            background-attachment: fixed;
            padding: 20px;
        }

        .main-card {
            width: 100%;
            max-width: 1100px;
            min-height: 680px;
            border-radius: 28px;
            overflow: hidden;
            background: #fff;
            box-shadow: 0 20px 60px rgba(0,0,0,0.2);
            display: grid;
            grid-template-columns: 48% 52%;
            position: relative;
        }

        @media (max-width: 900px) {
            .main-card { grid-template-columns: 1fr; max-width: 500px; }
        }

        /* --- Left Panel --- */
        .left-panel {
            background: linear-gradient(145deg, #5a1d9a 0%, #7b2ff7 50%, #9944dd 100%);
            padding: 50px;
            color: white;
            display: flex;
            flex-direction: column;
            position: relative;
            overflow: hidden;
        }

        .left-panel::before {
            content: ''; position: absolute; top: -50%; left: -50%; width: 200%; height: 200%;
            background: radial-gradient(circle, rgba(255,255,255,0.1) 0%, transparent 70%);
            pointer-events: none;
        }

        .brand-logo { display: flex; align-items: center; gap: 12px; margin-bottom: 50px; }
        .logo-box { width: 44px; height: 44px; background: white; border-radius: 12px; display: flex; align-items: center; justify-content: center; box-shadow: 0 10px 20px rgba(0,0,0,0.1); }
        .logo-box img { width: 28px; }
        .brand-name { font-size: 24px; font-weight: 800; letter-spacing: -0.5px; }

        .summary-label { font-size: 13px; font-weight: 600; opacity: 0.7; text-transform: uppercase; letter-spacing: 1.5px; margin-bottom: 12px; }
        .plan-title { font-size: 42px; font-weight: 800; line-height: 1.1; margin-bottom: 25px; }
        
        .price-row { display: flex; align-items: baseline; gap: 8px; margin-bottom: 40px; }
        .price-symbol { font-size: 20px; font-weight: 600; opacity: 0.8; }
        .price-val { font-size: 52px; font-weight: 800; }
        .price-period { font-size: 16px; opacity: 0.6; }

        .feature-list { display: flex; flex-direction: column; gap: 20px; }
        .feature-item { display: flex; align-items: center; gap: 12px; font-size: 15px; font-weight: 500; }
        .feature-item i { color: #22c55e; font-size: 18px; }

        .security-badge { margin-top: auto; display: flex; align-items: center; gap: 10px; font-size: 13px; opacity: 0.7; border-top: 1px solid rgba(255,255,255,0.1); padding-top: 30px; }

        /* --- Right Panel --- */
        .right-panel { padding: 50px; display: flex; flex-direction: column; }

        .payment-header { display: flex; justify-content: space-between; align-items: flex-start; margin-bottom: 35px; }
        .payment-title { font-size: 26px; font-weight: 800; color: #1e293b; }

        .lang-selector { position: relative; }
        .lang-trigger { 
            background: #f1f5f9; padding: 8px 12px; border-radius: 12px; cursor: pointer; 
            font-size: 12px; font-weight: 700; color: #64748b; display: flex; align-items: center; gap: 8px;
            transition: all 0.2s; border: 1px solid #e2e8f0;
        }
        .lang-trigger:hover { background: #e2e8f0; }
        .lang-dropdown { 
            position: absolute; top: 100%; right: 0; background: white; border-radius: 12px; 
            box-shadow: 0 10px 25px rgba(0,0,0,0.1); z-index: 100; min-width: 120px; margin-top: 8px;
            border: 1px solid #e2e8f0; overflow: hidden;
        }
        .lang-option { padding: 10px 15px; font-size: 13px; font-weight: 600; cursor: pointer; transition: background 0.2s; color: #1e293b; display: flex; align-items: center; gap: 10px; }
        .lang-option:hover { background: #f8fafc; }

        /* Card Preview */
        .card-container { perspective: 1000px; margin-bottom: 35px; }
        .card-inner { 
            width: 100%; height: 210px; position: relative; transform-style: preserve-3d; 
            transition: transform 0.8s cubic-bezier(0.175, 0.885, 0.32, 1.275); 
        }
        .card-inner.is-flipped { transform: rotateY(180deg); }
        .card-face { 
            position: absolute; width: 100%; height: 100%; backface-visibility: hidden; 
            border-radius: 20px; padding: 25px; color: white; display: flex; flex-direction: column; justify-content: space-between;
            box-shadow: 0 15px 35px rgba(0,0,0,0.15);
        }
        .card-front { background: linear-gradient(135deg, #7c3aed 0%, #4c1d95 100%); }
        .card-back { background: linear-gradient(135deg, #4c1d95 0%, #2e1065 100%); transform: rotateY(180deg); padding: 0; display: flex; flex-direction: column; justify-content: center; }
        
        .card-number { font-family: 'Share Tech Mono', monospace; font-size: 22px; letter-spacing: 2px; word-spacing: 8px; margin: 20px 0; }
        .card-bottom { display: flex; justify-content: space-between; align-items: flex-end; }
        .card-label { font-size: 9px; opacity: 0.6; text-transform: uppercase; letter-spacing: 1px; margin-bottom: 4px; }
        .card-val { font-size: 14px; font-weight: 600; text-transform: uppercase; }

        .magnetic-stripe { height: 40px; background: #111; width: 100%; margin-top: 20px; }
        .signature-strip { height: 35px; background: #eee; margin: 15px; border-radius: 4px; display: flex; align-items: center; justify-content: flex-end; padding-right: 15px; color: #333; font-family: 'Share Tech Mono', monospace; }

        /* Form */
        .payment-form { display: grid; gap: 20px; }
        .input-group { display: flex; flex-direction: column; gap: 8px; }
        .input-label { font-size: 12px; font-weight: 700; color: #64748b; text-transform: uppercase; letter-spacing: 0.5px; }
        .input-control { width: 100%; height: 50px; background: #f8fafc; border: 1px solid #e2e8f0; border-radius: 12px; padding: 0 16px; font-size: 15px; font-weight: 500; transition: all 0.2s; }
        .input-control:focus { outline: none; border-color: #7c3aed; background: #fff; box-shadow: 0 0 0 4px rgba(124, 58, 237, 0.1); }
        
        .form-row { display: grid; grid-template-columns: 1fr 1fr; gap: 20px; }

        .btn-submit { 
            height: 54px; background: #7c3aed; color: white; border: none; border-radius: 14px; 
            font-size: 16px; font-weight: 700; cursor: pointer; transition: all 0.3s; 
            box-shadow: 0 10px 15px -3px rgba(124, 58, 237, 0.3); display: flex; align-items: center; justify-content: center; gap: 10px;
        }
        .btn-submit:hover { background: #6d28d9; transform: translateY(-1px); box-shadow: 0 15px 20px -3px rgba(124, 58, 237, 0.4); }
        .btn-submit:active { transform: translateY(0); }
        .btn-submit:disabled { opacity: 0.7; cursor: not-allowed; }

        .footer-logos { display: flex; justify-content: center; gap: 25px; margin-top: 30px; opacity: 0.4; filter: grayscale(1); }

        .timer-box { font-size: 12px; font-weight: 700; color: #ef4444; background: #fee2e2; padding: 6px 12px; border-radius: 8px; display: flex; align-items: center; gap: 6px; }

        [x-cloak] { display: none !important; }
    </style>
</head>
<body x-data="checkoutApp({{ json_encode($i18n) }}, '{{ $currentLocale }}')">

    <main class="main-card">
        <!-- LEFT PANEL -->
        <section class="left-panel">
            <div class="brand-logo">
                <div class="logo-box">
                    <img src="{{ asset('img/basileia-logo-clean-b.png') }}" alt="B">
                </div>
                <span class="brand-name">Basiléia</span>
            </div>

            <div class="summary-content">
                <div class="summary-label" x-text="t('selected_plan')">PLANO SELECIONADO</div>
                <h1 class="plan-title">{{ $plano }}</h1>

                <div class="price-row">
                    <span class="price-symbol" x-text="currentCountry.symbol">R$</span>
                    <span class="price-val" x-text="formatPrice({{ $transaction->amount }})">{{ number_format($transaction->amount, 2, ',', '.') }}</span>
                    <span class="price-period" x-text="'/' + (ciclo === 'anual' ? t('year') : t('month'))">/mês</span>
                </div>

                <div class="feature-list">
                    <div class="feature-item"><i class="fas fa-check-circle"></i> <span x-text="t('immediate_access')">Acesso imediato ao painel</span></div>
                    <div class="feature-item"><i class="fas fa-check-circle"></i> <span x-text="t('ai_assistant')">Assistente IA no WhatsApp</span></div>
                    <div class="feature-item"><i class="fas fa-check-circle"></i> <span x-text="t('member_management')">Gestão completa de membros</span></div>
                    <div class="feature-item"><i class="fas fa-check-circle"></i> <span x-text="t('secure_checkout')">Checkout 100% Seguro</span></div>
                </div>
            </div>

            <div class="security-badge">
                <i class="fas fa-lock"></i>
                <span x-text="t('encryption_notice')">Sua transação é protegida por SSL de 256 bits</span>
            </div>
        </section>

        <!-- RIGHT PANEL -->
        <section class="right-panel">
            <div class="payment-header">
                <h2 class="payment-title" x-text="t('payment_details')">Pagamento</h2>
                
                <div class="lang-selector" @click.away="showDropdown = false">
                    <div class="lang-trigger" @click="showDropdown = !showDropdown">
                        <span x-text="currentCountry.flag"></span>
                        <span x-text="currentCountry.code"></span>
                        <i class="fas fa-chevron-down" style="font-size: 10px;"></i>
                    </div>
                    <div class="lang-dropdown" x-show="showDropdown" x-cloak>
                        <template x-for="c in countries" :key="c.code">
                            <div class="lang-option" @click="setCountry(c)">
                                <span x-text="c.flag"></span>
                                <span x-text="c.name"></span>
                            </div>
                        </template>
                    </div>
                </div>
            </div>

            <div class="card-container">
                <div class="card-inner" :class="{ 'is-flipped': isFlipped }">
                    <div class="card-face card-front">
                        <div style="display: flex; justify-content: space-between; align-items: flex-start;">
                            <div style="width: 45px; height: 32px; background: rgba(255,255,255,0.2); border-radius: 6px;"></div>
                            <div style="font-weight: 900; font-style: italic; font-size: 18px;" x-text="detectedBrand">VISA</div>
                        </div>
                        <div class="card-number" x-text="displayCardNumber">•••• •••• •••• ••••</div>
                        <div class="card-bottom">
                            <div>
                                <div class="card-label" x-text="t('card_holder')">TITULAR</div>
                                <div class="card-val" x-text="cardHolder || t('card_holder_placeholder')">NOME NO CARTÃO</div>
                            </div>
                            <div style="text-align: right;">
                                <div class="card-label" x-text="t('expiry_date')">VALIDADE</div>
                                <div class="card-val" x-text="cardExpiry || 'MM/AA'">MM/AA</div>
                            </div>
                        </div>
                    </div>
                    <div class="card-face card-back">
                        <div class="magnetic-stripe"></div>
                        <div class="signature-strip">
                            <span x-text="cardCvv || '•••'"></span>
                        </div>
                    </div>
                </div>
            </div>

            <form class="payment-form" method="POST" action="{{ route('checkout.process', $transaction->uuid) }}" @submit="loading = true">
                @csrf
                <div class="input-group">
                    <label class="input-label" x-text="t('card_number')">Número do Cartão</label>
                    <input type="text" name="card_number" class="input-control" 
                           placeholder="0000 0000 0000 0000" 
                           x-model="cardNumber" @input="formatCardNumber" @focus="isFlipped = false" required>
                </div>

                <div class="form-row">
                    <div class="input-group">
                        <label class="input-label" x-text="t('expiry_date')">Validade</label>
                        <input type="text" name="card_expiry" class="input-control" 
                               placeholder="MM/AA" maxlength="5"
                               x-model="cardExpiry" @input="formatExpiry" @focus="isFlipped = false" required>
                    </div>
                    <div class="input-group">
                        <label class="input-label" x-text="t('cvv')">CVV</label>
                        <input type="text" name="card_cvv" class="input-control" 
                               placeholder="123" maxlength="4"
                               x-model="cardCvv" @focus="isFlipped = true" @blur="isFlipped = false" required>
                    </div>
                </div>

                <div class="input-group" style="margin-bottom: 10px;">
                    <label class="input-label" x-text="t('card_holder')">Nome no Cartão</label>
                    <input type="text" name="card_name" class="input-control" 
                           :placeholder="t('card_holder_placeholder')" 
                           x-model="cardHolder" @focus="isFlipped = false" required>
                </div>

                <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 5px;">
                    <div class="timer-box">
                        <i class="far fa-clock"></i>
                        <span x-text="formatTime()">10:00</span>
                    </div>
                    <div style="font-size: 11px; color: #94a3b8; font-weight: 600;" x-text="t('encryption_notice_short')">SSL ENCRYPTED</div>
                </div>

                <button type="submit" class="btn-submit" :disabled="loading">
                    <span x-show="!loading" x-text="t('pay_now')">Pagar Agora</span>
                    <span x-show="loading"><i class="fas fa-circle-notch fa-spin"></i> <span x-text="t('processing')">Processando...</span></span>
                </button>
            </form>

            <div class="footer-logos">
                <i class="fab fa-cc-visa fa-2x"></i>
                <i class="fab fa-cc-mastercard fa-2x"></i>
                <i class="fab fa-cc-amex fa-2x"></i>
                <i class="fab fa-cc-discover fa-2x"></i>
            </div>
        </section>
    </main>

    <script>
        function checkoutApp(i18nData, initialLocale) {
            return {
                cardNumber: '',
                cardExpiry: '',
                cardCvv: '',
                cardHolder: '',
                isFlipped: false,
                loading: false,
                showDropdown: false,
                timeLeft: 600,
                i18n: i18nData,
                locale: initialLocale || 'pt',
                ciclo: '{{ $ciclo }}',
                
                countries: [
                    { code: 'BR', flag: '🇧🇷', name: 'Brasil', lang: 'pt', currency: 'BRL', symbol: 'R$' },
                    { code: 'JP', flag: '🇯🇵', name: 'Japan', lang: 'ja', currency: 'JPY', symbol: '¥' },
                    { code: 'US', flag: '🇺🇸', name: 'USA', lang: 'en', currency: 'USD', symbol: '$' }
                ],

                get currentCountry() {
                    return this.countries.find(c => c.lang === this.locale) || this.countries[0];
                },

                get detectedBrand() {
                    if (this.cardNumber.startsWith('4')) return 'VISA';
                    if (this.cardNumber.match(/^5[1-5]/)) return 'MASTERCARD';
                    return 'CARD';
                },

                get displayCardNumber() {
                    return this.cardNumber || '•••• •••• •••• ••••';
                },

                init() {
                    setInterval(() => { if (this.timeLeft > 0) this.timeLeft--; }, 1000);
                },

                t(key) {
                    return (this.i18n[this.locale] && this.i18n[this.locale][key]) || 
                           (this.i18n['pt'] && this.i18n['pt'][key]) || key;
                },

                setCountry(country) {
                    this.locale = country.lang;
                    this.showDropdown = false;
                    document.documentElement.lang = country.lang;
                },

                formatPrice(amount) {
                    const rate = this.locale === 'ja' ? 25 : 1; // Fake demo rate
                    return new Intl.NumberFormat(this.locale === 'pt' ? 'pt-BR' : (this.locale === 'ja' ? 'ja-JP' : 'en-US'), {
                        minimumFractionDigits: this.locale === 'ja' ? 0 : 2,
                        maximumFractionDigits: this.locale === 'ja' ? 0 : 2
                    }).format(amount * rate);
                },

                formatTime() {
                    const m = Math.floor(this.timeLeft / 60);
                    const s = this.timeLeft % 60;
                    return `${m}:${s.toString().padStart(2, '0')}`;
                },

                formatCardNumber(e) {
                    let val = e.target.value.replace(/\D/g, '').substring(0, 16);
                    this.cardNumber = val.match(/.{1,4}/g)?.join(' ') || val;
                    e.target.value = this.cardNumber;
                },

                formatExpiry(e) {
                    let val = e.target.value.replace(/\D/g, '').substring(0, 4);
                    if (val.length >= 2) val = val.substring(0, 2) + '/' + val.substring(2, 4);
                    this.cardExpiry = val;
                    e.target.value = val;
                }
            }
        }
    </script>
</body>
</html>