{{--
╔══════════════════════════════════════════════════════════════════╗
║  ⚠️  ARQUIVO PROTEGIDO - NÃO ALTERAR                          ║
║                                                                  ║
║  Este template é a versão FINAL e ESTÁVEL do checkout            ║
║  Premium BasileiaVendor. Qualquer alteração no checkout          ║
║  deve ser feita nos arquivos da pasta /checkout/ ou /checkouts/, ║
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
            gap: 60px;
            max-width: 1100px;
            width: 100%;
            align-items: center;
        }

        /* LEFT PANEL */
        .order-summary {
            padding-right: 20px;
        }
        .brand-logo {
            display: flex;
            flex-direction: column;
            align-items: center;
            justify-content: center;
            gap: 15px;
            margin-bottom: 40px;
            text-align: center;
        }
        .brand-logo img { height: 70px; width: auto; filter: drop-shadow(0 0 10px rgba(124, 58, 237, 0.3)); }
        .summary-label { font-size: 14px; color: #a99fbb; margin-bottom: 8px; text-transform: uppercase; letter-spacing: 1px; }
        .plan-title { font-size: 56px; font-weight: 800; margin-bottom: 30px; line-height: 1.1; }
        .price-row { display: flex; align-items: baseline; gap: 10px; margin-bottom: 40px; }
        .price-currency { font-size: 24px; color: #a99fbb; }
        .price-value { font-size: 48px; font-weight: 800; }
        .price-period { font-size: 16px; color: #a99fbb; }
        
        .features-grid {
            display: grid;
            grid-template-columns: 1fr 1fr;
            gap: 20px;
            margin-bottom: 60px;
        }
        .feature-item { display: flex; align-items: center; gap: 10px; font-size: 15px; }
        .feature-item i { color: #22c55e; font-size: 18px; }

        .trust-footer {
            display: flex;
            gap: 30px;
            padding-top: 30px;
            border-top: 1px solid rgba(255,255,255,0.1);
            color: #a99fbb;
            font-size: 14px;
        }
        .trust-item { display: flex; align-items: center; gap: 8px; }

        /* RIGHT PANEL - THE BOOK */
        .book-container {
            position: relative;
            perspective: 2000px;
            width: 100%;
            max-width: 450px;
            min-height: 600px; /* Estabiliza a quebra no flip */
        }

        .layer {
            position: relative;
            background: white;
            border-radius: 24px;
            padding: 40px;
            color: #1e293b;
            box-shadow: 0 25px 50px -12px rgba(0, 0, 0, 0.5);
            z-index: 10;
            backface-visibility: hidden;
            -webkit-backface-visibility: hidden;
        }

        /* Camadas de fundo para o efeito de "book" */
        .book-bg-layer {
            position: absolute;
            top: 0; left: 0; width: 100%; height: 100%;
            background: rgba(124, 58, 237, 0.3);
            border-radius: 24px;
            transform: translate(12px, 12px) rotate(2deg);
            z-index: 1;
            filter: blur(2px);
        }
        .book-bg-layer-2 {
            position: absolute;
            top: 0; left: 0; width: 100%; height: 100%;
            background: rgba(124, 58, 237, 0.15);
            border-radius: 24px;
            transform: translate(24px, 24px) rotate(4deg);
            z-index: 0;
            filter: blur(4px);
        }

        /* 3D CARD */
        .card-scene {
            width: 100%;
            height: 200px;
            perspective: 1000px;
            margin-bottom: 20px;
        }
        .card-inner {
            position: relative;
            width: 100%;
            height: 100%;
            transition: transform 0.8s cubic-bezier(0.175, 0.885, 0.32, 1.275);
            transform-style: preserve-3d;
            cursor: pointer;
        }
        .card-inner.is-flipped { transform: rotateY(180deg); }
        .card-face {
            position: absolute;
            width: 100%;
            height: 100%;
            backface-visibility: hidden;
            border-radius: 16px;
            padding: 24px;
            color: white;
            box-shadow: 0 15px 35px rgba(0,0,0,0.2);
            background: linear-gradient(135deg, #7c3aed 0%, #4c1d95 100%);
        }
        .card-back { transform: rotateY(180deg); display: flex; flex-direction: column; justify-content: center; padding: 0; }
        .card-magnetic-strip { height: 40px; background: rgba(0,0,0,0.8); margin-top: 20px; }
        .card-cvv-strip { height: 35px; background: white; margin: 15px 20px; border-radius: 4px; display: flex; align-items: center; justify-content: flex-end; padding-right: 15px; color: #1e293b; font-family: 'Share Tech Mono', monospace; font-weight: bold; }
        
        .card-chip { width: 45px; height: 34px; background: linear-gradient(135deg, #ffd700 0%, #daa520 100%); border-radius: 6px; margin-bottom: 20px; }
        .card-number-display { font-family: 'Share Tech Mono', monospace; font-size: 22px; letter-spacing: 2px; margin-bottom: 25px; text-shadow: 0 2px 4px rgba(0,0,0,0.3); }
        .card-bottom { display: flex; justify-content: space-between; align-items: flex-end; }
        .card-label { font-size: 9px; opacity: 0.7; text-transform: uppercase; margin-bottom: 4px; }
        .card-value { font-size: 14px; font-weight: 600; text-transform: uppercase; }
        .card-brand-logo { position: absolute; top: 24px; right: 24px; height: 30px; opacity: 0; transition: opacity 0.3s; }
        .card-brand-logo.visible { opacity: 1; }
        .card-brand-logo.default { 
            opacity: 1; 
            background: white; 
            color: #7c3aed; 
            width: 40px; 
            height: 40px; 
            border-radius: 8px; 
            display: flex; 
            align-items: center; 
            justify-content: center;
            font-size: 20px; 
            font-weight: 900; 
        }

        /* Custom Selector */
        .custom-select-container { position: relative; width: 140px; }
        .custom-select-trigger {
            background: #f1f5f9;
            border: 1px solid #e2e8f0;
            padding: 8px 12px;
            border-radius: 10px;
            font-size: 13px;
            font-weight: 600;
            color: #475569;
            cursor: pointer;
            display: flex;
            align-items: center;
            justify-content: space-between;
            gap: 6px;
        }
        .custom-select-options {
            position: absolute;
            top: calc(100% + 5px);
            right: 0;
            width: 180px;
            background: white;
            border-radius: 12px;
            box-shadow: 0 10px 25px rgba(0,0,0,0.1);
            border: 1px solid #e2e8f0;
            z-index: 100;
            max-height: 250px;
            overflow-y: auto;
            display: none;
        }
        .custom-select-options.show { display: block; }
        .custom-select-option {
            padding: 10px 15px;
            display: flex;
            align-items: center;
            gap: 10px;
            cursor: pointer;
            transition: background 0.2s;
            font-size: 13px;
        }
        .custom-select-option:hover { background: #f8fafc; }

        /* FORMS */
        .form-title { font-size: 24px; font-weight: 800; margin-bottom: 8px; }
        .form-subtitle { font-size: 14px; color: #64748b; margin-bottom: 25px; }
        .form-group { margin-bottom: 15px; }
        .form-label { display: block; font-size: 12px; font-weight: 700; color: #64748b; margin-bottom: 6px; text-transform: uppercase; }
        .form-input { width: 100%; height: 48px; background: #f8fafc; border: 1px solid #e2e8f0; border-radius: 12px; padding: 0 16px; font-size: 15px; font-family: inherit; transition: all 0.2s; }
        .form-input:focus { outline: none; border-color: var(--primary); box-shadow: 0 0 0 4px rgba(124, 58, 237, 0.1); }
        .form-row { display: grid; grid-template-columns: 1fr 1fr; gap: 15px; }
        
        .btn-pay {
            width: 100%;
            height: 56px;
            background: linear-gradient(90deg, #7c3aed, #a855f7);
            color: white;
            border: none;
            border-radius: 16px;
            font-size: 16px;
            font-weight: 800;
            cursor: pointer;
            transition: all 0.3s;
            box-shadow: 0 10px 20px rgba(124, 58, 237, 0.3);
            display: flex;
            align-items: center;
            justify-content: center;
            gap: 10px;
            margin-top: 20px;
        }
        .btn-pay:hover { transform: translateY(-2px); box-shadow: 0 15px 30px rgba(124, 58, 237, 0.4); }
        .btn-pay:active { transform: translateY(0); }

        .expired-overlay { position: absolute; top: 0; left: 0; width: 100%; height: 100%; background: rgba(255, 255, 255, 0.95); z-index: 1000; display: flex; align-items: center; justify-content: center; border-radius: 24px; color: #1e1b4b; text-align: center; }
        .expired-box { padding: 40px; color: #4c1d95; }
        .expired-box i { font-size: 48px; color: #7c3aed; margin-bottom: 20px; }
        .expired-box h3 { font-size: 24px; margin-bottom: 10px; color: #1e1b4b; }
        .expired-box p { font-size: 14px; color: #4c1d95; font-weight: 600; }

        /* ANIMATIONS */
        [x-cloak] { display: none !important; }
        
        .layer-enter-start { opacity: 0; transform: translateY(20px); }
        .layer-enter-end { opacity: 1; transform: translateY(0); }
        .layer-leave-start { opacity: 1; transform: translateY(0); }
        .layer-leave-end { opacity: 0; transform: translateY(-20px); }
        .layer-transition { transition: all 0.4s cubic-bezier(0.4, 0, 0.2, 1); }

        /* PIX STYLES */
        .pix-container { text-align: center; }
        .pix-qr-box { background: white; padding: 20px; border-radius: 16px; box-shadow: 0 4px 12px rgba(0,0,0,0.05); display: inline-block; margin-bottom: 20px; }
        .pix-qr-box img { width: 180px; height: 180px; }
        .pix-payload { background: #f8fafc; border: 1px dashed #cbd5e1; padding: 15px; border-radius: 10px; font-family: 'Share Tech Mono', monospace; font-size: 12px; word-break: break-all; margin-bottom: 20px; }

        /* SUCCESS STYLES */
        .success-icon { width: 80px; height: 80px; background: #ecfdf5; color: #10b981; border-radius: 50%; display: flex; align-items: center; justify-content: center; font-size: 32px; margin: 0 auto 20px; }
        .success-btns { display: grid; gap: 12px; margin-top: 30px; }
        .btn-secondary { background: #f1f5f9; color: #1e293b; text-decoration: none; padding: 14px; border-radius: 12px; font-weight: 700; font-size: 14px; display: flex; align-items: center; justify-content: center; gap: 8px; transition: background 0.2s; }
        .btn-secondary:hover { background: #e2e8f0; }

        @media (max-width: 900px) {
            body { padding: 10px; align-items: flex-start; }
            .checkout-wrapper { grid-template-columns: 1fr; gap: 20px; margin-top: 20px; }
            
            .order-summary { 
                background: rgba(255, 255, 255, 0.05); 
                padding: 20px; 
                border-radius: 20px; 
                border: 1px solid rgba(255, 255, 255, 0.1);
                text-align: left;
                cursor: pointer;
                order: -1;
                transition: all 0.3s ease;
            }
            .order-summary:hover { background: rgba(255, 255, 255, 0.08); }
            
            .brand-logo { margin-bottom: 0; flex-direction: row; justify-content: flex-start; gap: 10px; }
            .brand-logo img { height: 40px; }
            .brand-logo span { font-size: 20px; }
            
            .plan-title { font-size: 28px; margin: 15px 0 5px; }
            .price-row { margin-bottom: 20px; }
            .price-value { font-size: 32px; }
            
            .mobile-collapse-content { 
                max-height: 0; 
                overflow: hidden; 
                transition: max-height 0.5s ease-out, opacity 0.3s ease;
                opacity: 0;
            }
            .mobile-collapse-content.expanded { 
                max-height: 1000px; 
                opacity: 1;
                margin-top: 20px;
                padding-top: 20px;
                border-top: 1px solid rgba(255, 255, 255, 0.1);
            }
            
            .features-grid { grid-template-columns: 1fr; gap: 12px; margin-bottom: 30px; }
            .trust-footer { flex-direction: column; gap: 15px; }
            
            .book-container { max-width: 100%; }
            .layer { padding: 30px 20px; border-radius: 20px; }
            
            /* Toggle indicator */
            .expand-indicator {
                margin-left: auto;
                transition: transform 0.3s;
            }
            .expanded .expand-indicator { transform: rotate(180deg); }
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
                vendorName: {!! json_encode($customerData['name'] ?? '') !!},
                vendorEmail: {!! json_encode($customerData['email'] ?? '') !!},
                vendorDoc: {!! json_encode($customerData['document'] ?? '') !!},
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
                        contact_email: 'Email de Contacto',
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
                        pix_auto: 'Após o pagamento, a confirmação é automática.'
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
                        success_subtitle: 'Bienvenido a la nova era de su iglesia. Sus recursos ya están liberados.',
                        transaction: 'Transacción',
                        date: 'Fecha',
                        access_dash: 'Acceder Basiléia Church',
                        whatsapp_support: 'Soporte en WhatsApp',
                        impl_videos: 'Videos de Implementación',
                        secure_checkout: 'Checkout 100% Seguro',
                        instant_pay_badge: 'Pago Instantáneo',
                        copy_pix: 'Copiar Código Pix',
                        pix_auto: 'Después del pago, la confirmación es automática.'
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
                        pix_auto: 'After payment, confirmation is automatic.'
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
                        copy_pix: '复制代码'
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
                    let match = v.match(/\d{4,16}/);
                    let m = match ? match[0] : '';
                    let parts = [];
                    for (let i=0, len=m.length; i<len; i+=4) {
                        parts.push(m.substring(i, i+4));
                    }
                    if (parts.length) return parts.join(' ');
                    return val || '0000 0000 0000 0000';
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

                processPayment() { this.processing = true; },
                copyPix() {
                    const el = document.createElement('textarea');
                    el.value = document.getElementById('pixPayload').innerText;
                    document.body.appendChild(el);
                    el.select();
                    document.execCommand('copy');
                    document.body.removeChild(el);
                },
                getWhatsappLink() {
                    const msg = encodeURIComponent(`Ola, sou ${this.vendorName} e adquiri o basileia, queria saber os próximos passos!`);
                    return `https://wa.me/5511934924430?text=${msg}`;
                }
            }
        }
    </script>
    <div class="checkout-wrapper">
        <!-- SUMMARY PANEL -->
        <div class="order-summary" @click="summaryExpanded = !summaryExpanded">
            <div style="display: flex; align-items: center; width: 100%;">
                <div class="brand-logo" style="margin-bottom: 0; align-items: flex-start;">
                    <svg width="160" height="44" viewBox="0 0 160 44" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <rect width="160" height="44" rx="12" fill="#7C3AED"/>
                        <rect x="6" y="6" width="32" height="32" rx="8" fill="white" fill-opacity="0.2"/>
                        <path d="M22.5 14H18.5V30H22.5C23.6046 30 24.5 29.1046 24.5 28C24.5 26.8954 23.6046 26 22.5 26H18.5M22.5 26C23.6046 26 24.5 25.1046 24.5 24C24.5 22.8954 23.6046 22 22.5 22M22.5 22H18.5" stroke="white" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"/>
                        <text x="48" y="30" fill="white" style="font-family: 'Inter', sans-serif; font-weight: 700; font-size: 21px; letter-spacing: -0.02em;">Basiléia</text>
                    </svg>
                </div>
                <i class="fas fa-chevron-down expand-indicator" :class="{ 'expanded': summaryExpanded }"></i>
            </div>
            
            <div class="mobile-collapse-content" :class="{ 'expanded': summaryExpanded }">
                <div class="summary-label" x-text="t('selected_plan')" style="margin-top: 30px;"></div>
                <h1 class="plan-title" style="margin-bottom: 10px;">{{ $plano }}</h1>
                
                <div class="price-row" style="margin-bottom: 40px;">
                    <span class="price-value" style="font-size: 56px;" x-text="formatPrice(originalAmount)"></span>
                    <span class="price-period" x-text="t('per_month')"></span>
                </div>

                <div class="features-grid">
                    <div class="feature-item"><i class="fas fa-check-circle"></i> <span x-text="t('ai_whatsapp')"></span></div>
                    <div class="feature-item"><i class="fas fa-check-circle"></i> <span x-text="t('cell_mgmt')"></span></div>
                    <div class="feature-item"><i class="fas fa-check-circle"></i> <span x-text="t('lgpd')"></span></div>
                    <div class="feature-item"><i class="fas fa-check-circle"></i> <span x-text="t('support')"></span></div>
                    <div class="feature-item"><i class="fas fa-check-circle"></i> <span x-text="t('multiple_churches')"></span></div>
                    <div class="feature-item"><i class="fas fa-check-circle"></i> <span x-text="t('deployment')"></span></div>
                </div>

                <div class="trust-footer">
                    <div class="trust-item"><i class="fas fa-lock"></i> <span x-text="t('secure_payment')"></span></div>
                    <div class="trust-item"><i class="fas fa-shield-alt"></i> <span x-text="t('guarantee_7')"></span></div>
                </div>
            </div>
        </div>

        <!-- THE BOOK (Right Panel) -->
        <div class="book-container">
            <div class="book-bg-layer"></div>
            <div class="book-bg-layer-2"></div>

            <!-- EXPIRED OVERLAY (THE SCARE) -->
            <div x-show="isExpired" class="expired-overlay" x-cloak x-transition>
                <div class="expired-box">
                    <i class="fas fa-clock"></i>
                    <h3 x-text="t('expired_title')"></h3>
                    <p x-text="t('expired_text')"></p>
                </div>
            </div>

            <!-- LAYER: PAYMENT (Step 1) -->
            <div class="layer" data-step="1" x-show="step === 1"
                 x-transition:enter="layer-transition"
                 x-transition:enter-start="layer-enter-start"
                 x-transition:enter-end="layer-enter-end"
                 x-transition:leave="layer-transition"
                 x-transition:leave-start="layer-leave-start"
                 x-transition:leave-end="layer-leave-end">
                <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 25px;">
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
                                        <span x-text="c.flag"></span>
                                        <span x-text="c.name"></span>
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
                                <div class="custom-select-option" @click="changeLanguage('zh-CN')">CN</div>
                            </div>
                        </div>
                    </div>
                </div>

                <div style="text-align: center; margin-bottom: 25px;">
                    <h2 class="form-title" x-text="t('payment_details')" style="margin-bottom: 5px;"></h2>
                </div>

                @if(($asaasPayment['billingType'] ?? 'PIX') === 'PIX')
                    <!-- PIX FLOW -->
                    <div class="pix-container">
                        <div class="pix-qr-box" style="border: 2px solid var(--primary); box-shadow: 0 0 20px rgba(124, 58, 237, 0.2);">
                            <img src="data:image/png;base64,{{ $pixData['encodedImage'] ?? '' }}" alt="QR Code PIX">
                        </div>
                        
                        <div style="display: flex; flex-direction: column; align-items: center; gap: 8px; margin-bottom: 25px; text-align: center;">
                            <div class="summary-label" style="font-size: 12px;" x-text="t('value')"></div>
                            <div style="font-size: 32px; font-weight: 900; color: #1e293b;" x-text="formatPrice(originalAmount)"></div>
                        </div>

                        <div class="pix-payload" id="pixPayload" style="text-align: left;">{{ $pixData['payload'] ?? '' }}</div>
                        
                        <button class="btn-pay" @click="copyPix()">
                            <i class="fas fa-copy"></i> <span x-text="t('copy_pix')"></span>
                        </button>
                        
                        <div style="margin-top: 20px; color: #64748b; font-size: 12px; display: flex; align-items: center; justify-content: center; gap: 8px;">
                            <i class="fas fa-check-circle" style="color: #10b981;"></i>
                            <span x-text="t('pix_auto')"></span>
                        </div>
                    </div>
                @else
                    <!-- CARD FLOW -->
                    <div class="card-scene" @click="isFlipped = !isFlipped">
                        <div class="card-inner" :class="{ 'is-flipped': isFlipped }">
                            <div class="card-face card-front">
                                <div class="card-chip"></div>
                                <div class="card-brand-logo default" x-show="cardBrand === 'default'">B</div>
                                <img src="https://raw.githubusercontent.com/aaronfagan/svg-credit-card-payment-icons/main/flat-rounded/visa.svg" class="card-brand-logo" :class="{ 'visible': cardBrand === 'visa' }" alt="Visa">
                                <img src="https://raw.githubusercontent.com/aaronfagan/svg-credit-card-payment-icons/main/flat-rounded/mastercard.svg" class="card-brand-logo" :class="{ 'visible': cardBrand === 'mastercard' }" alt="Mastercard">
                                
                                <div class="card-number-display" x-text="formatCardNumber(cardNumber)"></div>
                                <div class="card-bottom">
                                    <div>
                                        <div class="card-label" x-text="t('titular')"></div>
                                        <div class="card-value" x-text="cardHolder || 'NOME NO CARTÃO'"></div>
                                    </div>
                                    <div style="text-align: right;">
                                        <div class="card-label" x-text="t('validity')"></div>
                                        <div class="card-value" x-text="cardExpiry || 'MM/AA'"></div>
                                    </div>
                                </div>
                            </div>
                            <div class="card-face card-back">
                                <div class="card-magnetic-strip"></div>
                                <div class="card-cvv-strip" x-text="cardCvv || '•••'"></div>
                                <div style="padding: 20px; font-size: 10px; opacity: 0.5;" x-text="t('signature')"></div>
                            </div>
                        </div>
                    </div>

                    <div style="text-align: center; margin-bottom: 20px;">
                        <div class="summary-label" style="font-size: 12px;" x-text="t('value')"></div>
                        <div style="font-size: 32px; font-weight: 900; color: #1e293b;" x-text="formatPrice(originalAmount)"></div>
                    </div>

                    <form id="paymentForm" method="POST" action="{{ route('checkout.process', $transaction->uuid) }}">
                        @csrf
                        <div class="form-group">
                            <label class="form-label" x-text="t('card_number')"></label>
                            <input type="text" class="form-input" x-model="cardNumber" @input="updateCardNumber($event)" placeholder="0000 0000 0000 0000" maxlength="19" required>
                        </div>
                        <div class="form-row">
                            <div class="form-group">
                                <label class="form-label" x-text="t('expiry')"></label>
                                <input type="text" class="form-input" x-model="cardExpiry" @input="updateCardExpiry($event)" placeholder="MM/AA" maxlength="5" required>
                            </div>
                            <div class="form-group">
                                <label class="form-label" x-text="t('cvv')"></label>
                                <input type="text" class="form-input" x-model="cardCvv" @focus="isFlipped = true" @blur="isFlipped = false" placeholder="000" maxlength="4" required>
                            </div>
                        </div>
                        <div class="form-group">
                            <label class="form-label" x-text="t('holder_name')"></label>
                            <input type="text" class="form-input" x-model="cardHolder" placeholder="Como impresso no cartão" required>
                        </div>
                        <button type="button" class="btn-pay" @click.prevent="flipLayer(1, 2)">
                            <span x-text="t('subscribe')"></span> <i class="fas fa-arrow-right"></i>
                        </button>
                    </form>
                @endif
            </div>

            <!-- LAYER 2: CONFIRMATION -->
            <div class="layer" data-step="2" x-show="step === 2" 
                 x-transition:enter="layer-transition"
                 x-transition:enter-start="layer-enter-start"
                 x-transition:enter-end="layer-enter-end"
                 x-transition:leave="layer-transition"
                 x-transition:leave-start="layer-leave-start"
                 x-transition:leave-end="layer-leave-end"
                 x-cloak>
                <div style="margin-bottom: 25px;">
                    <div class="summary-label" style="font-size: 10px; margin-bottom: 4px;" x-text="t('expires_in')"></div>
                    <div style="font-size: 14px; font-weight: 800; background: #fef2f2; color: #dc2626; padding: 6px 12px; border-radius: 10px; display: inline-block; letter-spacing: 1px;" x-text="timeLeft"></div>
                </div>
                <h2 class="form-title" x-text="t('confirm_title')"></h2>
                <p class="form-subtitle" x-text="t('confirm_subtitle')"></p>

                <div class="form-group">
                    <label class="form-label" x-text="t('church_name')"></label>
                    <input type="text" class="form-input" x-model="vendorName" placeholder="Ex: Igreja Central">
                </div>
                <div class="form-group">
                    <label class="form-label" x-text="t('contact_email')"></label>
                    <input type="email" class="form-input" x-model="vendorEmail" placeholder="contato@igreja.com">
                </div>
                <div class="form-group">
                    <label class="form-label" x-text="t('document')"></label>
                    <input type="text" class="form-input" x-model="vendorDoc" placeholder="00.000.000/0001-00">
                </div>

                <form id="paymentForm" method="POST" action="{{ route('checkout.process', $transaction->uuid) }}">
                    @csrf
                    <input type="hidden" name="card_number" :value="cardNumber.replace(/\D/g, '')">
                    <input type="hidden" name="card_expiry" :value="cardExpiry">
                    <input type="hidden" name="card_cvv" :value="cardCvv">
                    <input type="hidden" name="card_name" :value="cardHolder">
                    <input type="hidden" name="customer_name" :value="vendorName">
                    <input type="hidden" name="customer_email" :value="vendorEmail">
                    <input type="hidden" name="customer_document" :value="vendorDoc">

                    <div style="background: #f0fdf4; border: 1px solid #dcfce7; padding: 15px; border-radius: 12px; margin-bottom: 20px;">
                        <p style="color: #166534; font-size: 13px; display: flex; gap: 8px;">
                            <i class="fas fa-info-circle" style="margin-top: 3px;"></i>
                            <span x-text="t('validating')"></span>
                        </p>
                    </div>

                    <button type="submit" class="btn-pay" :disabled="processing">
                        <template x-if="!processing">
                            <span><span x-text="t('confirm_finish')"></span> <i class="fas fa-check"></i></span>
                        </template>
                        <template x-if="processing">
                            <span><i class="fas fa-circle-notch fa-spin"></i> <span x-text="t('processing')"></span></span>
                        </template>
                    </button>
                    
                    <button type="button" class="btn-secondary" @click="flipLayer(2, 1)" style="margin-top: 10px; width: 100%;" x-show="!processing">
                        <i class="fas fa-arrow-left"></i> <span x-text="t('back')"></span>
                    </button>
                </form>
            </div>

            <!-- LAYER 3: SUCCESS -->
            <div class="layer" data-step="3" x-show="step === 3" 
                 x-transition:enter="layer-transition"
                 x-transition:enter-start="layer-enter-start"
                 x-transition:enter-end="layer-enter-end"
                 x-transition:leave="layer-transition"
                 x-transition:leave-start="layer-leave-start"
                 x-transition:leave-end="layer-leave-end"
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
    </script>
</body>
</html>
