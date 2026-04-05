@extends('dashboard.layouts.app')
@section('title', 'Configuração de Integração')

@section('content')
<div class="animate-up" style="max-width: 800px; margin: 0 auto;">
    
    <!-- API Key Header Card -->
    <div class="card" style="padding: 24px; margin-bottom: 24px; border-left: 4px solid var(--primary);">
        <div style="display: flex; align-items: center; justify-content: space-between; margin-bottom: 20px;">
            <h3 style="font-size: 1.1rem; font-weight: 800; color: var(--bg-sidebar);">API Key</h3>
            <span class="badge badge-success">Ativa</span>
        </div>
        
        <div style="background: #f8fafc; padding: 15px; border-radius: 10px; border: 1px solid var(--border); display: flex; align-items: center; justify-content: space-between; margin-bottom: 12px;">
            <code style="font-family: 'JetBrains Mono', monospace; font-size: 1rem; color: #475569; letter-spacing: 1px;">
                {{ $integration->api_key_prefix }}••••••••••••••••••••••••••••
            </code>
            <form action="{{ route('dashboard.integrations.regenerate-key', $integration->id) }}" method="POST">
                @csrf
                <button type="submit" class="btn-action" style="background: var(--primary); color: white; padding: 8px 16px; font-size: 0.75rem; border-radius: 8px; border: none; font-weight: 700; cursor: pointer;">
                    <i class="fas fa-sync-alt" style="margin-right: 8px;"></i>Regenerar API Key
                </button>
            </form>
        </div>
        <p style="font-size: 0.75rem; color: var(--text-muted);">Use no header: <code style="color: var(--primary);">Authorization: Bearer ck_live_...</code></p>
    </div>

    <!-- Main Configuration Form -->
    <div class="card" style="padding: 30px;">
        <h3 style="font-size: 1.1rem; font-weight: 800; color: var(--bg-sidebar); margin-bottom: 24px;">Configuração</h3>

        <form action="{{ route('dashboard.integrations.update', $integration->id) }}" method="POST">
            @csrf
            @method('PUT')

            <div style="display: grid; gap: 20px;">
                
                <!-- Nome -->
                <div class="form-group">
                    <label style="display: block; font-size: 0.75rem; font-weight: 800; text-transform: uppercase; color: var(--text-muted); margin-bottom: 8px;">Nome</label>
                    <input type="text" name="name" class="form-control" value="{{ $integration->name }}" placeholder="Ex: Basileia Vendas" style="width: 100%; padding: 12px 16px; border-radius: 10px; border: 1px solid var(--border); background: #f8fafc; font-size: 0.95rem;">
                </div>

                <!-- URL Base -->
                <div class="form-group">
                    <label style="display: block; font-size: 0.75rem; font-weight: 800; text-transform: uppercase; color: var(--text-muted); margin-bottom: 8px;">URL Base</label>
                    <input type="url" name="base_url" class="form-control" value="{{ $integration->base_url }}" placeholder="https://seu-vendas.com" style="width: 100%; padding: 12px 16px; border-radius: 10px; border: 1px solid var(--border); background: #f8fafc; font-size: 0.95rem;">
                    <p style="font-size: 0.7rem; color: var(--text-muted); mt: 1">O endereço principal do seu sistema externo.</p>
                </div>

                <hr style="border: 0; border-top: 1px solid var(--border); margin: 10px 0;">

                <!-- Webhook URL -->
                <div class="form-group">
                    <label style="display: block; font-size: 0.75rem; font-weight: 800; text-transform: uppercase; color: var(--text-muted); margin-bottom: 8px;">Webhook URL</label>
                    <input type="url" name="webhook_url" class="form-control" value="{{ $integration->webhook_url }}" placeholder="https://seu-vendas.com/api/webhook" style="width: 100%; padding: 12px 16px; border-radius: 10px; border: 1px solid var(--border); background: #f8fafc; font-size: 0.95rem;">
                    <p style="font-size: 0.7rem; color: var(--text-muted); mt: 1">URL do Vendas para onde o Checkout enviará notificações de pagamento.</p>
                </div>

                <!-- Webhook Secret -->
                <div class="form-group">
                    <label style="display: block; font-size: 0.75rem; font-weight: 800; text-transform: uppercase; color: var(--text-muted); margin-bottom: 8px;">Webhook Secret</label>
                    <input type="text" name="webhook_secret" class="form-control" value="{{ $integration->webhook_secret }}" placeholder="whsec_..." style="width: 100%; padding: 12px 16px; border-radius: 10px; border: 1px solid var(--border); background: #f8fafc; font-size: 0.95rem; font-family: monospace;">
                    <p style="font-size: 0.7rem; color: var(--text-muted); mt: 1">Secret gerado pelo Vendas. O Checkout usa essa chave para assinar as requisições.</p>
                </div>

                <div style="margin-top: 10px;">
                    <button type="submit" class="btn" style="background: var(--primary); color: white; border: none; padding: 14px 24px; border-radius: 10px; font-weight: 800; font-size: 0.9rem; cursor: pointer; transition: all 0.2s ease;">
                        Salvar Configuração
                    </button>
                </div>
            </div>
        </form>
    </div>
</div>
@endsection
