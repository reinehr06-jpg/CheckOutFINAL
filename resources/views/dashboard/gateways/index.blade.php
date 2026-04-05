@extends('dashboard.layouts.app')
@section('title', 'Gateways de Pagamento')

@section('content')
<div class="animate-up" style="animation-delay: 0.1s; margin-bottom: 24px; display: flex; align-items: center; justify-content: space-between;">
    <div>
        <h2 style="font-size: 1.25rem; font-weight: 900; color: var(--bg-sidebar);">Gateways de Pagamento</h2>
        <p style="font-size: 0.8rem; color: var(--text-muted);">Gerencie seus provedores de pagamento globais.</p>
    </div>
    <a href="{{ route('dashboard.gateways.create') }}" class="btn" style="background: var(--primary); color: white; border: none; padding: 10px 20px; border-radius: 10px; font-weight: 800; font-size: 0.85rem; cursor: pointer; display: flex; align-items: center; gap: 10px;">
        <i class="fas fa-plus"></i> Novo Gateway
    </a>
</div>

<div class="card animate-up" style="animation-delay: 0.2s; padding: 0; overflow: hidden;">
    <div class="table-wrapper">
        <table style="width: 100%; border-collapse: collapse;">
            <thead>
                <tr style="background: #f8fafc; border-bottom: 1px solid var(--border);">
                    <th style="padding: 16px 24px; text-align: left; font-size: 0.7rem; font-weight: 800; text-transform: uppercase; color: var(--text-muted); letter-spacing: 1px;">Nome</th>
                    <th style="padding: 16px 24px; text-align: left; font-size: 0.7rem; font-weight: 800; text-transform: uppercase; color: var(--text-muted); letter-spacing: 1px;">Tipo</th>
                    <th style="padding: 16px 24px; text-align: left; font-size: 0.7rem; font-weight: 800; text-transform: uppercase; color: var(--text-muted); letter-spacing: 1px;">Status</th>
                    <th style="padding: 16px 24px; text-align: left; font-size: 0.7rem; font-weight: 800; text-transform: uppercase; color: var(--text-muted); letter-spacing: 1px;">Padrão</th>
                    <th style="padding: 16px 24px; text-align: right; font-size: 0.7rem; font-weight: 800; text-transform: uppercase; color: var(--text-muted); letter-spacing: 1px;">Ações</th>
                </tr>
            </thead>
            <tbody>
                @forelse($gateways as $gw)
                    <tr style="border-bottom: 1px solid var(--border); transition: background 0.2s ease;">
                        <td style="padding: 16px 24px;">
                            <div style="font-weight: 700; color: var(--bg-sidebar); font-size: 0.95rem;">{{ $gw->name }}</div>
                            <div style="font-size: 0.75rem; color: var(--text-muted);">{{ $gw->identifier ?? 'Custom' }}</div>
                        </td>
                        <td style="padding: 16px 24px;">
                            <span style="background: rgba(124, 58, 237, 0.1); color: var(--primary); padding: 4px 10px; border-radius: 6px; font-size: 0.7rem; font-weight: 800; text-transform: uppercase;">
                                {{ ucfirst($gw->type ?? 'Global') }}
                            </span>
                        </td>
                        <td style="padding: 16px 24px;">
                            @if($gw->status === 'active')
                                <span style="background: #ecfdf5; color: #10b981; padding: 4px 10px; border-radius: 6px; font-size: 0.7rem; font-weight: 800; text-transform: uppercase;">Ativo</span>
                            @else
                                <span style="background: #fef2f2; color: #ef4444; padding: 4px 10px; border-radius: 6px; font-size: 0.7rem; font-weight: 800; text-transform: uppercase;">Inativo</span>
                            @endif
                        </td>
                        <td style="padding: 16px 24px;">
                            @if($gw->is_default)
                                <span style="color: var(--primary); font-size: 0.9rem;"><i class="fas fa-star" title="Gateway Padrão"></i></span>
                            @else
                                <span style="color: #cbd5e1; font-size: 0.9rem;"><i class="far fa-star"></i></span>
                            @endif
                        </td>
                        <td style="padding: 16px 24px; text-align: right;">
                            <div style="display: flex; align-items: center; justify-content: flex-end; gap: 8px;">
                                <a href="{{ route('dashboard.gateways.edit', $gw->id) }}" style="background: #f1f5f9; color: #475569; width: 32px; height: 32px; border-radius: 8px; display: flex; align-items: center; justify-content: center; text-decoration: none; transition: all 0.2s ease;" title="Configurar">
                                    <i class="fas fa-cog" style="font-size: 0.85rem;"></i>
                                </a>
                                <form method="POST" action="{{ route('dashboard.gateways.toggle', $gw->id) }}" style="display: inline;">
                                    @csrf
                                    <button type="submit" style="background: {{ $gw->status === 'active' ? '#fef2f2' : 'rgba(124, 58, 237, 0.1)' }}; color: {{ $gw->status === 'active' ? '#ef4444' : 'var(--primary)' }}; border: none; padding: 6px 12px; border-radius: 8px; font-size: 0.75rem; font-weight: 800; cursor: pointer; transition: all 0.2s ease;">
                                        {{ $gw->status === 'active' ? 'Desativar' : 'Ativar' }}
                                    </button>
                                </form>
                            </div>
                        </td>
                    </tr>
                @empty
                    <tr>
                        <td colspan="5" style="padding: 60px 24px; text-align: center; color: var(--text-muted);">
                            <i class="fas fa-wallet" style="font-size: 2rem; margin-bottom: 16px; opacity: 0.5; display: block;"></i>
                            Nenhum gateway configurado ainda.
                        </td>
                    </tr>
                @endforelse
            </tbody>
        </table>
    </div>
</div>
@endsection
