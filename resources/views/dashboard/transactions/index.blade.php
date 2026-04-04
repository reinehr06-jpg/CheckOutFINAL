@extends('dashboard.layouts.app')

@section('title', 'Transações')

@section('content')
<div class="page-header animate-up" style="animation-delay: 0.1s;">
    <h2>Transações</h2>
    <a href="{{ route('dashboard.transactions.export', request()->query()) }}" class="btn btn-primary">
        <i class="fas fa-download"></i> Exportar CSV
    </a>
</div>

<div class="filter-form animate-up" style="animation-delay: 0.2s;">
    <form method="GET" action="{{ route('dashboard.transactions') }}">
        <div class="filter-row">
            <div class="filter-group">
                <label>Status</label>
                <select name="status">
                    <option value="">Todos</option>
                    <option value="pending" {{ request('status') == 'pending' ? 'selected' : '' }}>Pendente</option>
                    <option value="approved" {{ request('status') == 'approved' ? 'selected' : '' }}>Aprovado</option>
                    <option value="refused" {{ request('status') == 'refused' ? 'selected' : '' }}>Recusado</option>
                    <option value="cancelled" {{ request('status') == 'cancelled' ? 'selected' : '' }}>Cancelado</option>
                    <option value="refunded" {{ request('status') == 'refunded' ? 'selected' : '' }}>Estornado</option>
                </select>
            </div>
            <div class="filter-group">
                <label>Data Início</label>
                <input type="date" name="date_from" value="{{ request('date_from') }}">
            </div>
            <div class="filter-group">
                <label>Data Fim</label>
                <input type="date" name="date_to" value="{{ request('date_to') }}">
            </div>
            <div class="filter-group">
                <label>Buscar</label>
                <input type="text" name="search" value="{{ request('search') }}" placeholder="UUID, cliente...">
            </div>
            <div class="filter-group">
                <label>Origem</label>
                <select name="source">
                    <option value="">Todas</option>
                    <option value="basileia_vendas" {{ request('source') == 'basileia_vendas' ? 'selected' : '' }}>Basileia Vendas</option>
                    <option value="eventos" {{ request('source') == 'eventos' ? 'selected' : '' }}>Eventos</option>
                    <option value="cursos" {{ request('source') == 'cursos' ? 'selected' : '' }}>Cursos</option>
                    <option value="site_contratacao" {{ request('source') == 'site_contratacao' ? 'selected' : '' }}>Site Contratação</option>
                    <option value="lancamento" {{ request('source') == 'lancamento' ? 'selected' : '' }}>Lançamento</option>
                </select>
            </div>
            <div class="filter-group">
                <label>Tipo Produto</label>
                <select name="product_type">
                    <option value="">Todos</option>
                    <option value="saas" {{ request('product_type') == 'saas' ? 'selected' : '' }}>SaaS</option>
                    <option value="evento" {{ request('product_type') == 'evento' ? 'selected' : '' }}>Evento</option>
                    <option value="curso" {{ request('product_type') == 'curso' ? 'selected' : '' }}>Curso</option>
                    <option value="lancamento" {{ request('product_type') == 'lancamento' ? 'selected' : '' }}>Lançamento</option>
                    <option value="outro" {{ request('product_type') == 'outro' ? 'selected' : '' }}>Outro</option>
                </select>
            </div>
            <div class="filter-actions">
                <button type="submit" class="btn btn-primary"><i class="fas fa-search"></i></button>
                <a href="{{ route('dashboard.transactions') }}" class="btn btn-secondary">Limpar</a>
            </div>
        </div>
    </form>
</div>

<div class="card animate-up" style="animation-delay: 0.3s;">
    <div class="table-wrapper">
        <table>
            <thead>
                <tr>
                    <th>UUID</th>
                    <th>Cliente</th>
                    <th>Valor</th>
                    <th>Origem</th>
                    <th>Tipo</th>
                    <th>Método</th>
                    <th>Status</th>
                    <th>Data</th>
                </tr>
            </thead>
            <tbody>
                @forelse($transactions as $tx)
                    <tr>
                        <td style="font-family: monospace; font-size: 0.8rem;">
                            <a href="{{ route('dashboard.transactions.show', $tx->id) }}" style="color: var(--primary); text-decoration: none; font-weight: 600;">
                                {{ Str::limit($tx->uuid, 12) }}
                            </a>
                        </td>
                        <td>{{ $tx->customer_name ?? ($tx->customer?->name ?? '-') }}</td>
                        <td style="font-weight: 700;">R$ {{ number_format($tx->amount, 2, ',', '.') }}</td>
                        <td>{{ $tx->source ?? '-' }}</td>
                        <td>
                            @php
                                $typeMap = [
                                    'saas' => 'SaaS',
                                    'evento' => 'Evento',
                                    'curso' => 'Curso',
                                    'lancamento' => 'Lançamento',
                                    'outro' => 'Outro',
                                ];
                                $t = $typeMap[$tx->product_type] ?? ($tx->product_type ?? '-');
                            @endphp
                            {{ $t }}
                        </td>
                        <td>{{ ucfirst(str_replace('_', ' ', $tx->payment_method ?? '-')) }}</td>
                        <td>
                            @php
                                $statusMap = [
                                    'approved' => ['badge-success', 'Aprovado'],
                                    'pending' => ['badge-warning', 'Pendente'],
                                    'refused' => ['badge-danger', 'Recusado'],
                                    'refunded' => ['badge-gray', 'Estornado'],
                                    'cancelled' => ['badge-gray', 'Cancelado'],
                                    'processing' => ['badge-primary', 'Processando'],
                                    'overdue' => ['badge-danger', 'Vencido'],
                                ];
                                $s = $statusMap[$tx->status] ?? ['badge-gray', ucfirst($tx->status)];
                            @endphp
                            <span class="badge {{ $s[0] }}">{{ $s[1] }}</span>
                        </td>
                        <td style="color: var(--text-muted);">{{ $tx->created_at?->format('d/m/Y H:i') ?? '-' }}</td>
                    </tr>
                @empty
                    <tr><td colspan="6" class="text-center" style="padding: 40px; color: var(--text-muted);">Nenhuma transação encontrada.</td></tr>
                @endforelse
            </tbody>
        </table>
    </div>
    @if(method_exists($transactions, 'links'))
        <div class="pagination">{{ $transactions->links() }}</div>
    @endif
</div>
@endsection
