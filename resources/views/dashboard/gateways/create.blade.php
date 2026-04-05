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

        <div class="form-group">
            <label class="checkbox-container">
                <input type="checkbox" name="is_default" value="1" {{ old('is_default') ? 'checked' : '' }}>
                <span class="checkmark"></span>
                Definir como gateway padrão
            </label>
        </div>

        <div class="form-actions">
            <button type="submit" class="btn btn-primary btn-lg">
                <i class="fas fa-save"></i> Salvar Gateway
            </button>
        </div>
    </form>
</div>
@endsection
