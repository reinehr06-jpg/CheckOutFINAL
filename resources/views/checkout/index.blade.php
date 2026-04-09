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
        .back-to-site {
            position: absolute;
            left: 44px;
            top: 40px;
            z-index: 5;
            color: #fff;
            text-decoration: none;
            font-size: 14px;
            font-weight: 500;
            display: flex;
            align-items: center;
            gap: 6px;
            opacity: 0.8;
            transition: opacity 0.2s;
        }
        .back-to-site:hover { opacity: 1; }
        
        .card-wrapper {
            width: 320px;
            height: 190px;
            margin: 0 auto 24px;
            perspective: 1000px;
            position: relative;
            z-index: 2;
        }
        .credit-card-3d {
            width: 100%;
            height: 100%;
            border-radius: 16px;
            position: relative;
            transform-style: preserve-3d;
            transition: transform 0.6s cubic-bezier(0.4, 0, 0.2, 1);
            box-shadow: 0 15px 35px rgba(0,0,0,0.2);
            color: #fff;
            padding: 24px;
            display: flex;
            flex-direction: column;
            justify-content: space-between;
            background: linear-gradient(135deg, #ff5f6d 0%, #ffc371 100%);
        }
        .card-chip {
            width: 45px;
            height: 35px;
            background: linear-gradient(135deg, #f0d075 0%, #d4af37 100%);
            border-radius: 6px;
            position: relative;
        }
        .card-chip::after {
            content: '';
            position: absolute;
            top: 50%;
            left: 50%;
            transform: translate(-50%, -50%);
            width: 30px;
            height: 20px;
            border: 1px solid rgba(0,0,0,0.1);
            border-radius: 4px;
        }
        .card-brand-logo {
            position: absolute;
            top: 24px;
            right: 24px;
            height: 35px;
            width: auto;
        }
        .card-number-display {
            font-size: 20px;
            font-weight: 600;
            letter-spacing: 2px;
            margin-top: 25px;
            text-shadow: 0 2px 4px rgba(0,0,0,0.3);
        }
        .card-footer {
            display: flex;
            justify-content: space-between;
            align-items: flex-end;
        }
        .card-holder-display {
            font-size: 13px;
            text-transform: uppercase;
            letter-spacing: 1px;
            font-weight: 500;
        }
        .card-expiry-display {
            font-size: 14px;
            font-weight: 600;
        }
        .card-label-small {
            font-size: 8px;
            text-transform: uppercase;
            opacity: 0.8;
            margin-bottom: 2px;
        }
        
        .main-card {
            width: 1000px;
            height: 620px;
            border-radius: 24px;
            overflow: hidden;
            background: #fff;
            box-shadow: 0 30px 100px rgba(80,40,140,0.15);
            display: grid;
            grid-template-columns: 46% 54%;
            position: relative;
        }
        .left-panel {
            background: #7a2ff7;
            padding: 40px 44px 30px;
            display: flex;
            flex-direction: column;
            position: relative;
            overflow: hidden;
        }
        .brand-logo {
            width: 48px;
            height: 48px;
            border-radius: 10px;
            background: #fff;
            display: flex;
            align-items: center;
            justify-content: center;
            overflow: hidden;
            box-shadow: 0 4px 12px rgba(0,0,0,0.1);
        }
        .brand-logo img {
            width: 32px;
            height: 32px;
            object-fit: contain;
        }
        .brand-text {
            color: #fff;
            font-size: 26px;
            font-weight: 700;
            letter-spacing: -0.5px;
        }
        .plan-badge {
            background: rgba(255,255,255,0.15);
            padding: 8px 18px;
            font-size: 12px;
            font-weight: 700;
        }
        .left-bottom {
            padding-top: 0;
            border-top: none;
        }
        .card-brands {
            background: none;
            padding: 0;
            margin-top: 0;
            gap: 12px;
        }
        .brand-icon-img {
            height: 30px;
            border-radius: 6px;
            box-shadow: 0 2px 5px rgba(0,0,0,0.1);
        }
        .right-panel {
            background: #ffffff;
            padding: 30px 44px 20px;
        }
        .form-title {
            font-size: 22px;
            margin-bottom: 8px;
        }
        .payment-chip {
            background: #7a2ff7;
            text-transform: uppercase;
        }
        .cta-button {
            border-radius: 10px;
            background: #7a2ff7;
            box-shadow: 0 4px 15px rgba(122,47,247,0.3);
            font-size: 16px;
        }
        .cta-button:hover {
            background: #6b28d6;
            transform: translateY(-1px);
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
        .brand-icon-img { height: 26px; width: auto; }
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
            z-index: 5;
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
            max-width: 180px;
        }
        .locale-switcher select:focus { outline: none; border-color: #7b2ff7; }
        .form-title { color: #221749; font-size: 26px; font-weight: 700; margin-bottom: 14px; }
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
        .form-label { display: block; color: #43395d; font-size: 13px; font-weight: 500; margin-bottom: 6px; }
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
        .payment-method-toggle {
            display: flex;
            gap: 10px;
            margin-bottom: 20px;
        }
        .payment-method-btn {
            flex: 1;
            padding: 14px;
            border: 2px solid #e1dbe9;
            border-radius: 12px;
            background: #fff;
            color: #43395d;
            font-size: 13px;
            font-weight: 600;
            cursor: pointer;
            transition: all 0.2s;
            display: flex;
            align-items: center;
            justify-content: center;
            gap: 8px;
        }
        .payment-method-btn.active {
            border-color: #7b2ff7;
            background: rgba(123, 47, 247, 0.05);
            color: #7b2ff7;
        }
        .payment-method-btn:hover:not(.active) {
            border-color: #b99fe4;
        }
        .pix-section {
            text-align: center;
            padding: 20px;
        }
        .pix-qrcode {
            background: #fff;
            padding: 16px;
            border-radius: 16px;
            box-shadow: 0 4px 20px rgba(0,0,0,0.08);
            display: inline-block;
            margin-bottom: 20px;
        }
        .pix-qrcode img {
            width: 180px;
            height: 180px;
            display: block;
        }
        .pix-code-container {
            background: #f5f3f7;
            border: 1px dashed #c9c1d9;
            border-radius: 10px;
            padding: 14px;
            margin-bottom: 16px;
        }
        .pix-code-label {
            font-size: 11px;
            font-weight: 600;
            color: #817796;
            text-transform: uppercase;
            margin-bottom: 8px;
        }
        .pix-code-value {
            font-family: monospace;
            font-size: 11px;
            color: #221749;
            word-break: break-all;
            line-height: 1.5;
        }
        .pix-copy-btn {
            width: 100%;
            padding: 14px;
            border: none;
            border-radius: 12px;
            background: linear-gradient(90deg, #7b2ff7, #a855f7);
            color: #fff;
            font-size: 14px;
            font-weight: 700;
            cursor: pointer;
            transition: all 0.2s;
            box-shadow: 0 6px 16px rgba(123,47,247,0.25);
        }
        .pix-copy-btn:hover {
            transform: translateY(-2px);
            box-shadow: 0 10px 24px rgba(123,47,247,0.35);
        }
        .pix-copy-btn.copied {
            background: linear-gradient(90deg, #10b981, #34d399);
        }
        .pix-info {
            margin-top: 16px;
            padding: 12px;
            background: #ecfdf5;
            border-radius: 10px;
            border-left: 4px solid #10b981;
        }
        .pix-info-title {
            font-size: 12px;
            font-weight: 700;
            color: #065f46;
            margin-bottom: 4px;
        }
        .pix-info-desc {
            font-size: 11px;
            color: #047857;
        }
    </style>
</head>
<body
    x-data="{
        country: 'BR',
        billingType: '{{ $billingType ?? 'CREDIT_CARD' }}',
        pixCopied: false,
        copyPixCode() {
            navigator.clipboard.writeText('{{ $pixData['payload'] ?? '' }}');
            this.pixCopied = true;
            setTimeout(() => this.pixCopied = false, 2000);
        },
        cfg: null,
        countries: [
            {code:'BR',name:'Brasil',flag:'🇧🇷'},{code:'US',name:'United States',flag:'🇺🇸'},
            {code:'PT',name:'Portugal',flag:'🇵🇹'},{code:'ES',name:'España',flag:'🇪🇸'},
            {code:'GB',name:'United Kingdom',flag:'🇬🇧'},{code:'FR',name:'France',flag:'🇫🇷'},
            {code:'DE',name:'Deutschland',flag:'🇩🇪'},{code:'IT',name:'Italia',flag:'🇮🇹'},
            {code:'MX',name:'México',flag:'🇲🇽'},{code:'AR',name:'Argentina',flag:'🇦🇷'},
            {code:'CL',name:'Chile',flag:'🇨🇱'},{code:'CO',name:'Colombia',flag:'🇨🇴'},
            {code:'PE',name:'Perú',flag:'🇵🇪'},{code:'EC',name:'Ecuador',flag:'🇪🇨'},
            {code:'PY',name:'Paraguay',flag:'🇵🇾'},{code:'UY',name:'Uruguay',flag:'🇺🇾'},
            {code:'BO',name:'Bolivia',flag:'🇧🇴'},{code:'VE',name:'Venezuela',flag:'🇻🇪'},
            {code:'CA',name:'Canada',flag:'🇨🇦'},{code:'AU',name:'Australia',flag:'🇦🇺'},
            {code:'JP',name:'Japan',flag:'🇯🇵'},{code:'CN',name:'China',flag:'🇨🇳'},
            {code:'KR',name:'South Korea',flag:'🇰🇷'},{code:'IN',name:'India',flag:'🇮🇳'},
            {code:'ZA',name:'South Africa',flag:'🇿🇦'},{code:'NG',name:'Nigeria',flag:'🇳🇬'},
            {code:'KE',name:'Kenya',flag:'🇰🇪'},{code:'GH',name:'Ghana',flag:'🇬🇭'},
            {code:'AO',name:'Angola',flag:'🇦🇴'},{code:'MZ',name:'Moçambique',flag:'🇲🇿'},
            {code:'RW',name:'Rwanda',flag:'🇷🇼'},{code:'TZ',name:'Tanzania',flag:'🇹🇿'},
            {code:'NL',name:'Nederland',flag:'🇳🇱'},{code:'BE',name:'België',flag:'🇧🇪'},
            {code:'CH',name:'Schweiz',flag:'🇨🇭'},{code:'AT',name:'Österreich',flag:'🇦🇹'},
            {code:'SE',name:'Sverige',flag:'🇸🇪'},{code:'NO',name:'Norge',flag:'🇳🇴'},
            {code:'DK',name:'Danmark',flag:'🇩🇰'},{code:'FI',name:'Suomi',flag:'🇫🇮'},
            {code:'PL',name:'Polska',flag:'🇵🇱'},{code:'CZ',name:'Česko',flag:'🇨🇿'},
            {code:'HU',name:'Magyarország',flag:'🇭🇺'},{code:'RO',name:'România',flag:'🇷🇴'},
            {code:'GR',name:'Ελλάδα',flag:'🇬🇷'},{code:'TR',name:'Türkiye',flag:'🇹🇷'},
            {code:'RU',name:'Россия',flag:'🇷🇺'},{code:'UA',name:'Україна',flag:'🇺🇦'},
            {code:'IL',name:'ישראל',flag:'🇮🇱'},{code:'SA',name:'المملكة العربية السعودية',flag:'🇸🇦'},
            {code:'AE',name:'الإمارات',flag:'🇦🇪'},{code:'EG',name:'مصر',flag:'🇪🇬'},
            {code:'TH',name:'ประเทศไทย',flag:'🇹🇭'},{code:'VN',name:'Việt Nam',flag:'🇻🇳'},
            {code:'PH',name:'Philippines',flag:'🇵🇭'},{code:'ID',name:'Indonesia',flag:'🇮🇩'},
            {code:'MY',name:'Malaysia',flag:'🇲🇾'},{code:'SG',name:'Singapore',flag:'🇸🇬'},
            {code:'NZ',name:'New Zealand',flag:'🇳🇿'}
        ],
        localeData: {},
        init() {
            const defaults = {
                billingLabel: {pt:'COBRANÇA MENSAL',en:'MONTHLY BILLING',es:'FACTURACIÓN MENSUAL',fr:'FACTURATION MENSUELLE',de:'MONATLICHE RECHNUNG'},
                btnPrefix: {pt:'Assinar Plano por',en:'Subscribe for',es:'Suscribir por',fr:'S\'abonner pour',de:'Abonnieren für'},
                emailLabel: {pt:'Email',en:'Email',es:'Email',fr:'Email',de:'E-Mail'},
                emailHelper: {pt:'Este e-mail receberá suas credenciais de login.',en:'This email will receive your login credentials.',es:'Este correo recibirá sus credenciales.',fr:'Cet e-mail recevra vos identifiants.',de:'Diese E-Mail erhält Ihre Anmeldedaten.'},
                cardLabel: {pt:'NÚMERO DO CARTÃO',en:'CARD NUMBER',es:'NÚMERO DE TARJETA',fr:'NUMÉRO DE CARTE',de:'KARTENNUMMER'},
                expiryLabel: {pt:'EXPIRAÇÃO',en:'EXPIRY',es:'VENCIMIENTO',fr:'EXPIRATION',de:'ABLAUF'},
                cvcLabel: {pt:'CVC',en:'CVC',es:'CVC',fr:'CVC',de:'CVC'},
                nameLabel: {pt:'NOME COMPLETO (ESCRITO NO CARTÃO)',en:'FULL NAME (AS ON CARD)',es:'NOMBRE COMPLETO (COMO EN LA TARJETA)',fr:'NOM COMPLET (SUR LA CARTE)',de:'VOLLSTÄNDIGER NAME (AUF DER KARTE)'},
                payTitle: {pt:'Pagamento Seguro',en:'Secure Payment',es:'Pago Seguro',fr:'Paiement Sécurisé',de:'Sichere Zahlung'},
                viaLabel: {pt:'PAGAMENTO VIA:',en:'PAYMENT METHOD:',es:'PAGO VIA:',fr:'PAIEMENT VIA:',de:'ZAHLUNGSMETHODE:'},
                chipLabel: {pt:'CARTÃO DE CRÉDITO',en:'CREDIT CARD',es:'TARJETA DE CRÉDITO',fr:'CARTE DE CRÉDIT',de:'KREDITKARTE'},
                secureText: {pt:'Pagamento 100% Seguro',en:'100% Secure Payment',es:'Pago 100% Seguro',fr:'Paiement 100% Sécurisé',de:'100% Sichere Zahlung'},
                secureLeft: {pt:'Pagamento 100% Seguro',en:'100% Secure Payment',es:'Pago 100% Seguro',fr:'Paiement 100% Sécurisé',de:'100% Sichere Zahlung'},
                secureLeftDesc: {pt:'Seus dados são protegidos por criptografia SSL.',en:'Your data is protected with SSL encryption.',es:'Sus datos están protegidos con cifrado SSL.',fr:'Vos données sont protégées par cryptage SSL.',de:'Ihre Daten sind durch SSL-Verschlüsselung geschützt.'},
                badge: {pt:'PLANO PROFISSIONAL ATIVADO',en:'PROFESSIONAL PLAN ACTIVATED',es:'PLAN PROFESIONAL ACTIVADO',fr:'PLAN PROFESSIONNEL ACTIVÉ',de:'PROFI-PLAN AKTIVIERT'},
                planName: {pt:'Plano Mensal',en:'Monthly Plan',es:'Plan Mensual',fr:'Plan Mensuel',de:'Monatsplan'},
                docLabel: {pt:'DOCUMENTO DO PAGADOR (CPF OU CNPJ)',en:'PAYER DOCUMENT',es:'DOCUMENTO DEL PAGADOR',fr:'DOCUMENT DU PAYEUR',de:'ZAHLERDOKUMENT'}
            };
            const featureDefaults = {
                pt:[{t:'Gestão com IA Integrada',d:'Aplicação para solicitações da igreja.'},{t:'Automação de Cultos',d:'Lembretes e avisos 100% automáticos.'},{t:'Células e Eventos',d:'Controle total de presença, cursos e células.'}],
                en:[{t:'AI-Integrated Management',d:'Application for church requests.'},{t:'Service Automation',d:'Reminders and alerts 100% automatic.'},{t:'Cells & Events',d:'Full control of attendance, courses and cells.'}],
                es:[{t:'Gestión con IA Integrada',d:'Aplicación para solicitudes de la iglesia.'},{t:'Automatización de Cultos',d:'Recordatorios y avisos 100% automáticos.'},{t:'Células y Eventos',d:'Control total de asistencia, cursos y células.'}],
                fr:[{t:'Gestion avec IA Intégrée',d:'Application pour les demandes de l\'église.'},{t:'Automatisation des Cultes',d:'Rappels et alertes 100% automatiques.'},{t:'Cellules et Événements',d:'Contrôle total des présences, cours et cellules.'}],
                de:[{t:'KI-Integrierte Verwaltung',d:'Anwendung für Kirchenanfragen.'},{t:'Gottesdienst-Automatisierung',d:'Erinnerungen und Warnungen 100% automatisch.'},{t:'Zellen & Veranstaltungen',d:'Volle Kontrolle über Anwesenheit, Kurse und Zellen.'}]
            };
            const priceTable = {
                BR:{amount:197.99,currency:'BRL',symbol:'R$',lang:'pt',showDoc:true,docPlaceholder:'000.000.000-00',docMax:18},
                US:{amount:39.90,currency:'USD',symbol:'US$',lang:'en',showDoc:false,docPlaceholder:'',docMax:0},
                PT:{amount:36.90,currency:'EUR',symbol:'€',lang:'pt',showDoc:true,docPlaceholder:'NIF',docMax:12},
                ES:{amount:36.90,currency:'EUR',symbol:'€',lang:'es',showDoc:true,docPlaceholder:'DNI/NIE',docMax:12},
                GB:{amount:29.90,currency:'GBP',symbol:'£',lang:'en',showDoc:false,docPlaceholder:'',docMax:0},
                FR:{amount:36.90,currency:'EUR',symbol:'€',lang:'fr',showDoc:false,docPlaceholder:'',docMax:0},
                DE:{amount:36.90,currency:'EUR',symbol:'€',lang:'de',showDoc:false,docPlaceholder:'',docMax:0},
                IT:{amount:36.90,currency:'EUR',symbol:'€',lang:'en',showDoc:true,docPlaceholder:'Codice Fiscale',docMax:16},
                MX:{amount:499,currency:'MXN',symbol:'MX$',lang:'es',showDoc:true,docPlaceholder:'RFC',docMax:13},
                AR:{amount:24990,currency:'ARS',symbol:'ARS$',lang:'es',showDoc:true,docPlaceholder:'CUIT/CUIL',docMax:13},
                CL:{amount:24990,currency:'CLP',symbol:'$',lang:'es',showDoc:true,docPlaceholder:'RUT',docMax:12},
                CO:{amount:119900,currency:'COP',symbol:'$',lang:'es',showDoc:true,docPlaceholder:'Cédula',docMax:12},
                PE:{amount:99,currency:'PEN',symbol:'S/',lang:'es',showDoc:true,docPlaceholder:'DNI/CE',docMax:12},
                EC:{amount:29.90,currency:'USD',symbol:'$',lang:'es',showDoc:true,docPlaceholder:'Cédula',docMax:10},
                PY:{amount:199000,currency:'PYG',symbol:'₲',lang:'es',showDoc:true,docPlaceholder:'CI',docMax:10},
                UY:{amount:1290,currency:'UYU',symbol:'$',lang:'es',showDoc:true,docPlaceholder:'CI',docMax:10},
                BO:{amount:199,currency:'BOB',symbol:'Bs',lang:'es',showDoc:true,docPlaceholder:'CI',docMax:10},
                VE:{amount:14.90,currency:'USD',symbol:'$',lang:'es',showDoc:true,docPlaceholder:'Cédula',docMax:10},
                CA:{amount:49.90,currency:'CAD',symbol:'C$',lang:'en',showDoc:false,docPlaceholder:'',docMax:0},
                AU:{amount:49.90,currency:'AUD',symbol:'A$',lang:'en',showDoc:false,docPlaceholder:'',docMax:0},
                JP:{amount:4990,currency:'JPY',symbol:'¥',lang:'en',showDoc:false,docPlaceholder:'',docMax:0},
                CN:{amount:199,currency:'CNY',symbol:'¥',lang:'en',showDoc:false,docPlaceholder:'',docMax:0},
                KR:{amount:39900,currency:'KRW',symbol:'₩',lang:'en',showDoc:false,docPlaceholder:'',docMax:0},
                IN:{amount:2499,currency:'INR',symbol:'₹',lang:'en',showDoc:true,docPlaceholder:'PAN/Aadhaar',docMax:14},
                ZA:{amount:499,currency:'ZAR',symbol:'R',lang:'en',showDoc:true,docPlaceholder:'ID Number',docMax:13},
                NG:{amount:29900,currency:'NGN',symbol:'₦',lang:'en',showDoc:true,docPlaceholder:'NIN/BVN',docMax:11},
                KE:{amount:3990,currency:'KES',symbol:'KSh',lang:'en',showDoc:true,docPlaceholder:'ID Number',docMax:10},
                GH:{amount:399,currency:'GHS',symbol:'GH₵',lang:'en',showDoc:true,docPlaceholder:'Ghana Card',docMax:15},
                AO:{amount:19900,currency:'AOA',symbol:'Kz',lang:'pt',showDoc:true,docPlaceholder:'BI',docMax:14},
                MZ:{amount:1990,currency:'MZN',symbol:'MT',lang:'pt',showDoc:true,docPlaceholder:'BI',docMax:14},
                RW:{amount:34900,currency:'RWF',symbol:'FRw',lang:'en',showDoc:true,docPlaceholder:'ID Number',docMax:16},
                TZ:{amount:74900,currency:'TZS',symbol:'TSh',lang:'en',showDoc:true,docPlaceholder:'ID Number',docMax:10},
                NL:{amount:36.90,currency:'EUR',symbol:'€',lang:'en',showDoc:false,docPlaceholder:'',docMax:0},
                BE:{amount:36.90,currency:'EUR',symbol:'€',lang:'fr',showDoc:false,docPlaceholder:'',docMax:0},
                CH:{amount:34.90,currency:'CHF',symbol:'CHF',lang:'de',showDoc:false,docPlaceholder:'',docMax:0},
                AT:{amount:36.90,currency:'EUR',symbol:'€',lang:'de',showDoc:false,docPlaceholder:'',docMax:0},
                SE:{amount:349,currency:'SEK',symbol:'kr',lang:'en',showDoc:false,docPlaceholder:'',docMax:0},
                NO:{amount:349,currency:'NOK',symbol:'kr',lang:'en',showDoc:false,docPlaceholder:'',docMax:0},
                DK:{amount:249,currency:'DKK',symbol:'kr',lang:'en',showDoc:false,docPlaceholder:'',docMax:0},
                FI:{amount:36.90,currency:'EUR',symbol:'€',lang:'en',showDoc:false,docPlaceholder:'',docMax:0},
                PL:{amount:149.90,currency:'PLN',symbol:'zł',lang:'en',showDoc:true,docPlaceholder:'PESEL',docMax:11},
                CZ:{amount:799,currency:'CZK',symbol:'Kč',lang:'en',showDoc:false,docPlaceholder:'',docMax:0},
                HU:{amount:12990,currency:'HUF',symbol:'Ft',lang:'en',showDoc:false,docPlaceholder:'',docMax:0},
                RO:{amount:169.90,currency:'RON',symbol:'lei',lang:'en',showDoc:true,docPlaceholder:'CNP',docMax:13},
                GR:{amount:36.90,currency:'EUR',symbol:'€',lang:'en',showDoc:true,docPlaceholder:'AFM',docMax:10},
                TR:{amount:1299,currency:'TRY',symbol:'₺',lang:'en',showDoc:true,docPlaceholder:'TC Kimlik',docMax:11},
                RU:{amount:2990,currency:'RUB',symbol:'₽',lang:'en',showDoc:false,docPlaceholder:'',docMax:0},
                UA:{amount:1199,currency:'UAH',symbol:'₴',lang:'en',showDoc:false,docPlaceholder:'',docMax:0},
                IL:{amount:149.90,currency:'ILS',symbol:'₪',lang:'en',showDoc:true,docPlaceholder:'ID Number',docMax:9},
                SA:{amount:149.90,currency:'SAR',symbol:'ر.س',lang:'en',showDoc:false,docPlaceholder:'',docMax:0},
                AE:{amount:149.90,currency:'AED',symbol:'د.إ',lang:'en',showDoc:false,docPlaceholder:'',docMax:0},
                EG:{amount:1499,currency:'EGP',symbol:'ج.م',lang:'en',showDoc:true,docPlaceholder:'National ID',docMax:14},
                TH:{amount:1290,currency:'THB',symbol:'฿',lang:'en',showDoc:false,docPlaceholder:'',docMax:0},
                VN:{amount:799000,currency:'VND',symbol:'₫',lang:'en',showDoc:false,docPlaceholder:'',docMax:0},
                PH:{amount:1990,currency:'PHP',symbol:'₱',lang:'en',showDoc:false,docPlaceholder:'',docMax:0},
                ID:{amount:449000,currency:'IDR',symbol:'Rp',lang:'en',showDoc:false,docPlaceholder:'',docMax:0},
                MY:{amount:149.90,currency:'MYR',symbol:'RM',lang:'en',showDoc:false,docPlaceholder:'',docMax:0},
                SG:{amount:49.90,currency:'SGD',symbol:'S$',lang:'en',showDoc:false,docPlaceholder:'',docMax:0},
                NZ:{amount:59.90,currency:'NZD',symbol:'NZ$',lang:'en',showDoc:false,docPlaceholder:'',docMax:0}
            };
            this.localeData = {defaults,featureDefaults,priceTable};
            this.detectBrowserLanguage();
            this.buildConfig();
            document.documentElement.lang = this.cfg.locale;
        },
        switchCountry(code) {
            this.country = code;
            this.buildConfig();
            document.documentElement.lang = this.cfg.locale;
        },
        detectBrowserLanguage() {
            try {
                const lang = navigator.language || navigator.userLanguage || 'pt-BR';
                const langCode = lang.split('-')[0].toLowerCase();
                const countryCode = (lang.split('-')[1] || '').toUpperCase();
                const langToCountry = {
                    pt: ['BR','PT','AO','MZ'],
                    en: ['US','GB','CA','AU','NZ','SG','PH'],
                    es: ['ES','MX','AR','CL','CO','PE','EC','PY','UY','BO','VE'],
                    fr: ['FR','BE'],
                    de: ['DE','AT','CH'],
                    it: ['IT'],
                    ja: ['JP'],
                    ko: ['KR'],
                    zh: ['CN'],
                    nl: ['NL'],
                    sv: ['SE'],
                    nb: ['NO'],
                    da: ['DK'],
                    fi: ['FI'],
                    pl: ['PL'],
                    cs: ['CZ'],
                    hu: ['HU'],
                    ro: ['RO'],
                    el: ['GR'],
                    tr: ['TR'],
                    ru: ['RU'],
                    uk: ['UA'],
                    he: ['IL'],
                    ar: ['SA','AE','EG'],
                    th: ['TH'],
                    vi: ['VN'],
                    id: ['ID'],
                    hi: ['IN'],
                    sw: ['KE','TZ','RW'],
                };
                if (countryCode && this.countries.find(c => c.code === countryCode)) {
                    this.country = countryCode;
                } else if (langToCountry[langCode] && langToCountry[langCode][0]) {
                    this.country = langToCountry[langCode][0];
                }
            } catch(e) {
                this.country = 'BR';
            }
        },
        buildConfig() {
            const p = this.localeData.priceTable[this.country] || this.localeData.priceTable.BR;
            const lang = p.lang || 'pt';
            const d = this.localeData.defaults;
            const f = this.localeData.featureDefaults[lang] || this.localeData.featureDefaults.pt;
            this.cfg = {
                locale: this.getLocale(this.country, lang),
                currency: p.currency,
                symbol: p.symbol,
                amount: p.amount,
                billingLabel: d.billingLabel[lang] || d.billingLabel.pt,
                btnPrefix: d.btnPrefix[lang] || d.btnPrefix.pt,
                emailLabel: d.emailLabel[lang] || d.emailLabel.pt,
                emailHelper: d.emailHelper[lang] || d.emailHelper.pt,
                cardLabel: d.cardLabel[lang] || d.cardLabel.pt,
                expiryLabel: d.expiryLabel[lang] || d.expiryLabel.pt,
                cvcLabel: d.cvcLabel[lang] || d.cvcLabel.pt,
                nameLabel: d.nameLabel[lang] || d.nameLabel.pt,
                payTitle: d.payTitle[lang] || d.payTitle.pt,
                viaLabel: d.viaLabel[lang] || d.viaLabel.pt,
                chipLabel: d.chipLabel[lang] || d.chipLabel.pt,
                secureText: d.secureText[lang] || d.secureText.pt,
                secureLeft: d.secureLeft[lang] || d.secureLeft.pt,
                secureLeftDesc: d.secureLeftDesc[lang] || d.secureLeftDesc.pt,
                badge: d.badge[lang] || d.badge.pt,
                planName: d.planName[lang] || d.planName.pt,
                docLabel: d.docLabel[lang] || d.docLabel.pt,
                showDoc: p.showDoc,
                docPlaceholder: p.docPlaceholder,
                docMax: p.docMax,
                features: f
            };
        },
        getLocale(code, lang) {
            const map = {BR:'pt-BR',US:'en-US',PT:'pt-PT',ES:'es-ES',GB:'en-GB',FR:'fr-FR',DE:'de-DE',IT:'it-IT',MX:'es-MX',AR:'es-AR',CL:'es-CL',CO:'es-CO',PE:'es-PE',EC:'es-EC',PY:'es-PY',UY:'es-UY',BO:'es-BO',VE:'es-VE',CA:'en-CA',AU:'en-AU',JP:'ja-JP',CN:'zh-CN',KR:'ko-KR',IN:'en-IN',ZA:'en-ZA',NG:'en-NG',KE:'en-KE',GH:'en-GH',AO:'pt-AO',MZ:'pt-MZ',RW:'en-RW',TZ:'en-TZ',NL:'nl-NL',BE:'fr-BE',CH:'de-CH',AT:'de-AT',SE:'sv-SE',NO:'nb-NO',DK:'da-DK',FI:'fi-FI',PL:'pl-PL',CZ:'cs-CZ',HU:'hu-HU',RO:'ro-RO',GR:'el-GR',TR:'tr-TR',RU:'ru-RU',UA:'uk-UA',IL:'he-IL',SA:'ar-SA',AE:'ar-AE',EG:'ar-EG',TH:'th-TH',VN:'vi-VN',PH:'en-PH',ID:'id-ID',MY:'en-MY',SG:'en-SG',NZ:'en-NZ'};
            return map[code] || 'en-US';
        },
        fmt() {
            try { return new Intl.NumberFormat(this.cfg.locale, {style:'currency',currency:this.cfg.currency}).format(this.cfg.amount); }
            catch(e) { return this.cfg.symbol + ' ' + this.cfg.amount.toFixed(2); }
        },
        fmtDec() {
            try {
                return this.cfg.amount.toLocaleString(this.cfg.locale, {minimumFractionDigits:2, maximumFractionDigits:2});
            } catch(e) { return this.cfg.amount.toFixed(2).replace('.',','); }
        }
    }"
>
    <section class="main-card"
        x-data="{
            cardNumber: '',
            cardHolder: '',
            cardExpiry: '',
            cardBrand: 'default',
            getCardGradient() {
                const colors = {
                    visa: 'linear-gradient(135deg, #1A1F71 0%, #2A3F91 100%)',
                    mastercard: 'linear-gradient(135deg, #eb001b 0%, #f79e1b 100%)',
                    amex: 'linear-gradient(135deg, #0070d1 0%, #00a0f0 100%)',
                    elo: 'linear-gradient(135deg, #0047BB 0%, #FFCB05 100%)',
                    default: 'linear-gradient(135deg, #ff5f6d 0%, #ffc371 100%)'
                };
                return colors[this.cardBrand] || colors.default;
            },
            detectBrand(num) {
                num = num.replace(/\D/g, '');
                if (num.startsWith('4')) return 'visa';
                if (num.match(/^5[1-5]/)) return 'mastercard';
                if (num.match(/^3[47]/)) return 'amex';
                if (num.match(/^(4011|4312|4389|4514|4573|4576|5041|5066|5067|5090|6277|6362|6363|6504|6505|6507|6509|6516|6550)/)) return 'elo';
                return 'default';
            },
            formatCardNumber(val) {
                let v = val.replace(/\s+/g, '').replace(/[^0-9]/gi, '');
                let matches = v.match(/\d{4,16}/g);
                let match = matches && matches[0] || '';
                let parts = [];
                for (let i=0, len=match.length; i<len; i+=4) {
                    parts.push(match.substring(i, i+4));
                }
                if (parts.length) return parts.join(' ');
                return v;
            }
        }"
    >
        <!-- LEFT -->
        <div class="left-panel">
            <div class="brand">
                <div class="brand-logo">
                    <span style="color:#7c2ef0;font-size:26px;font-weight:900">B</span>
                </div>
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
                <div class="left-security-desc" x-text="cfg.secureLeftDesc" style="margin-bottom: 12px;"></div>
                <div class="card-brands">
                    <svg class="brand-icon-img" viewBox="0 0 80 30"><rect width="80" height="30" rx="4" fill="#fff"/><text x="40" y="21" font-size="16" font-weight="bold" fill="#1A1F71" text-anchor="middle" font-family="Inter,sans-serif">VISA</text></svg>
                    <svg class="brand-icon-img" viewBox="0 0 80 30"><rect width="80" height="30" rx="4" fill="#fff"/><circle cx="30" cy="15" r="10" fill="#EB001B"/><circle cx="50" cy="15" r="10" fill="#F79E1B"/><path d="M40 7.5a10 10 0 0 1 0 15 10 10 0 0 1 0-15z" fill="#FF5F00"/></svg>
                    <svg class="brand-icon-img" viewBox="0 0 80 30"><rect width="80" height="30" rx="4" fill="#006FCF"/><text x="40" y="19" font-size="11" fill="#fff" text-anchor="middle" font-weight="bold" font-family="Inter,sans-serif">AMEX</text></svg>
                    <svg class="brand-icon-img" viewBox="0 0 60 30"><rect width="60" height="30" rx="4" fill="#FFCB05"/><text x="30" y="20" font-size="14" fill="#0047BB" text-anchor="middle" font-weight="bold" font-family="Inter,sans-serif">ELO</text></svg>
                </div>
            </div>
        </div>

        <!-- RIGHT -->
        <div class="right-panel">
            <div class="locale-switcher">
                <select @change="switchCountry($event.target.value)" x-model="country">
                    <template x-for="c in countries" :key="c.code">
                        <option :value="c.code" x-text="c.flag + ' ' + c.name"></option>
                    </template>
                </select>
            </div>
            <h2 class="form-title" x-text="cfg.payTitle"></h2>
            
            <!-- Payment Method Toggle -->
            <div class="payment-method-toggle">
                <button type="button" class="payment-method-btn" :class="{ 'active': billingType === 'CREDIT_CARD' }" @click="billingType = 'CREDIT_CARD'">
                    <i class="fas fa-credit-card"></i> Cartão
                </button>
                <button type="button" class="payment-method-btn" :class="{ 'active': billingType === 'PIX' }" @click="billingType = 'PIX'">
                    <i class="fas fa-qrcode"></i> PIX
                </button>
            </div>

            <!-- PIX Section (shown when billingType is PIX) -->
            <template x-if="billingType === 'PIX'">
                <div class="pix-section">
                    <div class="pix-qrcode">
                        @if(!empty($pixData['encodedImage']))
                            <img src="data:image/png;base64,{{ $pixData['encodedImage'] }}" alt="QR Code PIX">
                        @else
                            <div style="width:180px;height:180px;display:flex;align-items:center;justify-content:center;background:#f5f3f7;color:#817796;">
                                QR Code não disponível
                            </div>
                        @endif
                    </div>
                    
                    <div class="pix-code-container">
                        <div class="pix-code-label">Código PIX Copia e Cola</div>
                        <div class="pix-code-value">{{ $pixData['payload'] ?? 'Aguardando geração...' }}</div>
                    </div>
                    
                    <button type="button" class="pix-copy-btn" :class="{ 'copied': pixCopied }" @click="copyPixCode()">
                        <span x-show="!pixCopied"><i class="fas fa-copy"></i> Copiar Código PIX</span>
                        <span x-show="pixCopied"><i class="fas fa-check"></i> Copiado!</span>
                    </button>
                    
                    <div class="pix-info">
                        <div class="pix-info-title"><i class="fas fa-check-circle"></i> Pagamento Instantâneo</div>
                        <div class="pix-info-desc">O pagamento será confirmado em segundos após a transferência.</div>
                    </div>
                </div>
            </template>

            <!-- Credit Card Section (shown when billingType is CREDIT_CARD) -->
            <template x-if="billingType === 'CREDIT_CARD'">
                <div>
                    <div class="payment-via" style="margin-bottom: 8px;">
                        <span class="payment-label" x-text="cfg.viaLabel"></span>
                        <span class="payment-chip" x-text="cfg.chipLabel"></span>
                    </div>

                    <div class="card-wrapper">
                <div class="credit-card-3d" :style="{ background: getCardGradient() }">
                    <div class="card-chip"></div>
                    <div class="card-brand-logo">
                        <template x-if="cardBrand === 'visa'">
                            <svg viewBox="0 0 80 30" style="height:35px;"><text x="40" y="25" font-size="24" font-weight="bold" fill="#fff" text-anchor="middle" font-family="Inter,sans-serif">VISA</text></svg>
                        </template>
                        <template x-if="cardBrand === 'mastercard'">
                            <svg viewBox="0 0 80 30" style="height:35px;"><circle cx="30" cy="15" r="10" fill="#EB001B"/><circle cx="50" cy="15" r="10" fill="#F79E1B"/><path d="M40 7.5a10 10 0 0 1 0 15 10 10 0 0 1 0-15z" fill="#FF5F00"/></svg>
                        </template>
                        <template x-if="cardBrand === 'amex'">
                            <svg viewBox="0 0 80 30" style="height:35px;"><text x="40" y="25" font-size="20" fill="#fff" text-anchor="middle" font-weight="bold" font-family="Inter,sans-serif">AMEX</text></svg>
                        </template>
                        <template x-if="cardBrand === 'elo'">
                            <text x="30" y="20" font-size="14" fill="#fff" text-anchor="middle" font-weight="bold" font-family="Inter,sans-serif">ELO</text>
                        </template>
                    </div>
                    <div class="card-number-display" x-text="cardNumber || '•••• •••• •••• ••••'"></div>
                    <div class="card-footer">
                        <div>
                            <div class="card-label-small">CARD HOLDER</div>
                            <div class="card-holder-display" x-text="cardHolder || 'NOME NO CARTÃO'"></div>
                        </div>
                        <div>
                            <div class="card-label-small">EXPIRES</div>
                            <div class="card-expiry-display" x-text="cardExpiry || 'MM/AA'"></div>
                        </div>
                    </div>
                </div>
            </div>

            <form method="POST" action="{{ route('checkout.process', $transaction->uuid) }}">
                @csrf
                <input type="hidden" name="payment_method" value="credit_card">
                <div class="form-group">
                    <label class="form-label" x-text="cfg.emailLabel"></label>
                    <input type="email" name="email" class="form-input" placeholder="@gmail.com" required>
                    <div class="form-helper" x-text="cfg.emailHelper"></div>
                </div>
                <div class="form-group">
                    <label class="form-label" x-text="cfg.cardLabel"></label>
                    <input type="text" name="card_number" class="form-input" maxlength="19" placeholder="0000 0000 0000 0000" required
                        x-model="cardNumber"
                        @input="cardNumber = formatCardNumber($event.target.value); cardBrand = detectBrand(cardNumber)"
                    >
                </div>
                <div class="form-row">
                    <div>
                        <label class="form-label" x-text="cfg.expiryLabel"></label>
                        <input type="text" name="card_expiry" class="form-input" maxlength="5" placeholder="MM/AA" required
                            x-model="cardExpiry"
                        >
                    </div>
                    <div>
                        <label class="form-label" x-text="cfg.cvcLabel"></label>
                        <input type="text" name="card_cvv" class="form-input" maxlength="4" placeholder="123" required>
                    </div>
                </div>
                <div class="form-group" style="margin-top:6px;">
                    <label class="form-label" x-text="cfg.nameLabel"></label>
                    <input type="text" name="card_holder_name" class="form-input" placeholder="Nome no cartão" required style="text-transform:uppercase;"
                        x-model="cardHolder"
                    >
                </div>
                <div class="form-group" x-show="cfg.showDoc">
                    <label class="form-label" x-text="cfg.docLabel"></label>
                    <input type="text" name="cpf_cnpj" class="form-input" :maxlength="cfg.docMax" :placeholder="cfg.docPlaceholder" required>
                </div>
                <button type="submit" class="cta-button">
                    <span x-text="cfg.btnPrefix + ' ' + fmt()"></span>
                </button>
            </form>
                </div>
            </template>
            
            <div class="security-footer">
                <svg width="15" height="15" fill="none" stroke="#3ca95c" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"/></svg>
                <span x-text="cfg.secureText"></span>
            </div>
            <div class="security-footer" style="margin-top: 5px; color: #3ca95c; font-size: 11px;">
                Pagamento 100% Seguro
            </div>
        </div>
        <div class="footer-note">Basileia Operations</div>
    </section>
</body>
</html>
