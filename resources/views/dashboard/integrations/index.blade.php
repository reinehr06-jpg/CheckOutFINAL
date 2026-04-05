@extends('dashboard.layouts.app')
@section('title', 'Integrações')

@section('content')
<div class="animate-up" style="animation-delay: 0.1s; margin-bottom: 24px; display: flex; align-items: center; justify-content: space-between;">
    <div>
        <h2 style="font-size: 1.25rem; font-weight: 900; color: var(--bg-sidebar);">Integrações</h2>
        <p style="font-size: 0.8rem; color: var(--text-muted);">Sistemas externos conectados ao Basileia Secure.</p>
    </div>
    <button onclick="document.getElementById('modal-create').classList.add('show')" class="btn" style="background: var(--primary); color: white; border: none; padding: 10px 20px; border-radius: 10px; font-weight: 800; font-size: 0.85rem; cursor: pointer; display: flex; align-items: center; gap: 10px;">
        <i class="fas fa-plus"></i> Nova Integração
    </button>
</div>

<div class="card animate-up" style="animation-delay: 0.2s; padding: 0; overflow: hidden;">
    <div class="table-wrapper">
        <table style="width: 100%; border-collapse: collapse;">
            <thead>
                <tr style="background: #f8fafc; border-bottom: 1px solid var(--border);">
                    <th style="padding: 16px 24px; text-align: left; font-size: 0.7rem; font-weight: 800; text-transform: uppercase; color: var(--text-muted); letter-spacing: 1px;">Nome</th>
                    <th style="padding: 16px 24px; text-align: left; font-size: 0.7rem; font-weight: 800; text-transform: uppercase; color: var(--text-muted); letter-spacing: 1px;">API Key Prefix</th>
                    <th style="padding: 16px 24px; text-align: left; font-size: 0.7rem; font-weight: 800; text-transform: uppercase; color: var(--text-muted); letter-spacing: 1px;">Status</th>
                    <th style="padding: 16px 24px; text-align: left; font-size: 0.7rem; font-weight: 800; text-transform: uppercase; color: var(--text-muted); letter-spacing: 1px;">Vendas</th>
                    <th style="padding: 16px 24px; text-align: right; font-size: 0.7rem; font-weight: 800; text-transform: uppercase; color: var(--text-muted); letter-spacing: 1px;">Ações</th>
                </tr>
            </thead>
            <tbody>
                @forelse($integrations as $int)
                    <tr style="border-bottom: 1px solid var(--border);">
                        <td style="padding: 16px 24px;">
                            <div style="font-weight: 700; color: var(--bg-sidebar); font-size: 0.95rem;">{{ $int->name }}</div>
                            <div style="font-size: 0.75rem; color: var(--text-muted);">{{ Str::limit($int->base_url, 30) }}</div>
                        </td>
                        <td style="padding: 16px 24px;">
                            <code style="font-family: monospace; font-size: 0.8rem; background: #f1f5f9; padding: 4px 8px; border-radius: 4px; color: #475569;">{{ $int->api_key_prefix }}...</code>
                        </td>
                        <td style="padding: 16px 24px;">
                            @if($int->status === 'active')
                                <span style="background: #ecfdf5; color: #10b981; padding: 4px 10px; border-radius: 6px; font-size: 0.7rem; font-weight: 800; text-transform: uppercase;">Ativa</span>
                            @else
                                <span style="background: #fef2f2; color: #ef4444; padding: 4px 10px; border-radius: 6px; font-size: 0.7rem; font-weight: 800; text-transform: uppercase;">Inativa</span>
                            @endif
                        </td>
                        <td style="padding: 16px 24px; font-weight: 700; color: var(--bg-sidebar);">
                            {{ number_format($int->transactions_count ?? 0) }}
                        </td>
                        <td style="padding: 16px 24px; text-align: right;">
                            <div style="display: flex; align-items: center; justify-content: flex-end; gap: 8px;">
                                <a href="{{ route('dashboard.integrations.show', $int->id) }}" style="background: var(--primary); color: white; padding: 6px 12px; border-radius: 8px; font-size: 0.75rem; font-weight: 800; text-decoration: none; display: flex; align-items: center; gap: 6px; transition: all 0.2s ease;">
                                    <i class="fas fa-cog"></i> Configurar
                                </a>
                                <form method="POST" action="{{ route('dashboard.integrations.toggle', $int->id) }}" style="display: inline;">
                                    @csrf
                                    <button type="submit" style="background: #f1f5f9; color: #475569; border: none; padding: 6px 12px; border-radius: 8px; font-size: 0.75rem; font-weight: 800; cursor: pointer; transition: all 0.2s ease;">
                                        {{ $int->status === 'active' ? 'Desativar' : 'Ativar' }}
                                    </button>
                                </form>
                            </div>
                        </td>
                    </tr>
                @empty
                    <tr>
                        <td colspan="5" style="padding: 60px 24px; text-align: center; color: var(--text-muted);">
                            <i class="fas fa-plug" style="font-size: 2rem; margin-bottom: 16px; opacity: 0.5; display: block;"></i>
                            Nenhuma integração cadastrada.
                        </td>
                    </tr>
                @endforelse
            </tbody>
        </table>
    </div>
</div>

<!-- Modal Create -->
<div id="modal-create" class="modal-overlay">
    <div class="modal-content animate-up" style="max-width: 500px;">
        <div class="modal-header" style="border-bottom: 1px solid var(--border); padding-bottom: 16px; margin-bottom: 24px;">
            <h3 style="font-size: 1.1rem; font-weight: 800; color: var(--bg-sidebar);">Nova Integração</h2>
            <button class="modal-close" onclick="document.getElementById('modal-create').classList.remove('show')" style="background: none; border: none; font-size: 1.5rem; color: var(--text-muted); cursor: pointer;">&times;</button>
        </div>
        <form method="POST" action="{{ route('dashboard.integrations.store') }}">
            @csrf
            <div style="display: grid; gap: 20px;">
                <div class="form-group">
                    <label style="display: block; font-size: 0.7rem; font-weight: 800; text-transform: uppercase; color: var(--text-muted); margin-bottom: 8px;">Nome do Sistema</label>
                    <input type="text" name="name" required placeholder="Ex: Basileia Vendas" style="width: 100%; box-sizing: border-box; padding: 12px 16px; border-radius: 10px; border: 1px solid var(--border); background: #f8fafc; font-size: 0.95rem;">
                </div>
                <div class="form-group">
                    <label style="display: block; font-size: 0.7rem; font-weight: 800; text-transform: uppercase; color: var(--text-muted); margin-bottom: 8px;">URL Base</label>
                    <input type="url" name="base_url" placeholder="https://seudominio.com" style="width: 100%; box-sizing: border-box; padding: 12px 16px; border-radius: 10px; border: 1px solid var(--border); background: #f8fafc; font-size: 0.95rem;">
                </div>
                <div style="display: flex; gap: 12px; justify-content: flex-end; margin-top: 10px;">
                    <button type="button" class="btn" onclick="document.getElementById('modal-create').classList.remove('show')" style="background: #f1f5f9; color: #475569; border: none; padding: 12px 24px; border-radius: 10px; font-weight: 800; font-size: 0.85rem; cursor: pointer;">Cancelar</button>
                    <button type="submit" class="btn" style="background: var(--primary); color: white; border: none; padding: 12px 24px; border-radius: 10px; font-weight: 800; font-size: 0.85rem; cursor: pointer;">Criar Integração</button>
                </div>
            </div>
        </form>
    </div>
</div>
@endsection
