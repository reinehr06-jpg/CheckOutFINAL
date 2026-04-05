@extends('dashboard.layouts.app')

@section('title', 'Novo Gateway')

@section('content')
<div class="page-header animate-up" style="animation-delay: 0.1s;">
    <div class="header-left">
        <a href="{{ route('dashboard.gateways.index') }}" class="btn btn-secondary btn-sm" style="margin-bottom: 10px;">
            <i class="fas fa-arrow-left"></i> Voltar
        </a>
        <h2>Novo Gateway de Pagamento</h2>
    </div>
</div>

<div class="card animate-up" style="animation-delay: 0.2s; max-width: 800px;">
    <form action="{{ route('dashboard.gateways.store') }}" method="POST" class="settings-form">
        @csrf
        
        <div class="form-group">
            <label for="name">Nome do Gateway</label>
            <input type="text" name="name" id="name" class="form-control" placeholder="Ex: Asaas Produção" required value="{{ old('name') }}">
            <p class="form-help">Um nome interno para você identificar este gateway.</p>
        </div>

        <div class="form-group">
            <label for="slug">Plataforma (Tipo)</label>
            <select name="slug" id="slug" class="form-control" required>
                <option value="adyen">Adyen</option>
                <option value="airwallex">Airwallex</option>
                <option value="asaas">Asaas (Brasil)</option>
                <option value="authorizenet">Authorize.net</option>
                <option value="bluesnap">BlueSnap</option>
                <option value="braintree">Braintree</option>
                <option value="checkoutcom">Checkout.com</option>
                <option value="custom">Custom (Personalizado)</option>
                <option value="flutterwave">Flutterwave</option>
                <option value="klarna">Klarna</option>
                <option value="mercadopago">Mercado Pago</option>
                <option value="mollie">Mollie</option>
                <option value="pagseguro">PagSeguro</option>
                <option value="paypal">PayPal</option>
                <option value="payoneer">Payoneer</option>
                <option value="rapyd">Rapyd</option>
                <option value="razorpay">Razorpay</option>
                <option value="skrill">Skrill</option>
                <option value="square">Square</option>
                <option value="stripe">Stripe (Global)</option>
                <option value="verifone">Verifone (2Checkout)</option>
                <option value="worldpay">Worldpay</option>
            </select>
            <p class="form-help">Escolha a plataforma de pagamento para ativação imediata.</p>
        </div>

        <div class="form-section">
            <h4>Configurações de API</h4>
            <div class="form-group">
                <label for="api_key">API Key</label>
                <input type="password" name="config[api_key]" id="api_key" class="form-control" placeholder="Insira sua chave de API" required>
            </div>

            <div class="form-group">
                <label for="api_secret">API Secret (Opcional)</label>
                <input type="password" name="config[api_secret]" id="api_secret" class="form-control" placeholder="Insira o segredo da API se necessário">
            </div>

            <div class="form-row">
                <div class="form-group">
                    <label class="checkbox-container">
                        <input type="checkbox" name="config[sandbox]" value="1" {{ old('config.sandbox') ? 'checked' : '' }}>
                        <span class="checkmark"></span>
                        Ambiente de Testes (Sandbox)
                    </label>
                </div>
            </div>
        </div>

        <div class="form-section" id="webhook-section" style="display: none; margin-top: 24px; padding: 24px; background: rgba(124, 58, 237, 0.03); border: 1px dashed var(--primary); border-radius: 16px;">
            <h4 style="color: var(--primary); margin-bottom: 16px; display: flex; align-items: center; gap: 10px;">
                <i class="fas fa-tower-broadcast"></i> Configuração de Webhook
            </h4>
            
            <div class="form-group">
                <label>URL de Notificação (Endpoint)</label>
                <div style="display: flex; gap: 8px;">
                    <input type="text" id="webhook-url-display" class="form-control" readonly style="background: #f1f5f9; cursor: default; font-family: monospace; font-size: 0.8rem; flex: 1;">
                    <button type="button" onclick="copyWebhookUrl()" class="btn" style="background: var(--bg-sidebar); color: white; padding: 0 16px; border-radius: 10px; font-size: 0.75rem; font-weight: 800;">
                       <i class="fas fa-copy"></i> COPIAR
                    </button>
                </div>
                <p class="form-help">Cole esta URL nas configurações de Webhook do seu painel Asaas.</p>
            </div>

            <div class="form-group">
                <label for="webhook_token">API Secret / Webhook Token</label>
                <input type="password" name="config[webhook_token]" id="webhook_token" class="form-control" placeholder="Token gerado pelo gateway">
                <p class="form-help">Utilizado para validar a autenticidade das notificações recebidas.</p>
            </div>
        </div>

        <div class="form-group" style="margin-top: 24px;">
            <label class="checkbox-container">
                <input type="checkbox" name="is_default" value="1" {{ old('is_default') ? 'checked' : '' }}>
                <span class="checkmark"></span>
                Definir como gateway padrão
            </label>
        </div>
@push('scripts')
<script>
    const slugSelect = document.getElementById('slug');
    const webhookSection = document.getElementById('webhook-section');
    const webhookUrlDisplay = document.getElementById('webhook-url-display');
    const baseUrl = "{{ url('/api/webhooks/gateway') }}";

    function updateWebhookSection() {
        const val = slugSelect.value;
        if (['asaas', 'stripe', 'pagseguro'].includes(val)) {
            webhookSection.style.display = 'block';
            webhookUrlDisplay.value = `${baseUrl}/${val}`;
        } else {
            webhookSection.style.display = 'none';
        }
    }

    slugSelect.addEventListener('change', updateWebhookSection);
    updateWebhookSection(); // Initial state

    function copyWebhookUrl() {
        webhookUrlDisplay.select();
        document.execCommand('copy');
        
        const btn = event.currentTarget;
        const originalText = btn.innerHTML;
        btn.innerHTML = '<i class="fas fa-check"></i> COPIADO!';
        btn.style.background = '#10b981';
        
        setTimeout(() => {
            btn.innerHTML = originalText;
            btn.style.background = 'var(--bg-sidebar)';
        }, 2000);
    }
</script>
@endpush

        <div class="form-actions">
            <button type="submit" class="btn btn-primary btn-lg">
                <i class="fas fa-save"></i> Salvar Gateway
            </button>
        </div>
    </form>
</div>
@endsection
