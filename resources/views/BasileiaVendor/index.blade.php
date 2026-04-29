{{--
╔══════════════════════════════════════════════════════════════════╗
║  ⚠️  ARQUIVO PROTEGIDO - NÃO ALTERAR                          ║
║                                                                  ║
║  Este template é a versão FINAL e ESTÁVEL do checkout            ║
║  BasileiaVendor. Qualquer alteração no checkout deve ser         ║
║  feita nos arquivos da pasta /checkout/ ou /checkouts/,          ║
║  NUNCA nesta pasta /BasileiaVendor/.                             ║
║                                                                  ║
║  Última revisão: {{ date('Y-m-d') }}                                        ║
║  Responsável: Equipe Basiléia                                    ║
╚══════════════════════════════════════════════════════════════════╝
--}}
<!DOCTYPE html>
<html lang="pt-BR">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <meta name="csrf-token" content="{{ csrf_token() }}">
    <title>{{ $plano }} - Checkout Basiléia</title>
    <script defer src="https://cdn.jsdelivr.net/npm/alpinejs@3.x.x/dist/cdn.min.js"></script>
    <link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;800;900&family=Share+Tech+Mono&display=swap" rel="stylesheet">
    <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.4.0/css/all.min.css">
    <style>
        * { margin: 0; padding: 0; box-sizing: border-box; }
        :root {
            --primary: #7c3aed;
            --primary-dark: #5b21b6;
            --primary-light: #a78bfa;
            --bg-dark: #0f0a1e;
            --purple-glow: rgba(124, 58, 237, 0.5);
        }
        html, body {
            height: 100%;
            margin: 0;
            padding: 0;
            overflow-x: hidden;
            background: #0f0a1e;
        }
        body {
            font-family: 'Inter', sans-serif;
            min-height: 100vh;
            min-height: 100dvh;
            display: flex;
            align-items: center;
            justify-content: center;
            padding: 20px;
            background: linear-gradient(135deg, #0f0a1e 0%, #1a103c 50%, #2d1b69 100%);
            background-attachment: fixed;
            color: white;
        }

        .checkout-wrapper {
            display: grid;
            grid-template-columns: 1fr 1.2fr;
            gap: 40px;
            max-width: 1100px;
            width: 100%;
            align-items: center;
        }

        /* LEFT PANEL - SUMMARY CARD */
        .order-summary {
            padding-right: 0;
            display: flex;
            flex-direction: column;
            gap: 25px;
        }
        
        .summary-card {
            background: rgba(255, 255, 255, 0.03);
            backdrop-filter: blur(10px);
            border: 1px solid rgba(255, 255, 255, 0.1);
            border-radius: 24px;
            padding: 30px;
            box-shadow: 0 20px 40px rgba(0, 0, 0, 0.2);
            position: relative;
            overflow: hidden;
        }

        .summary-card::before {
            content: '';
            position: absolute;
            top: 0; left: 0; width: 100%; height: 4px;
            background: linear-gradient(90deg, var(--primary), var(--primary-light));
        }

        .brand-logo {
            display: flex;
            align-items: center;
            gap: 15px;
            margin-bottom: 10px;
        }
        .brand-logo img { height: 35px; width: auto; filter: drop-shadow(0 0 10px rgba(124, 58, 237, 0.3)); display: block; }
        .brand-logo .fallback-text { font-size: 24px; font-weight: 800; color: white; }
        
        .badge-secure {
            display: inline-flex;
            align-items: center;
            gap: 6px;
            background: rgba(34, 197, 94, 0.1);
            padding: 6px 12px;
            border-radius: 100px;
            font-size: 11px;
            font-weight: 700;
            color: #4ade80;
            text-transform: uppercase;
            letter-spacing: 0.5px;
            border: 1px solid rgba(34, 197, 94, 0.2);
        }

        .summary-label { font-size: 13px; color: #a99fbb; margin-top: 15px; text-transform: uppercase; letter-spacing: 1px; opacity: 0.8; }
        .plan-title { font-size: 38px; font-weight: 900; margin: 5px 0 15px; line-height: 1; letter-spacing: -1px; }
        
        .price-container {
            background: rgba(124, 58, 237, 0.1);
            border-radius: 16px;
            padding: 20px;
            margin-bottom: 25px;
            border: 1px solid rgba(124, 58, 237, 0.1);
            display: flex;
            align-items: baseline;
            gap: 8px;
        }
        .price-currency { font-size: 18px; font-weight: 600; color: var(--primary-light); }
        .price-value { font-size: 44px; font-weight: 900; color: white; line-height: 1; }
        .price-period { font-size: 14px; color: #a99fbb; }
        
        .features-list {
            display: flex;
            flex-direction: column;
            gap: 12px;
            margin-bottom: 5px;
        }
        .feature-item { 
            display: flex; 
            align-items: center; 
            gap: 12px; 
            font-size: 14px; 
            color: #e2e8f0;
            padding: 8px 0;
            border-bottom: 1px solid rgba(255, 255, 255, 0.05);
        }
        .feature-item:last-child { border-bottom: none; }
        .feature-item i { color: #22c55e; font-size: 16px; }

        .trust-row {
            display: flex;
            justify-content: space-between;
            margin-top: 10px;
            color: #a99fbb;
            font-size: 12px;
            font-weight: 500;
        }
        .trust-item { display: flex; align-items: center; gap: 6px; }
        .trust-item i { font-size: 14px; opacity: 0.7; }

        /* RIGHT PANEL - THE BOOK */
        .book-container {
            position: relative;
            perspective: 2000px;
            width: 100%;
            max-width: 420px;
            min-height: 580px; /* Estabiliza a quebra no flip */
        }

        .layer {
            position: relative;
            background: white;
            border-radius: 20px;
            padding: 20px;
            color: #1e293b;
            box-shadow: 0 25px 50px -12px rgba(0, 0, 0, 0.5);
            z-index: 10;
            backface-visibility: hidden;
            -webkit-backface-visibility: hidden;
        }

        .book-bg-layer {
            position: absolute;
            top: 8px;
            left: 8px;
            right: -8px;
            bottom: -8px;
            background: #e9e5ff; /* More visible roxinho */
            border: 1px solid #ddd6fe;
            border-radius: 20px;
            z-index: 5;
            transform: rotate(-2deg);
        }
        .book-bg-layer-2 {
            position: absolute;
            top: 16px;
            left: 16px;
            right: -16px;
            bottom: -16px;
            background: #ddd6fe; /* Darker roxinho */
            border: 1px solid #c4b5fd;
            border-radius: 20px;
            z-index: 2;
            transform: rotate(-4deg);
        }

        /* CARD DESIGN */
        .card-scene {
            width: 100%;
            height: 180px;
            perspective: 1000px;
            margin-bottom: 20px;
            cursor: pointer;
        }
        .card-inner {
            position: relative;
            width: 100%;
            height: 100%;
            transition: transform 0.8s;
            transform-style: preserve-3d;
        }
        .card-inner.is-flipped { transform: rotateY(180deg); }
        .card-face {
            position: absolute;
            width: 100%;
            height: 100%;
            backface-visibility: hidden;
            border-radius: 14px;
            padding: 20px;
            color: white;
            display: flex;
            flex-direction: column;
            justify-content: space-between;
            background: linear-gradient(135deg, #4c1d95 0%, #7c3aed 100%);
            box-shadow: 0 10px 25px rgba(0,0,0,0.2);
            overflow: hidden;
        }
        .card-face::before {
            content: '';
            position: absolute;
            top: -50%;
            left: -50%;
            width: 200%;
            height: 200%;
            background: radial-gradient(circle, rgba(255,255,255,0.1) 0%, transparent 80%);
            pointer-events: none;
        }
        .card-back { transform: rotateY(180deg); background: linear-gradient(135deg, #1e1b4b 0%, #312e81 100%); }
        .card-chip { width: 40px; height: 30px; background: linear-gradient(135deg, #ffd700 0%, #facc15 100%); border-radius: 6px; margin-bottom: 15px; }
        .card-number-display { font-family: 'Share Tech Mono', monospace; font-size: 20px; letter-spacing: 2px; margin-bottom: 15px; }
        .card-bottom { display: flex; justify-content: space-between; align-items: flex-end; }
        .card-label { font-size: 9px; text-transform: uppercase; opacity: 0.7; margin-bottom: 3px; }
        .card-value { font-size: 13px; font-weight: 600; text-transform: uppercase; }
        .card-brand-logo { position: absolute; top: 20px; right: 20px; height: 25px; width: auto; opacity: 0; transition: opacity 0.3s; pointer-events: none; }
        .card-brand-logo.visible { opacity: 1; }
        .card-brand-logo.default { font-weight: 900; font-size: 20px; color: white; opacity: 0; }
        .card-brand-logo.default.visible { opacity: 0.3; }

        .card-magnetic-strip { height: 35px; background: #000; width: 120%; margin: 0 -20px; }
        .card-cvv-strip { height: 30px; background: white; width: 80%; border-radius: 4px; margin-top: 15px; display: flex; align-items: center; justify-content: flex-end; padding-right: 15px; color: #1e293b; font-weight: 700; font-family: 'Share Tech Mono', monospace; }

        /* FORM ELEMENTS */
        .form-title { font-size: 22px; font-weight: 800; color: #1e293b; margin-bottom: 5px; }
        .form-subtitle { font-size: 13px; color: #64748b; margin-bottom: 20px; }
        .form-group { margin-bottom: 12px; }
        .form-label { display: block; font-size: 11px; font-weight: 700; color: #475569; text-transform: uppercase; margin-bottom: 6px; }
        .form-input { width: 100%; padding: 12px 15px; border: 2px solid #e2e8f0; border-radius: 10px; font-size: 14px; transition: all 0.3s; background: #f8fafc; color: #1e293b; font-weight: 500; }
        .form-input:focus { border-color: var(--primary); outline: none; background: white; box-shadow: 0 0 0 4px rgba(124, 58, 237, 0.1); }
        .form-row { display: grid; grid-template-columns: 1fr 1fr; gap: 12px; }
        .btn-pay { width: 100%; padding: 15px; background: var(--primary); color: white; border: none; border-radius: 12px; font-size: 15px; font-weight: 700; cursor: pointer; transition: all 0.3s; display: flex; align-items: center; justify-content: center; gap: 10px; margin-top: 5px; }
        .btn-pay:hover { background: var(--primary-dark); transform: translateY(-2px); box-shadow: 0 10px 25px rgba(124, 58, 237, 0.3); }
        .btn-pay:disabled { opacity: 0.7; cursor: not-allowed; transform: none; }

        .btn-secondary { width: 100%; padding: 10px; background: #f1f5f9; color: #475569; border: none; border-radius: 10px; font-size: 13px; font-weight: 600; cursor: pointer; transition: all 0.3s; display: flex; align-items: center; justify-content: center; gap: 8px; }
        .btn-secondary:hover { background: #e2e8f0; }

        /* SUCCESS STATE */
        .success-icon { width: 60px; height: 60px; background: #f0fdf4; color: #22c55e; border-radius: 50%; display: flex; align-items: center; justify-content: center; font-size: 30px; margin: 0 auto 20px; }
        .success-btns { display: flex; flex-direction: column; gap: 10px; margin-top: 30px; }

        /* PIX ELEMENTS */
        .pix-container { text-align: center; }
        .pix-qr-box { background: white; padding: 15px; border-radius: 15px; display: inline-block; margin-bottom: 20px; }
        .pix-qr-box img { width: 180px; height: 180px; }
        .pix-payload { background: #f1f5f9; padding: 12px; border-radius: 10px; font-family: 'Share Tech Mono', monospace; font-size: 11px; color: #475569; word-break: break-all; margin-bottom: 15px; border: 1px dashed #cbd5e1; }

        /* UTILS */
        [x-cloak] { display: none !important; }
        .layer-enter-start { opacity: 0; transform: translateY(20px); }
        .layer-enter-end { opacity: 1; transform: translateY(0); }
        .layer-leave-start { opacity: 1; transform: translateY(0); }
        .layer-leave-end { opacity: 0; transform: translateY(-20px); }
        .layer-transition { transition: all 0.4s cubic-bezier(0.4, 0, 0.2, 1); }

        /* COUNTRY SELECTOR */
        .custom-select-container { position: relative; width: 110px; }
        .custom-select-trigger { display: flex; align-items: center; gap: 6px; padding: 6px 10px; background: #f8fafc; border: 1px solid #e2e8f0; border-radius: 8px; font-size: 11px; font-weight: 600; color: #475569; cursor: pointer; }
        .custom-select-options { position: absolute; top: calc(100% + 5px); right: 0; width: 160px; background: white; border-radius: 10px; box-shadow: 0 10px 25px rgba(0,0,0,0.1); border: 1px solid #e2e8f0; z-index: 100; max-height: 250px; overflow-y: auto; display: none; }
        .custom-select-options.show { display: block; }
        .custom-select-option { padding: 8px 12px; display: flex; align-items: center; gap: 8px; cursor: pointer; font-size: 12px; transition: background 0.2s; }
        .custom-select-option:hover { background: #f1f5f9; }

        /* EXPIRED OVERLAY */
        .expired-overlay { position: absolute; inset: 0; background: rgba(255,255,255,0.98); z-index: 1000; border-radius: 20px; display: flex; align-items: center; justify-content: center; padding: 30px; text-align: center; color: #4c1d95; }
        .expired-box i { font-size: 40px; color: #7c3aed; margin-bottom: 15px; }
        .expired-box p { font-weight: 600; }

        @media (max-width: 900px) {
            body { padding: 0; align-items: flex-start; }
            .checkout-wrapper { grid-template-columns: 1fr; gap: 0; max-width: 100%; }
            
            .mobile-summary-toggle {
                display: flex;
                justify-content: space-between;
                align-items: center;
                padding: 15px 20px;
                background: rgba(15, 10, 30, 0.95);
                backdrop-filter: blur(10px);
                border-bottom: 1px solid rgba(255, 255, 255, 0.1);
                position: sticky;
                top: 0;
                z-index: 1000;
                cursor: pointer;
                color: white;
                font-size: 14px;
            }

            .order-summary { 
                height: 0;
                overflow: hidden;
                padding: 0 20px;
                transition: all 0.4s cubic-bezier(0.4, 0, 0.2, 1);
                background: #0f0a1e;
                opacity: 0;
            }
            .order-summary.mobile-open {
                height: auto;
                padding: 20px;
                opacity: 1;
                border-bottom: 1px solid rgba(255, 255, 255, 0.1);
            }

            .plan-title { font-size: 28px; }
            .book-container { margin: 20px auto; padding: 0 15px; }
            .layer { padding: 15px; }
        }

        .mobile-summary-toggle { display: none; }

        /* ══ BOOK FLIP — transição entre layers ══ */
        @keyframes flipOut {
            0%   { transform: rotateY(0deg) scale(1);      opacity: 1; }
            40%  { transform: rotateY(-75deg) scale(0.97); opacity: 0.5; }
            100% { transform: rotateY(-90deg);              opacity: 0; }
        }
        @keyframes flipIn {
            0%   { transform: rotateY(90deg);               opacity: 0; }
            60%  { transform: rotateY(20deg) scale(0.98);   opacity: 0.7; }
            100% { transform: rotateY(0deg) scale(1);       opacity: 1; }
        }
        .layer.flipping-out {
            animation: flipOut 0.42s cubic-bezier(0.4, 0, 0.2, 1) forwards;
            transform-origin: left center;
            backface-visibility: hidden;
        }
        .layer.flipping-in {
            animation: flipIn 0.42s cubic-bezier(0.16, 1, 0.3, 1) forwards;
            transform-origin: left center;
            backface-visibility: hidden;
        }
        .book-container { transform-style: preserve-3d; }
    </style>
</head>
<body class="bg-dark text-white font-sans overflow-x-hidden" x-data="checkoutFlow()">
    <script>
        function checkoutFlow() {
            const uuid = {!! json_encode($transaction->uuid) !!};
            return {
                step: (localStorage.getItem('checkout_step_' + uuid) == 3) ? 3 : 1,
                isFlipped: false,
                processing: false,
                showSelector: false,
                summaryExpanded: false,
                country: 'BR',
                locale: 'pt-BR',
                showLangSelector: false,
                currency: 'BRL',
                currencySymbol: 'R$',
                timeLeft: '30:00',
                secondsRemaining: 1800,
                cardNumber: '',
                cardExpiry: '',
                cardCvv: '',
                cardHolder: '',
                cardBrand: 'default',
                vendorName: {!! json_encode($transaction->vendor->name ?? '') !!},
                vendorEmail: {!! json_encode($transaction->customer_email ?? '') !!},
                vendorDoc: {!! json_encode($transaction->customer_document ?? '') !!},
                isExpired: false,
                originalAmount: {!! json_encode(number_format($transaction->amount ?? 0, 2, '.', '')) !!},
                selectedCountry: {code:'BR',name:'Brasil',flag:'🇧🇷',locale:'pt-BR',currency:'BRL',symbol:'R$',rate:1},
                translations: {
                    'pt-BR': {
                        expires_in: 'EXPIRA EM',
                        hide_summary: 'Ocultar Resumo',
                        view_summary: 'Ver Resumo',
                        selected_plan: 'PLANO SELECIONADO',
                        per_month: '/ mês',
                        ai_whatsapp: 'IA via WhatsApp',
                        cell_mgmt: 'Gestão de Células (CGs)',
                        lgpd: 'Conformidade LGPD',
                        support: 'Suporte Humanizado',
                        multiple_churches: 'Múltiplas Igrejas',
                        deployment: 'Implantação Rápida',
                        guarantee: 'Garantia Total',
                        guarantee_7: 'Garantia de 7 dias',
                        secure_payment: 'Pagamento Seguro',
                        rights: 'Todos os direitos reservados',
                        expired_title: 'Link Temporariamente Inativo',
                        expired_text: 'Esta oferta expirou por inatividade. Aguarde alguns segundos...',
                        payment_details: 'Dados de Pagamento',
                        instant_payment: 'Pagamento Instantâneo',
                        total_value: 'VALOR TOTAL',
                        pix_code: 'CÓDIGO PIX',
                        copy_code: 'Copiar Código',
                        auto_confirm: 'Confirmação automática em segundos',
                        titular: 'Titular',
                        validity: 'Validade',
                        signature: 'Assinatura Autorizada',
                        value: 'VALOR',
                        card_number: 'Número do Cartão',
                        expiry: 'Validade',
                        cvv: 'CVV',
                        holder_name: 'Nome no Cartão',
                        subscribe: 'Assinar Agora',
                        confirm_title: 'Confirme seus dados',
                        confirm_subtitle: 'Quase lá! Verifique se a informação da sua igreja está correta.',
                        church_name: 'Nome da Igreja / Instituição',
                        contact_email: 'Email de Contato',
                        document: 'Documento (CNPJ/CPF)',
                        validating: 'Enquanto você revisa, nosso sistema está validando sua transação.',
                        confirm_finish: 'Confirmar e Finalizar',
                        processing: 'Processando...',
                        back: 'Voltar',
                        success_title: 'Pagamento Aprovado!',
                        success_subtitle: 'Bem-vindo à nova era da sua igreja. Seus recursos já estão liberados.',
                        transaction: 'Transação',
                        date: 'Data',
                        access_dash: 'Acessar Basiléia Church',
                        whatsapp_support: 'Suporte no WhatsApp',
                        impl_videos: 'Vídeos de Implementação',
                        secure_checkout: 'Checkout 100% Seguro',
                        instant_pay_badge: 'Pagamento Instantâneo',
                        copy_pix: 'Copiar Código Pix',
                        pix_auto: 'Após o pagamento, a confirmação é automática.',
                        holder_placeholder: 'Nome no Cartão',
                        expiry_placeholder: 'MM/AA',
                        church_placeholder: 'Ex: Igreja Central'
                    },
                    'es-ES': {
                        expires_in: 'EXPIRA EN',
                        hide_summary: 'Ocultar Resumen',
                        view_summary: 'Ver Resumen',
                        selected_plan: 'PLAN SELECCIONADO',
                        per_month: '/ mes',
                        ai_whatsapp: 'IA vía WhatsApp',
                        cell_mgmt: 'Gestión de Células',
                        lgpd: 'Cumplimiento RGPD/LGPD',
                        support: 'Soporte Humanizado',
                        multiple_churches: 'Múltiples Iglesias',
                        deployment: 'Implementación Rápida',
                        guarantee: 'Garantía Total',
                        guarantee_7: 'Garantía de 7 días',
                        secure_payment: 'Pago Seguro',
                        rights: 'Todos los derechos reservados',
                        expired_title: 'Enlace Temporalmente Inactivo',
                        expired_text: 'Esta oferta ha expirado por inactividad. Por favor, espere unos segundos...',
                        payment_details: 'Datos de Pago',
                        instant_payment: 'Pago Instantáneo',
                        total_value: 'VALOR TOTAL',
                        pix_code: 'CÓDIGO PIX',
                        copy_code: 'Copiar Código',
                        auto_confirm: 'Confirmación automática en segundos',
                        titular: 'Titular',
                        validity: 'Validez',
                        signature: 'Firma Autorizada',
                        value: 'VALOR',
                        card_number: 'Número de Tarjeta',
                        expiry: 'Validez',
                        cvv: 'CVV',
                        holder_name: 'Nombre en la Tarjeta',
                        subscribe: 'Suscribirse Ahora',
                        confirm_title: 'Confirme sus datos',
                        confirm_subtitle: '¡Casi listo! Verifique si la información de su iglesia es correcta.',
                        church_name: 'Nombre de la Iglesia / Institución',
                        contact_email: 'Email de Contacto',
                        document: 'Documento (ID Fiscal)',
                        validating: 'Mientras revisa, nuestro sistema está validando su transacción.',
                        confirm_finish: 'Confirmar y Finalizar',
                        processing: 'Procesando...',
                        back: 'Volver',
                        success_title: '¡Pago Aprobado!',
                        success_subtitle: 'Bienvenido a la nueva era de su iglesia. Sus recursos ya están liberados.',
                        transaction: 'Transacción',
                        date: 'Fecha',
                        access_dash: 'Acceder Basiléia Church',
                        whatsapp_support: 'Soporte en WhatsApp',
                        impl_videos: 'Videos de Implementación',
                        secure_checkout: 'Checkout 100% Seguro',
                        instant_pay_badge: 'Pago Instantáneo',
                        copy_pix: 'Copiar Código Pix',
                        pix_auto: 'Después del pago, la confirmación es automática.',
                        holder_placeholder: 'Nombre en la Tarjeta',
                        expiry_placeholder: 'MM/AA',
                        church_placeholder: 'Ej: Iglesia Central'
                    },
                    'en-US': {
                        expires_in: 'EXPIRES IN',
                        hide_summary: 'Hide Summary',
                        view_summary: 'View Summary',
                        selected_plan: 'SELECTED PLAN',
                        per_month: '/ month',
                        ai_whatsapp: 'AI via WhatsApp',
                        cell_mgmt: 'Cell Management',
                        lgpd: 'GDPR/LGPD Compliance',
                        support: 'Human Support',
                        multiple_churches: 'Multiple Churches',
                        deployment: 'Quick Deployment',
                        guarantee: 'Full Guarantee',
                        guarantee_7: '7-day guarantee',
                        secure_payment: 'Secure Payment',
                        rights: 'All rights reserved',
                        expired_title: 'Link Temporarily Inactive',
                        expired_text: 'This offer has expired. Please wait a few seconds...',
                        payment_details: 'Payment Details',
                        instant_payment: 'Instant Payment',
                        total_value: 'TOTAL VALUE',
                        pix_code: 'PIX CODE',
                        copy_code: 'Copy Code',
                        auto_confirm: 'Automatic confirmation in seconds',
                        titular: 'Cardholder',
                        validity: 'Expiry',
                        signature: 'Authorized Signature',
                        value: 'VALUE',
                        card_number: 'Card Number',
                        expiry: 'Expiry',
                        cvv: 'CVV',
                        holder_name: 'Cardholder Name',
                        subscribe: 'Subscribe Now',
                        confirm_title: 'Confirm your details',
                        confirm_subtitle: 'Almost there! Check if your information is correct.',
                        church_name: 'Church / Institution Name',
                        contact_email: 'Contact Email',
                        document: 'Document (Tax ID)',
                        validating: 'While you review, our system is validating your transaction.',
                        confirm_finish: 'Confirm and Finish',
                        processing: 'Processing...',
                        back: 'Back',
                        success_title: 'Payment Approved!',
                        success_subtitle: 'Welcome to the new era of your church. Your resources are now released.',
                        transaction: 'Transaction',
                        date: 'Date',
                        access_dash: 'Access Basiléia Church',
                        whatsapp_support: 'WhatsApp Support',
                        impl_videos: 'Implementation Videos',
                        secure_checkout: '100% Secure Checkout',
                        instant_pay_badge: 'Instant Payment',
                        copy_pix: 'Copy Pix Code',
                        pix_auto: 'After payment, confirmation is automatic.',
                        holder_placeholder: 'Cardholder Name',
                        expiry_placeholder: 'MM/YY',
                        church_placeholder: 'Ex: Central Church'
                    },
                    'zh-CN': {
                        expires_in: '到期时间',
                        hide_summary: '隐藏摘要',
                        view_summary: '查看摘要',
                        selected_plan: '已选套餐',
                        per_month: '/ 月',
                        ai_whatsapp: 'AI WhatsApp 助手',
                        cell_mgmt: '小组管理',
                        lgpd: 'LGPD/GDPR 合规',
                        support: '人工客服支持',
                        multiple_churches: '多教会管理',
                        deployment: '快速部署',
                        guarantee: '全额保障',
                        guarantee_7: '7天退款保证',
                        secure_payment: '安全支付',
                        rights: '版权所有',
                        expired_title: '链接暂时失效',
                        expired_text: '此优惠已因超时而过期，请稍等片刻…',
                        payment_details: '支付信息',
                        instant_payment: '即时支付',
                        total_value: '总金额',
                        pix_code: 'PIX 代码',
                        copy_code: '复制代码',
                        auto_confirm: '秒后自动确认',
                        titular: '持卡人',
                        validity: '有效期',
                        signature: '授权签名',
                        value: '金额',
                        card_number: '卡号',
                        expiry: '有效期',
                        cvv: '安全码',
                        holder_name: '持卡人姓名',
                        subscribe: '立即订阅',
                        confirm_title: '确认您的信息',
                        confirm_subtitle: '即将完成！请确认您的机构信息是否正确。',
                        church_name: '机构名称',
                        contact_email: '联系邮箱',
                        document: '证件号码（税号）',
                        validating: '在您核查时，我们的系统正在验证您的交易。',
                        confirm_finish: '确认并完成',
                        processing: '处理中…',
                        back: '返回',
                        success_title: '付款成功！',
                        success_subtitle: '欢迎使用平台，您的资源已释放。',
                        transaction: '交易编号',
                        date: '日期',
                        access_dash: '访问 Basiléia Church',
                        whatsapp_support: 'WhatsApp 客服',
                        impl_videos: '实施教程视频',
                        secure_checkout: '100% 安全结账',
                        instant_pay_badge: '即时支付',
                        copy_pix: '复制代码',
                        pix_auto: '付款后自动确认',
                        holder_placeholder: '持卡人姓名',
                        expiry_placeholder: '月/年',
                        church_placeholder: '例如：中央教会'
                    },
                    'ja-JP': {
                        expires_in: '残り時間',
                        hide_summary: '詳細を隠す',
                        view_summary: '詳細を見る',
                        selected_plan: '選択されたプラン',
                        per_month: '/ 月',
                        ai_whatsapp: 'WhatsApp経由のAI',
                        cell_mgmt: 'セル管理',
                        lgpd: 'GDPR/LGPD準拠',
                        support: 'ヒューマンサポート',
                        multiple_churches: '複数の教会',
                        deployment: '迅速な導入',
                        guarantee: '完全保証',
                        guarantee_7: '7日間保証',
                        secure_payment: '安全な決済',
                        rights: '全著作権所有',
                        expired_title: 'リンクが無効になりました',
                        expired_text: '一定時間の操作がなかったため、このオファーは終了しました...',
                        payment_details: 'お支払い詳細',
                        instant_payment: '即時決済',
                        total_value: '合計金額',
                        pix_code: 'PIXコード',
                        copy_code: 'コードをコピー',
                        auto_confirm: '数秒で自動確認',
                        titular: '名義人',
                        validity: '有効期限',
                        signature: '署名',
                        value: '金額',
                        card_number: 'カード番号',
                        expiry: '有効期限',
                        cvv: 'CVV',
                        holder_name: 'カード名義人',
                        subscribe: '今すぐ購読',
                        confirm_title: '情報の確認',
                        confirm_subtitle: 'あと少しです！情報の確認をお願いします。',
                        church_name: '教会/施設名',
                        contact_email: '連絡先メールアドレス',
                        document: '身分証明書 (Tax ID)',
                        validating: '情報の確認中に決済の検証を行っています。',
                        confirm_finish: '確認して完了',
                        processing: '処理中...',
                        back: '戻る',
                        success_title: '決済完了！',
                        success_subtitle: '新しい時代へようこそ。リソースが解放されました。',
                        transaction: '取引番号',
                        date: '日付',
                        access_dash: 'ダッシュボードへ',
                        whatsapp_support: 'WhatsAppサポート',
                        impl_videos: '導入ビデオ',
                        secure_checkout: '100%安全なチェックアウト',
                        instant_pay_badge: '即時決済',
                        copy_pix: 'コードをコピー',
                        pix_auto: '支払い後、自動的に確認されます',
                        holder_placeholder: 'カードに記載されている名前',
                        expiry_placeholder: '月/年',
                        church_placeholder: '例：中央教会'
                    }
                },

                t(key) {
                    const lang = this.locale || 'en-US';
                    const set = this.translations[lang] || this.translations['en-US'];
                    return set[key] || this.translations['en-US'][key] || key;
                },

                countries: [
                    {code:'AF',name:'Afghanistan',flag:'🇦🇫',currency:'AFN',symbol:'Af',rate:0.015},
                    {code:'AL',name:'Albania',flag:'🇦🇱',currency:'ALL',symbol:'L',rate:0.011},
                    {code:'DZ',name:'Algeria',flag:'🇩🇿',currency:'DZD',symbol:'DA',rate:0.0074},
                    {code:'AD',name:'Andorra',flag:'🇦🇩',currency:'EUR',symbol:'€',rate:0.17},
                    {code:'AO',name:'Angola',flag:'🇦🇴',currency:'AOA',symbol:'Kz',rate:0.00021},
                    {code:'AR',name:'Argentina',flag:'🇦🇷',currency:'ARS',symbol:'$',rate:0.0011},
                    {code:'AU',name:'Australia',flag:'🇦🇺',currency:'AUD',symbol:'$',rate:0.28},
                    {code:'AT',name:'Österreich',flag:'🇦🇹',currency:'EUR',symbol:'€',rate:0.17},
                    {code:'BE',name:'België',flag:'🇧🇪',currency:'EUR',symbol:'€',rate:0.17},
                    {code:'BO',name:'Bolivia',flag:'🇧🇴',currency:'BOB',symbol:'Bs',rate:0.026},
                    {code:'BR',name:'Brasil',flag:'🇧🇷',currency:'BRL',symbol:'R$',rate:1},
                    {code:'CA',name:'Canada',flag:'🇨🇦',currency:'CAD',symbol:'$',rate:0.26},
                    {code:'CL',name:'Chile',flag:'🇨🇱',currency:'CLP',symbol:'$',rate:0.0002},
                    {code:'CN',name:'China',flag:'🇨🇳',currency:'CNY',symbol:'¥',rate:0.026},
                    {code:'CO',name:'Colombia',flag:'🇨🇴',currency:'COP',symbol:'$',rate:0.00004},
                    {code:'CR',name:'Costa Rica',flag:'🇨🇷',currency:'CRC',symbol:'₡',rate:0.00035},
                    {code:'CU',name:'Cuba',flag:'🇨🇺',currency:'CUP',symbol:'$',rate:0.0075},
                    {code:'DK',name:'Danmark',flag:'🇩🇰',currency:'DKK',symbol:'kr',rate:0.023},
                    {code:'DE',name:'Deutschland',flag:'🇩🇪',currency:'EUR',symbol:'€',rate:0.17},
                    {code:'EC',name:'Ecuador',flag:'🇪🇨',currency:'USD',symbol:'$',rate:0.18},
                    {code:'EG',name:'Egypt',flag:'🇪🇬',currency:'EGP',symbol:'E£',rate:0.0037},
                    {code:'SV',name:'El Salvador',flag:'🇸🇻',currency:'USD',symbol:'$',rate:0.18},
                    {code:'ES',name:'España',flag:'🇪🇸',currency:'EUR',symbol:'€',rate:0.17},
                    {code:'FI',name:'Suomi',flag:'🇫🇮',currency:'EUR',symbol:'€',rate:0.17},
                    {code:'FR',name:'France',flag:'🇫🇷',currency:'EUR',symbol:'€',rate:0.17},
                    {code:'GB',name:'Great Britain',flag:'🇬🇧',currency:'GBP',symbol:'£',rate:0.14},
                    {code:'GR',name:'Elláda',flag:'🇬🇷',currency:'EUR',symbol:'€',rate:0.17},
                    {code:'GT',name:'Guatemala',flag:'🇬🇹',currency:'GTQ',symbol:'Q',rate:0.023},
                    {code:'HN',name:'Honduras',flag:'🇭🇳',currency:'HNL',symbol:'L',rate:0.0073},
                    {code:'HK',name:'Hong Kong',flag:'🇭🇰',currency:'HKD',symbol:'$',rate:1.4},
                    {code:'HU',name:'Magyarország',flag:'🇭🇺',currency:'HUF',symbol:'Ft',rate:0.00049},
                    {code:'IN',name:'India',flag:'🇮🇳',currency:'INR',symbol:'₹',rate:0.015},
                    {code:'IE',name:'Ireland',flag:'🇮🇪',currency:'EUR',symbol:'€',rate:0.17},
                    {code:'IL',name:'Israel',flag:'🇮🇱',currency:'ILS',symbol:'₪',rate:0.67},
                    {code:'IT',name:'Italia',flag:'🇮🇹',currency:'EUR',symbol:'€',rate:0.17},
                    {code:'JP',name:'Japan',flag:'🇯🇵',currency:'JPY',symbol:'¥',rate:2.8},
                    {code:'MX',name:'Mexico',flag:'🇲🇽',currency:'MXN',symbol:'$',rate:0.11},
                    {code:'NL',name:'Nederland',flag:'🇳🇱',currency:'EUR',symbol:'€',rate:0.17},
                    {code:'NZ',name:'New Zealand',flag:'🇳🇿',currency:'NZD',symbol:'$',rate:0.30},
                    {code:'NI',name:'Nicaragua',flag:'🇳🇮',currency:'NIO',symbol:'C$',rate:0.0049},
                    {code:'NO',name:'Norge',flag:'🇳🇴',currency:'NOK',symbol:'kr',rate:0.019},
                    {code:'PA',name:'Panamá',flag:'🇵🇦',currency:'PAB',symbol:'B/.',rate:0.18},
                    {code:'PY',name:'Paraguay',flag:'🇵🇾',currency:'PYG',symbol:'₲',rate:1.4},
                    {code:'PE',name:'Perú',flag:'🇵🇪',currency:'PEN',symbol:'S/',rate:0.048},
                    {code:'PL',name:'Polska',flag:'🇵🇱',currency:'PLN',symbol:'zł',rate:0.041},
                    {code:'PT',name:'Portugal',flag:'🇵🇹',currency:'EUR',symbol:'€',rate:0.17},
                    {code:'RU',name:'Rossiya',flag:'🇷🇺',currency:'RUB',symbol:'₽',rate:0.016},
                    {code:'SA',name:'Saudi Arabia',flag:'🇸🇦',currency:'SAR',symbol:'SR',rate:0.67},
                    {code:'SG',name:'Singapore',flag:'🇸🇬',currency:'SGD',symbol:'$',rate:0.24},
                    {code:'ZA',name:'South Africa',flag:'🇿🇦',currency:'ZAR',symbol:'R',rate:0.34},
                    {code:'KR',name:'South Korea',flag:'🇰🇷',currency:'KRW',symbol:'₩',rate:245},
                    {code:'SE',name:'Sverige',flag:'🇸🇪',currency:'SEK',symbol:'kr',rate:0.19},
                    {code:'CH',name:'Schweiz',flag:'🇨🇭',currency:'CHF',symbol:'CHF',rate:0.16},
                    {code:'TW',name:'Taiwan',flag:'🇹🇼',currency:'TWD',symbol:'NT$',rate:5.8},
                    {code:'TH',name:'Thailand',flag:'🇹🇭',currency:'THB',symbol:'฿',rate:6.5},
                    {code:'TR',name:'Türkiye',flag:'🇹🇷',currency:'TRY',symbol:'₺',rate:0.56},
                    {code:'UA',name:'Ukraina',flag:'🇺🇦',currency:'UAH',symbol:'₴',rate:7.2},
                    {code:'AE',name:'United Arab Emirates',flag:'🇦🇪',currency:'AED',symbol:'DH',rate:0.66},
                    {code:'US',name:'USA',flag:'🇺🇸',currency:'USD',symbol:'$',rate:0.18},
                    {code:'UY',name:'Uruguay',flag:'🇺🇾',currency:'UYU',symbol:'$',rate:0.0047},
                    {code:'VE',name:'Venezuela',flag:'🇻🇪',currency:'VES',symbol:'Bs.',rate:0.000005},
                    {code:'VN',name:'Vietnam',flag:'🇻🇳',currency:'VND',symbol:'₫',rate:4500}
                ],

                changeLanguage(lang) {
                    this.locale = lang;
                    localStorage.setItem('selected_language', lang);
                    this.showLangSelector = false;
                },

                changeCountry(code) {
                    const c = this.countries.find(x => x.code === code);
                    if (!c) return;
                    this.country = c.code;
                    this.selectedCountry = c;
                    
                    if (!localStorage.getItem('selected_language')) {
                        if (c.code === 'BR' || ['PT','AO','MZ','CV'].includes(c.code)) this.locale = 'pt-BR';
                        else if (['ES','MX','AR','CO','CL','PE','VE','EC','BO','PY','UY',
                                   'CR','GT','HN','SV','NI','PA','DO','CU'].includes(c.code)) this.locale = 'es-ES';
                        else if (c.code === 'CN') this.locale = 'zh-CN';
                        else if (c.code === 'JP') this.locale = 'ja-JP';
                        else this.locale = 'en-US';
                    }
                    
                    this.currency = c.currency;
                    this.currencySymbol = c.symbol;
                    localStorage.setItem('selected_country_code', code);
                    this.showSelector = false;
                },

                formatPrice(amount) {
                    const finalAmount = amount * (this.selectedCountry.rate || 1);
                    return new Intl.NumberFormat(this.locale, {
                        style: 'currency',
                        currency: this.currency,
                        minimumFractionDigits: 2
                    }).format(finalAmount);
                },
                
                init() {
                    const savedLang = localStorage.getItem('selected_language');
                    if (savedLang) this.locale = savedLang;

                    const savedCode = localStorage.getItem('selected_country_code');
                    if (savedCode) {
                        this.changeCountry(savedCode);
                        if (savedLang) this.locale = savedLang;
                    }
                    else {
                        const browserLang = navigator.language || 'pt-BR';
                        if (browserLang.includes('pt')) this.changeCountry('BR');
                        else if (browserLang.includes('es')) this.changeCountry('ES');
                        else if (browserLang.includes('zh')) this.changeCountry('CN');
                        else this.changeCountry('US');
                    }

                    let startTime = localStorage.getItem('checkout_start_time_' + uuid);
                    if (!startTime) {
                        startTime = Date.now();
                        localStorage.setItem('checkout_start_time_' + uuid, startTime);
                    }

                    setInterval(() => {
                        if (this.isExpired) return;
                        const now = Date.now();
                        const elapsed = Math.floor((now - startTime) / 1000);
                        this.secondsRemaining = Math.max(0, 1800 - elapsed);
                        if (this.secondsRemaining === 0) {
                            this.isExpired = true;
                            setTimeout(() => {
                                this.isExpired = false;
                                startTime = Date.now();
                                localStorage.setItem('checkout_start_time_' + uuid, startTime);
                            }, 30000);
                        }
                        const mins = Math.floor(this.secondsRemaining / 60);
                        const secs = this.secondsRemaining % 60;
                        this.timeLeft = `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
                    }, 1000);
                },

                formatCardNumber(val) {
                    let v = val.replace(/\D/g, '');
                    let masked = v.match(/.{1,4}/g)?.join(' ') || v;
                    return masked || '0000 0000 0000 0000';
                },

                updateCardNumber(e) {
                    let value = e.target.value.replace(/\D/g, '');
                    let masked = value.match(/.{1,4}/g)?.join(' ') || value;
                    this.cardNumber = masked;
                    this.updateCardBrand();
                },

                updateCardExpiry(e) {
                    let value = e.target.value.replace(/\D/g, '');
                    if (value.length > 2) value = value.substring(0, 2) + '/' + value.substring(2, 4);
                    this.cardExpiry = value;
                },

                updateCardBrand() {
                    const num = this.cardNumber.replace(/\D/g, '');
                    if (num.length >= 2) {
                        const eloRegex = /^(401178|401179|431274|438935|451416|457393|457631|457632|504175|506699|5067|5090|627780|636297|636368|650031|650032|650033|650035|650036|650037|650038|650039|650040|650041|650042|650043|650044|650045|650046|650047|650048|650049|650050|650051|650405|650406|650407|650408|650409|650410|650411|650412|650413|650414|650415|650416|650417|650418|650419|650420|650421|650422|650423|650424|650425|650426|650427|650428|650429|650430|650431|650432|650433|650434|650435|650436|650437|650438|650439|650485|650486|650487|650488|650489|650490|650491|650492|650493|650494|650495|650496|650497|650498|650499|650500|650501|650502|650503|650504|650505|650506|650507|650508|650509|650510|650511|650512|650513|650514|650515|650516|650517|650518|650519|650520|650521|650522|650523|650524|650525|650526|650527|650528|650529|650530|650531|650532|650533|650534|650535|650536|650537|650538|650539|650541|650542|650543|650544|650545|650546|650547|650548|650549|650598|650700|650701|650702|650703|650704|650705|650706|650707|650708|650709|650710|650711|650712|650713|650714|650715|650716|650717|650718|650719|650720|650721|650722|650723|650724|650725|650726|650727|650901|650902|650903|650904|650905|650906|650907|650908|650909|650910|650911|650912|650913|650914|650915|650916|650917|650918|650919|650920|651652|651653|651654|651655|651656|651657|651658|651659|651660|651661|651662|651663|651664|651665|651666|651667|651668|651669|651670|651671|651672|651673|651674|651675|651676|651677|651678|651679|651680|651681|655000|655001)/;
                        if (eloRegex.test(num)) this.cardBrand = 'elo';
                        else if (num.startsWith('4')) this.cardBrand = 'visa';
                        else if (num.match(/^(5[1-5]|2[2-7])/)) this.cardBrand = 'mastercard';
                        else if (num.match(/^(34|37)/)) this.cardBrand = 'amex';
                        else if (num.startsWith('6062')) this.cardBrand = 'hipercard';
                        else if (num.match(/^(301|305|36|38)/)) this.cardBrand = 'diners';
                        else this.cardBrand = 'default';
                    } else this.cardBrand = 'default';
                },

                flipLayer(fromStep, toStep) {
                    const allLayers = document.querySelectorAll('.layer');
                    const fromEl = [...allLayers].find(l => parseInt(l.dataset.step) === fromStep);
                    const toEl   = [...allLayers].find(l => parseInt(l.dataset.step) === toStep);
                    if (!fromEl || !toEl) { this.step = toStep; return; }
                    fromEl.classList.add('flipping-out');
                    fromEl.addEventListener('animationend', () => {
                        fromEl.classList.remove('flipping-out');
                        this.step = toStep;
                        this.$nextTick(() => {
                            toEl.classList.add('flipping-in');
                            toEl.addEventListener('animationend', () => {
                                toEl.classList.remove('flipping-in');
                            }, { once: true });
                        });
                    }, { once: true });
                },

                processPayment() { 
                    this.processing = true;
                },
                getWhatsappLink() {
                    const msg = encodeURIComponent(`Ola, sou ${this.vendorName} e adquiri o basileia, queria saber os próximos passos!`);
                    return `https://wa.me/5511934924430?text=${msg}`;
                }
            }
        }
    </script>

    <div class="checkout-wrapper">
        <div class="mobile-summary-toggle" @click="mobileSummaryOpen = !mobileSummaryOpen">
            <div style="display: flex; align-items: center; gap: 10px;">
                <i class="fas fa-shopping-cart"></i>
                <span x-text="mobileSummaryOpen ? t('hide_summary') : t('view_summary')"></span>
                <i class="fas" :class="mobileSummaryOpen ? 'fa-chevron-up' : 'fa-chevron-down'" style="font-size: 10px;"></i>
            </div>
            <div style="font-weight: 700;" x-text="formatPrice(originalAmount)"></div>
        </div>

        <div class="order-summary" :class="{ 'mobile-open': mobileSummaryOpen }">
            <div class="brand-logo" style="margin-bottom: 20px; display: block; width: 160px; height: 44px;">
                <svg width="160" height="44" viewBox="0 0 160 44" fill="none" xmlns="http://www.w3.org/2000/svg" style="display: block;">
                    <rect width="160" height="44" rx="12" fill="#7C3AED"/>
                    <rect x="6" y="6" width="32" height="32" rx="8" fill="white" fill-opacity="0.2"/>
                    <path d="M22.5 14H18.5V30H22.5C23.6046 30 24.5 29.1046 24.5 28C24.5 26.8954 23.6046 26 22.5 26H18.5M22.5 26C23.6046 26 24.5 25.1046 24.5 24C24.5 22.8954 23.6046 22 22.5 22M22.5 22H18.5" stroke="white" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"/>
                    <text x="48" y="30" fill="white" style="font-family: 'Inter', sans-serif; font-weight: 700; font-size: 21px; letter-spacing: -0.02em;">Basiléia</text>
                </svg>
            </div>

            <div class="summary-card">
                <div class="badge-secure">
                    <i class="fas fa-shield-alt"></i> <span x-text="t('secure_checkout')"></span>
                </div>

                <div class="summary-label" x-text="t('selected_plan')"></div>
                <h1 class="plan-title" style="color: white;">{{ $plano }}</h1>

                <div class="price-container">
                    <span class="price-currency" x-text="currencySymbol"></span>
                    <span class="price-value" x-text="formatPrice(originalAmount).replace(/[^0-9,.]/g, '')"></span>
                    <span class="price-period" x-text="t('per_month')"></span>
                </div>

                <div class="features-list">
                    <div class="feature-item"><i class="fas fa-check-circle"></i> <span x-text="t('lgpd')"></span></div>
                    <div class="feature-item"><i class="fas fa-check-circle"></i> <span x-text="t('support')"></span></div>
                    <div class="feature-item"><i class="fas fa-check-circle"></i> <span x-text="t('multiple_churches')"></span></div>
                    <div class="feature-item"><i class="fas fa-check-circle"></i> <span x-text="t('deployment')"></span></div>
                </div>

                <div class="trust-row">
                    <div class="trust-item"><i class="fas fa-lock"></i> <span x-text="t('guarantee')"></span></div>
                    <div class="trust-item"><i class="fas fa-shield-alt"></i> <span x-text="t('secure_payment')"></span></div>
                </div>
            </div>

            <div style="text-align: center; color: #a99fbb; font-size: 11px; opacity: 0.5;">
                Basiléia Church &copy; {{ date('Y') }} - <span x-text="t('rights')"></span>
            </div>
        </div>

        <div class="book-container">
            <div x-show="isExpired" class="expired-overlay" x-cloak x-transition>
                <div class="expired-box">
                    <i class="fas fa-clock"></i>
                    <h3 x-text="t('expired_title')"></h3>
                    <p x-text="t('expired_text')"></p>
                </div>
            </div>

            <div class="layer" data-step="1" x-show="step === 1" 
                 x-transition:enter="layer-transition"
                 x-transition:enter-start="layer-enter-start"
                 x-transition:enter-end="layer-enter-end"
                 x-transition:leave="layer-transition"
                 x-transition:leave-start="layer-leave-start"
                 x-transition:leave-end="layer-leave-end">
                <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 15px;">
                    <div>
                        <div class="summary-label" style="font-size: 10px; margin-bottom: 4px;" x-text="t('expires_in')"></div>
                        <div style="font-size: 14px; font-weight: 800; background: #fef2f2; color: #dc2626; padding: 6px 12px; border-radius: 10px; display: inline-block; letter-spacing: 1px;" x-text="timeLeft"></div>
                    </div>
                    <div style="display: flex; gap: 8px;">
                        <div class="custom-select-container" @click.away="showSelector = false">
                            <div class="custom-select-trigger" @click="showSelector = !showSelector">
                                <span x-text="countries.find(x => x.code === country).flag + ' ' + country"></span>
                                <i class="fas fa-chevron-down" style="font-size: 10px;"></i>
                            </div>
                            <div class="custom-select-options" :class="{ 'show': showSelector }">
                                <template x-for="c in countries" :key="c.code">
                                    <div class="custom-select-option" @click="changeCountry(c.code); showSelector = false">
                                        <span x-text="c.flag"></span> <span x-text="c.name"></span>
                                    </div>
                                </template>
                            </div>
                        </div>

                        <div class="custom-select-container" @click.away="showLangSelector = false">
                            <div class="custom-select-trigger" @click="showLangSelector = !showLangSelector">
                                <span x-text="locale.split('-')[0].toUpperCase()"></span>
                                <i class="fas fa-globe" style="font-size: 10px;"></i>
                            </div>
                            <div class="custom-select-options" :class="{ 'show': showLangSelector }" style="width: 100px;">
                                <div class="custom-select-option" @click="changeLanguage('pt-BR')">PT</div>
                                <div class="custom-select-option" @click="changeLanguage('es-ES')">ES</div>
                                <div class="custom-select-option" @click="changeLanguage('en-US')">EN</div>
                                <div class="custom-select-option" @click="changeLanguage('ja-JP')">JP</div>
                                <div class="custom-select-option" @click="changeLanguage('zh-CN')">CN</div>
                            </div>
                        </div>
                    </div>
                </div>

                @if(($asaasPayment['billingType'] ?? 'PIX') === 'PIX')
                    <div class="pix-container">
                        <div class="pix-qr-box"><img src="data:image/png;base64,{{ $pixData['encodedImage'] ?? '' }}"></div>
                        <div style="font-size: 36px; font-weight: 900; margin-bottom: 20px;" x-text="formatPrice(originalAmount)"></div>
                        <div class="pix-payload" id="pixPayload">{{ $pixData['payload'] ?? '' }}</div>
                        <button class="btn-pay" @click="flipLayer(1, 3); processPayment()">
                            <i class="fas fa-copy"></i> <span x-text="t('copy_code')"></span>
                        </button>
                    </div>
                @else
                    <div class="card-scene" @click="isFlipped = !isFlipped">
                        <div class="card-inner" :class="{ 'is-flipped': isFlipped }">
                            <div class="card-face card-front">
                                <div class="card-chip"></div>
                                <div class="card-number-display" x-text="formatCardNumber(cardNumber)"></div>
                            </div>
                            <div class="card-face card-back">
                                <div class="card-magnetic-strip"></div>
                                <div class="card-cvv-strip" x-text="cardCvv || '•••'"></div>
                            </div>
                        </div>
                    </div>
                    <div class="form-group">
                        <label class="form-label" x-text="t('card_number')"></label>
                        <input type="text" class="form-input" x-model="cardNumber" @input="updateCardNumber($event)" maxlength="19">
                    </div>
                    <button type="button" class="btn-pay" @click.prevent="flipLayer(1, 2)">
                        <span x-text="t('subscribe')"></span> <i class="fas fa-arrow-right"></i>
                    </button>
                @endif
            </div>

            <div class="layer" data-step="2" x-show="step === 2" 
                 x-transition:enter="layer-transition"
                 x-transition:enter-start="layer-enter-start"
                 x-transition:enter-end="layer-enter-end"
                 x-transition:leave="layer-transition"
                 x-transition:leave-start="layer-leave-start"
                 x-transition:leave-end="layer-leave-end">
                <form id="paymentForm" method="POST" action="{{ route('checkout.process', $transaction->uuid) }}">
                    @csrf
                    <h2 class="form-title" x-text="t('confirm_title')"></h2>
                    <div class="form-group">
                        <label class="form-label" x-text="t('church_name')"></label>
                        <input type="text" name="customer_name" class="form-input" x-model="vendorName" :placeholder="t('church_placeholder')">
                    </div>
                    <div style="display: flex; justify-content: space-between; align-items: center; margin-top: 20px;">
                        <button type="button" class="btn-secondary" style="width: auto;" @click="flipLayer(2, 1)">
                            <i class="fas fa-arrow-left"></i> <span x-text="t('back')"></span>
                        </button>
                        <button type="submit" class="btn-pay" style="width: auto;" @click="processing = true">
                            <span x-text="t('confirm_finish')"></span>
                        </button>
                    </div>
                </form>
            </div>

            <div class="layer" data-step="3" x-show="step === 3" 
                 x-transition:enter="layer-transition"
                 x-transition:enter-start="layer-enter-start"
                 x-cloak>
                <div class="success-icon">
                    <i class="fas fa-check"></i>
                </div>
                <h2 class="form-title" style="text-align: center;" x-text="t('success_title')"></h2>
                <p class="form-subtitle" style="text-align: center;" x-text="t('success_subtitle')"></p>

                <div style="background: #f8fafc; border-radius: 16px; padding: 20px; margin-top: 20px;">
                    <div style="display: flex; justify-content: space-between; margin-bottom: 10px; font-size: 13px; color: #64748b;">
                        <span x-text="t('transaction')"></span>
                        <span style="font-weight: 700; color: #1e293b;">#{{ strtoupper(substr($transaction->uuid, 0, 8)) }}</span>
                    </div>
                    <div style="display: flex; justify-content: space-between; font-size: 13px; color: #64748b;">
                        <span x-text="t('date')"></span>
                        <span style="font-weight: 700; color: #1e293b;">{{ date('d/m/Y H:i') }}</span>
                    </div>
                </div>

                <div class="success-btns">
                    <a href="https://dash.basileia.global/dashboard" class="btn-pay" style="margin-top: 0;">
                        <span x-text="t('access_dash')"></span> <i class="fas fa-church"></i>
                    </a>
                    <a :href="getWhatsappLink()" target="_blank" class="btn-secondary">
                        <i class="fab fa-whatsapp" style="color: #25d366;"></i> <span x-text="t('whatsapp_support')"></span>
                    </a>
                    <a href="#" class="btn-secondary">
                        <i class="fas fa-play-circle" style="color: var(--primary);"></i> <span x-text="t('impl_videos')"></span>
                    </a>
                </div>
            </div>
        </div>
    </div>
</body>
</html>
