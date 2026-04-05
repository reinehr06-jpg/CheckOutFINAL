@extends('dashboard.layouts.app')

@section('title', 'Editar Gateway: ' . $gateway->name)

@section('content')
<div class="page-header animate-up" style="animation-delay: 0.1s;">
    <div class="header-left">
        <a href="{{ route('dashboard.gateways.index') }}" class="btn btn-secondary btn-sm" style="margin-bottom: 10px;">
            <i class="fas fa-arrow-left"></i> Voltar
        </a>
        <h2>Editar Gateway: {{ $gateway->name }}</h2>
    </div>
</div>

<div class="card animate-up" style="animation-delay: 0.2s; max-width: 800px;">
    <form action="{{ route('dashboard.gateways.update', $gateway->id) }}" method="POST" class="settings-form">
        @csrf
        @method('PUT')
        
        <div class="form-group">
            <label for="name">Nome do Gateway</label>
            <input type="text" name="name" id="name" class="form-control" placeholder="Ex: Asaas Produção" required value="{{ old('name', $gateway->name) }}">
        </div>

        <div class="form-group">
            <label for="slug">Plataforma</label>
            <input type="text" id="platform" class="form-control" readonly value="{{ ucfirst($gateway->slug ?? 'Asaas') }}">
        </div>

        <div class="form-group">
            <label for="slug">Identificador (Slug)</label>
            <input type="text" name="slug" id="slug" class="form-control" readonly value="{{ $gateway->slug }}">
            <p class="form-help">O identificador não pode ser alterado após a criação.</p>
        </div>

        <div class="form-section">
            <h4>Configurações de API</h4>
            <div class="form-group">
                <label for="api_key">Nova API Key (Deixe vazio para manter a atual)</label>
                <input type="password" name="config[api_key]" id="api_key" class="form-control" placeholder="Clique para alterar a chave">
            </div>

            <div class="form-group">
                <label for="api_secret">Novo API Secret (Opcional)</label>
                <input type="password" name="config[api_secret]" id="api_secret" class="form-control" placeholder="Clique para alterar o segredo">
            </div>

            <div class="form-row">
                <div class="form-group">
                    <label class="checkbox-container">
                        <input type="checkbox" name="config[sandbox]" value="1" {{ old('config.sandbox', $gateway->config['sandbox'] ?? false) ? 'checked' : '' }}>
                        <span class="checkmark"></span>
                        Ambiente de Testes (Sandbox)
                    </label>
                </div>
            </div>
        </div>

        <div class="form-row">
            <div class="form-group">
                <label class="checkbox-container">
                    <input type="checkbox" name="is_default" value="1" {{ old('is_default', $gateway->is_default) ? 'checked' : '' }}>
                    <span class="checkmark"></span>
                    Definir como gateway padrão
                </label>
            </div>
            
            <div class="form-group">
                <label class="checkbox-container">
                    <input type="checkbox" name="is_active" value="1" {{ old('is_active', $gateway->is_active) ? 'checked' : '' }}>
                    <span class="checkmark"></span>
                    Gateway Ativo
                </label>
            </div>
        </div>

        <div class="form-actions">
            <button type="submit" class="btn btn-primary btn-lg">
                <i class="fas fa-save"></i> Salvar Alterações
            </button>
        </div>
    </form>
</div>
@endsection
