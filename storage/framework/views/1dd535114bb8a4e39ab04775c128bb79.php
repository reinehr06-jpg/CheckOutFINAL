<!DOCTYPE html>
<html lang="pt-BR">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <meta name="csrf-token" content="<?php echo e(csrf_token()); ?>">
    <title><?php echo e($transaction->description ?? 'Pagamento'); ?> - Basileia</title>
    <script defer src="https://cdn.jsdelivr.net/npm/alpinejs@3.x.x/dist/cdn.min.js"></script>
    <link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;800;900&display=swap" rel="stylesheet">
    <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.4.0/css/all.min.css">
    <style>
        * { margin: 0; padding: 0; box-sizing: border-box; }
        :root {
            --primary: #7c3aed;
            --primary-dark: #5b21b6;
            --primary-light: #a78bfa;
            --bg-dark: #0f172a;
            --text-dark: #1e293b;
            --text-muted: #64748b;
            --border: #e2e8f0;
        }
        body {
            font-family: 'Inter', sans-serif;
            min-height: 100vh;
            display: flex;
            align-items: center;
            justify-content: center;
            padding: 20px;
            background: linear-gradient(135deg, #0f0a1e 0%, #1a103c 50%, #2d1b69 100%);
        }
        .checkout-container {
            display: grid;
            grid-template-columns: 280px 380px;
            gap: 20px;
            max-width: 700px;
            width: 100%;
        }
        .value-card {
            background: linear-gradient(135deg, #2e1065 0%, #4c1d95 50%, #7c3aed 100%);
            border-radius: 20px;
            padding: 30px 24px;
            color: white;
            display: flex;
            flex-direction: column;
            align-items: center;
            justify-content: center;
            text-align: center;
            position: relative;
            overflow: hidden;
            min-height: 320px;
        }
        .value-card::before {
            content: '';
            position: absolute;
            top: -30%;
            right: -30%;
            width: 150%;
            height: 150%;
            background: radial-gradient(circle, rgba(255,255,255,0.1) 0%, transparent 50%);
            pointer-events: none;
        }
        .value-card-logo {
            width: 80px;
            height: 80px;
            background: white;
            border-radius: 16px;
            display: flex;
            align-items: center;
            justify-content: center;
            margin-bottom: 24px;
            box-shadow: 0 8px 24px rgba(0,0,0,0.2);
            overflow: hidden;
        }
        .value-card-logo img { width: 100%; height: 100%; object-fit: contain; }
        .value-card-plan { font-size: 14px; font-weight: 600; text-transform: uppercase; letter-spacing: 1px; opacity: 0.9; margin-bottom: 8px; }
        .value-card-amount { font-size: 36px; font-weight: 800; margin-bottom: 4px; }
        .value-card-period { font-size: 13px; opacity: 0.8; }
        .value-card-features { margin-top: 24px; display: grid; gap: 8px; }
        .value-card-feature { display: flex; align-items: center; gap: 8px; font-size: 12px; opacity: 0.9; }
        
        .payment-card {
            background: linear-gradient(145deg, #f8fafc 0%, #e2e8f0 100%);
            border-radius: 20px;
            padding: 24px;
            position: relative;
            display: flex;
            flex-direction: column;
            justify-content: space-between;
            min-height: 320px;
        }
        .locale-row { display: flex; justify-content: flex-end; margin-bottom: 16px; }
        .locale-switcher { position: relative; }
        .locale-switcher select {
            appearance: none;
            background: white;
            border: 1px solid var(--border);
            border-radius: 10px;
            padding: 10px 36px 10px 14px;
            font-size: 13px;
            cursor: pointer;
            color: var(--text-dark);
            font-weight: 500;
            min-width: 160px;
            background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='12' height='12' viewBox='0 0 12 12'%3E%3Cpath fill='%2364748b' d='M6 8L2 4h8z'/%3E%3C/svg%3E");
            background-repeat: no-repeat;
            background-position: right 12px center;
            box-shadow: 0 2px 8px rgba(0,0,0,0.08);
            transition: all 0.2s;
        }
        .locale-switcher select:hover { border-color: var(--primary-light); }
        .locale-switcher select:focus { outline: none; border-color: var(--primary); box-shadow: 0 0 0 3px rgba(124, 58, 237, 0.1); }
        
        .pix-qrcode {
            background: white;
            padding: 20px;
            border-radius: 12px;
            box-shadow: 0 4px 16px rgba(0,0,0,0.1);
            text-align: center;
            margin-bottom: 20px;
            display: flex;
            align-items: center;
            justify-content: center;
            min-height: 180px;
        }
        .pix-qrcode img { width: 140px; height: 140px; display: block; margin: 0 auto; }
        .pix-icon {
            font-size: 70px;
            color: var(--primary);
        }
        
        .pix-copy-btn {
            width: 100%;
            padding: 14px;
            border: none;
            border-radius: 10px;
            background: var(--primary);
            color: white;
            font-size: 15px;
            font-weight: 700;
            cursor: pointer;
            transition: all 0.2s;
            display: flex;
            align-items: center;
            justify-content: center;
            gap: 10px;
        }
        .pix-copy-btn:hover { background: var(--primary-dark); transform: translateY(-1px); }
        .pix-copy-btn.copied { background: #10b981; }
        
        .pix-info {
            margin-top: 16px;
            padding: 12px;
            background: linear-gradient(135deg, #ecfdf5 0%, #d1fae5 100%);
            border-radius: 10px;
            text-align: center;
            color: #065f46;
            font-size: 13px;
            font-weight: 500;
        }
        
        .security-footer { display: flex; align-items: center; justify-content: center; gap: 6px; font-size: 11px; color: var(--text-muted); margin-top: 20px; }
        
        @media (max-width: 720px) {
            .checkout-container { grid-template-columns: 1fr; max-width: 400px; }
            .value-card { min-height: 200px; }
        }
    </style>
</head>
<body
    x-data="{
        country: 'BR',
        locale: 'pt-BR',
        currency: 'BRL',
        currencySymbol: 'R$',
        planLabel: 'PLANO PREMIUM',
        periodLabel: 'por mês',
        payBtnLabel: 'Pagar',
        features: ['Acesso completo', 'Suporte 24h', 'Cancelamento fácil'],
        pixCopied: false,
        localeData: {},
        copyPixCode() {
            navigator.clipboard.writeText('<?php echo e($pixData['payload'] ?? ''); ?>');
            this.pixCopied = true;
            setTimeout(() => this.pixCopied = false, 2500);
        },
        changeCountry() {
            const data = this.localeData[this.country] || this.localeData.default;
            this.locale = data.locale;
            this.currency = data.currency;
            this.currencySymbol = data.symbol;
            this.planLabel = data.planLabel;
            this.periodLabel = data.periodLabel;
            this.payBtnLabel = data.payBtn;
            this.features = data.features;
        },
        formatPrice(amount) {
            try {
                return new Intl.NumberFormat(this.locale, {style: 'currency', currency: this.currency}).format(amount);
            } catch(e) {
                return this.currencySymbol + ' ' + amount.toFixed(2);
            }
        },
        init() {
            this.localeData = {
                BR: {locale: 'pt-BR', currency: 'BRL', symbol: 'R$', lang: 'pt', planLabel: 'PLANO PREMIUM', periodLabel: 'por mês', features: ['Acesso completo', 'Suporte 24h', 'Cancelamento fácil'], payBtn: 'Copiar Código'},
                US: {locale: 'en-US', currency: 'USD', symbol: '$', lang: 'en', planLabel: 'PREMIUM PLAN', periodLabel: 'per month', features: ['Full access', '24h Support', 'Easy cancellation'], payBtn: 'Copy Code'},
                PT: {locale: 'pt-PT', currency: 'EUR', symbol: '€', lang: 'pt', planLabel: 'PLANO PREMIUM', periodLabel: 'por mês', features: ['Acesso completo', 'Suporte 24h', 'Cancelamento fácil'], payBtn: 'Copiar Código'},
                ES: {locale: 'es-ES', currency: 'EUR', symbol: '€', lang: 'es', planLabel: 'PLAN PREMIUM', periodLabel: 'por mes', features: ['Acceso completo', 'Soporte 24h', 'Cancelación fácil'], payBtn: 'Copiar Código'},
                FR: {locale: 'fr-FR', currency: 'EUR', symbol: '€', lang: 'fr', planLabel: 'PLAN PREMIUM', periodLabel: 'par mois', features: ['Accès complet', 'Support 24h', 'Annulation facile'], payBtn: 'Copier le code'},
                default: {locale: 'en-US', currency: 'USD', symbol: '$', lang: 'en', planLabel: 'PREMIUM PLAN', periodLabel: 'per month', features: ['Full access', '24h Support', 'Easy cancellation'], payBtn: 'Copy Code'}
            };
            this.changeCountry();
        },
        countries: [
            {code:'BR',name:'Brasil',flag:'🇧🇷'},{code:'US',name:'Estados Unidos',flag:'🇺🇸'},{code:'PT',name:'Portugal',flag:'🇵🇹'},{code:'ES',name:'Espanha',flag:'🇪🇸'},{code:'FR',name:'França',flag:'🇫🇷'},{code:'DE',name:'Alemanha',flag:'🇩🇪'},{code:'IT',name:'Itália',flag:'🇮🇹'},{code:'GB',name:'Reino Unido',flag:'🇬🇧'},{code:'CA',name:'Canadá',flag:'🇨🇦'},{code:'MX',name:'México',flag:'🇲🇽'},{code:'AR',name:'Argentina',flag:'🇦🇷'},{code:'CO',name:'Colômbia',flag:'🇨🇴'},{code:'CL',name:'Chile',flag:'🇨🇱'},{code:'PE',name:'Peru',flag:'🇵🇪'},{code:'VE',name:'Venezuela',flag:'🇻🇪'},{code:'UY',name:'Uruguai',flag:'🇺🇾'},{code:'PY',name:'Paraguai',flag:'🇵🇾'},{code:'BO',name:'Bolívia',flag:'🇧🇴'},{code:'EC',name:'Equador',flag:'🇪🇨'},{code:'AU',name:'Austrália',flag:'🇦🇺'},{code:'NZ',name:'Nova Zelândia',flag:'🇳🇿'},{code:'JP',name:'Japão',flag:'🇯🇵'},{code:'CN',name:'China',flag:'🇨🇳'},{code:'KR',name:'Coreia do Sul',flag:'🇰🇷'},{code:'IN',name:'Índia',flag:'🇮🇳'},{code:'RU',name:'Rússia',flag:'🇷🇺'},{code:'ZA',name:'África do Sul',flag:'🇿🇦'},{code:'NG',name:'Nigéria',flag:'🇳🇬'},{code:'EG',name:'Egito',flag:'🇪🇬'},{code:'SA',name:'Arábia Saudita',flag:'🇸🇦'},{code:'AE',name:'Emirados Árabes',flag:'🇦🇪'},{code:'IL',name:'Israel',flag:'🇮🇱'},{code:'TR',name:'Turquia',flag:'🇹🇷'},{code:'PL',name:'Polônia',flag:'🇵🇱'},{code:'NL',name:'Holanda',flag:'🇳🇱'},{code:'BE',name:'Bélgica',flag:'🇧🇪'},{code:'CH',name:'Suíça',flag:'🇨🇭'},{code:'AT',name:'Áustria',flag:'🇦🇹'},{code:'SE',name:'Suécia',flag:'🇸🇪'},{code:'NO',name:'Noruega',flag:'🇳🇴'},{code:'DK',name:'Dinamarca',flag:'🇩🇰'},{code:'FI',name:'Finlândia',flag:'🇫🇮'},{code:'IE',name:'Irlanda',flag:'🇮🇪'},{code:'GR',name:'Grécia',flag:'🇬🇷'},{code:'CZ',name:'República Tcheca',flag:'🇨🇿'},{code:'HU',name:'Hungria',flag:'🇭🇺'},{code:'RO',name:'Romênia',flag:'🇷🇴'},{code:'TH',name:'Tailândia',flag:'🇹🇭'},{code:'VN',name:'Vietnã',flag:'🇻🇳'},{code:'ID',name:'Indonésia',flag:'🇮🇩'},{code:'MY',name:'Malásia',flag:'🇲🇾'},{code:'SG',name:'Singapura',flag:'🇸🇬'},{code:'PH',name:'Filipinas',flag:'🇵🇭'},{code:'TW',name:'Taiwan',flag:'🇹🇼'},{code:'HK',name:'Hong Kong',flag:'🇭🇰'},{code:'MA',name:'Marrocos',flag:'🇲🇦'},{code:'DZ',name:'Argélia',flag:'🇩🇿'},{code:'TN',name:'Tunísia',flag:'🇹🇳'},{code:'GH',name:'Gana',flag:'🇬🇭'},{code:'KE',name:'Quênia',flag:'🇰🇪'},{code:'TZ',name:'Tanzânia',flag:'🇹🇿'},{code:'AO',name:'Angola',flag:'🇦🇴'},{code:'MZ',name:'Moçambique',flag:'🇲🇿'},{code:'RW',name:'Ruanda',flag:'🇷🇼'},{code:'UG',name:'Uganda',flag:'🇺🇬'},{code:'ET',name:'Etiópia',flag:'🇪🇹'},{code:'CM',name:'Camarões',flag:'🇨🇲'},{code:'SN',name:'Senegal',flag:'🇸🇳'},{code:'CI',name:'Costa do Marfim',flag:'🇨🇮'},{code:'PA',name:'Panamá',flag:'🇵🇦'},{code:'CR',name:'Costa Rica',flag:'🇨🇷'},{code:'GT',name:'Guatemala',flag:'🇬🇹'},{code:'HN',name:'Honduras',flag:'🇭🇳'},{code:'SV',name:'El Salvador',flag:'🇸🇻'},{code:'NI',name:'Nicarágua',flag:'🇳🇮'},{code:'DO',name:'República Dominicana',flag:'🇩🇴'},{code:'JM',name:'Jamaica',flag:'🇯🇲'},{code:'TT',name:'Trinidad e Tobago',flag:'🇹🇹'},{code:'BB',name:'Barbados',flag:'🇧🇧'},{code:'BS',name:'Bahamas',flag:'🇧🇸'},{code:'BZ',name:'Belize',flag:'🇧🇿'},{code:'SR',name:'Suriname',flag:'🇸🇷'},{code:'GY',name:'Guiana',flag:'🇬🇾'}
        ]
    }"
>
    <div class="checkout-container">
        <div class="value-card">
            <div class="value-card-logo">
                <img src="https://basileia.global/wp-content/uploads/2024/01/Basileia-1.png" alt="Basileia" onerror="this.style.display='none'">
            </div>
            <div class="value-card-plan" x-text="planLabel"></div>
            <div class="value-card-amount" x-text="formatPrice(<?php echo e($transaction->amount); ?>)"></div>
            <div class="value-card-period" x-text="periodLabel"></div>
            <div class="value-card-features">
                <template x-for="feature in features" :key="feature">
                    <div class="value-card-feature">
                        <i class="fas fa-check"></i> <span x-text="feature"></span>
                    </div>
                </template>
            </div>
        </div>
        
        <div class="payment-card">
            <div class="locale-row">
                <div class="locale-switcher">
                    <select x-model="country" @change="changeCountry()">
                        <template x-for="c in countries" :key="c.code">
                            <option :value="c.code" x-text="c.flag + ' ' + c.name"></option>
                        </template>
                    </select>
                </div>
            </div>
            
            <div class="pix-qrcode">
                <i class="fas fa-qrcode pix-icon"></i>
            </div>
            
            <button type="button" class="pix-copy-btn" :class="{ 'copied': pixCopied }" @click="copyPixCode()">
                <template x-if="!pixCopied">
                    <span><i class="fas fa-copy"></i> <span x-text="payBtnLabel + ' ' + formatPrice(<?php echo e($transaction->amount); ?>)"></span></span>
                </template>
                <template x-if="pixCopied">
                    <span><i class="fas fa-check"></i> <span x-text="locale === 'pt-BR' ? 'Copiado!' : 'Copied!'"></span></span>
                </template>
            </button>
            
            <div class="pix-info">
                <i class="fas fa-bolt"></i> <span x-text="locale === 'pt-BR' ? 'Pagamento instantâneo' : 'Instant payment'"></span>
            </div>
            
            <div class="security-footer">
                <svg width="12" height="12" fill="currentColor" viewBox="0 0 24 24"><path d="M12 1L3 5v6c0 5.55 3.84 10.74 9 12 5.16-1.26 9-6.45 9-12V5l-9-4z"/></svg>
                Pagamento 100% Seguro
            </div>
        </div>
    </div>
</body>
</html>
<?php /**PATH /Users/viniciusreinehr/CheckOutFINAL/resources/views/checkout/index-pix.blade.php ENDPATH**/ ?>