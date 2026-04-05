@extends('dashboard.layouts.app')
@section('title', 'Dashboard')

@section('content')
<div class="animate-up" style="animation-delay: 0.1s; margin-bottom: 20px;">
    <div style="display: flex; align-items: center; justify-content: space-between;">
        <div>
            <h1 style="font-size: 1.25rem; font-weight: 900; color: var(--text-primary); letter-spacing: -0.5px;">Olá, {{ Auth::user()->name ?? 'Admin' }} 👋</h1>
            <p style="font-size: 0.8rem; color: var(--text-muted);">Resultados consolidados de {{ now()->translatedFormat('F Y') }}.</p>
        </div>
        <div class="topbar-user" style="background: var(--success-bg); color: var(--success); border: 1px solid rgba(16, 185, 129, 0.1);">
            <i class="fas fa-check-circle" style="margin-right: 8px;"></i>
            Sistema Operacional
        </div>
    </div>
</div>

<div class="kpi-grid">
    <!-- Volume Transacionado -->
    <div class="kpi-card animate-up" style="animation-delay: 0.2s;">
        <i class="fas fa-money-bill-trend-up kpi-icon"></i>
        <span class="label">Volume Mensal</span>
        <div class="value" style="font-size: 1.3rem;">R$ {{ number_format($volumeMonth ?? 0, 2, ',', '.') }}</div>
        <div style="font-size: 0.7rem; color: var(--success); font-weight: 700; margin-top: 2px;">
            <i class="fas fa-arrow-trend-up"></i> {{ number_format(abs($volumeTrend ?? 0), 1) }}% <span style="color: var(--text-muted); font-weight: 500;">vs mês ant.</span>
        </div>
    </div>

    <!-- Taxa de Aprovação -->
    <div class="kpi-card animate-up" style="animation-delay: 0.3s; border-left: 3px solid var(--success);">
        <i class="fas fa-chart-line kpi-icon"></i>
        <span class="label">Taxa Aprovação</span>
        <div class="value" style="font-size: 1.3rem;">{{ number_format($approvalRate ?? 0, 1) }}%</div>
        <div style="font-size: 0.7rem; color: var(--text-muted); margin-top: 2px;">
            {{ $approvedCount ?? 0 }} transações aprovadas
        </div>
    </div>

    <!-- Integrações -->
    <div class="kpi-card animate-up" style="animation-delay: 0.4s;">
        <i class="fas fa-plug kpi-icon"></i>
        <span class="label">Conexões</span>
        <div class="value" style="font-size: 1.3rem;">{{ $activeIntegrations ?? 0 }}</div>
        <div style="font-size: 0.7rem; color: var(--text-muted); margin-top: 2px;">
            {{ $totalIntegrations ?? 0 }} sistemas cadastrados
        </div>
    </div>

    <!-- Webhooks -->
    <div class="kpi-card animate-up" style="animation-delay: 0.5s; border-left: 3px solid var(--primary-light);">
        <i class="fas fa-bolt kpi-icon"></i>
        <span class="label">Saúde API</span>
        <div class="value" style="font-size: 1.3rem; color: var(--primary);">{{ number_format($webhookDelivered ?? 0) }}</div>
        <div style="font-size: 0.7rem; color: {{ ($webhookFailed ?? 0) > 0 ? 'var(--danger)' : 'var(--success)' }}; font-weight: 700; margin-top: 2px;">
            @if(($webhookFailed ?? 0) > 0)
                {{ $webhookFailed }} falhas detectadas
            @else
                Integridade Garantida (100%)
            @endif
        </div>
    </div>
</div>

<div style="display: grid; grid-template-columns: 2fr 1.2fr; gap: 20px; margin-bottom: 20px;">
    <!-- Gráfico de Volume -->
    <div class="card animate-up" style="animation-delay: 0.6s; padding: 15px;">
        <div style="display: flex; align-items: center; justify-content: space-between; margin-bottom: 12px;">
            <h3 style="font-size: 0.9rem; font-weight: 800;">Volume 7 Dias</h3>
            <span class="badge badge-primary" style="font-size: 0.6rem;">Tempo Real</span>
        </div>
        <canvas id="volumeChart" style="height: 180px;"></canvas>
    </div>

    <!-- Insights Rápidos -->
    <div class="card animate-up" style="animation-delay: 0.7s; padding: 15px;">
        <h3 style="font-size: 0.9rem; font-weight: 800; margin-bottom: 12px;">Fluxo de Hoje</h3>
        
        <div style="display: flex; flex-direction: column; gap: 10px;">
            <div style="background: var(--bg-main); padding: 8px 12px; border-radius: 8px; border: 1px solid var(--border);">
                <div style="font-size: 0.65rem; text-transform: uppercase; color: var(--text-muted); font-weight: 800;">Processado</div>
                <div style="font-size: 1rem; font-weight: 900; color: var(--text-primary);">R$ {{ number_format($todayVolume ?? 0, 2, ',', '.') }}</div>
            </div>
            
            <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 10px;">
                <div style="background: var(--bg-main); padding: 8px 12px; border-radius: 8px; border: 1px solid var(--border);">
                    <div style="font-size: 0.65rem; text-transform: uppercase; color: var(--text-muted); font-weight: 800;">Vendas</div>
                    <div style="font-size: 0.9rem; font-weight: 900;">{{ number_format($todayTransactions ?? 0) }}</div>
                </div>
                <div style="background: var(--bg-main); padding: 8px 12px; border-radius: 8px; border: 1px solid var(--border);">
                    <div style="font-size: 0.65rem; text-transform: uppercase; color: var(--text-muted); font-weight: 800;">Gateway</div>
                    <div style="font-size: 0.9rem; font-weight: 900; color: var(--primary);">Stripe</div>
                </div>
            </div>

            <div style="background: var(--warning-bg); padding: 8px 12px; border-radius: 8px; border: 1px solid rgba(245, 158, 11, 0.1);">
                <div style="display: flex; align-items: center; justify-content: space-between;">
                    <span style="font-size: 0.65rem; text-transform: uppercase; color: #b45309; font-weight: 800;">Aguardando</span>
                    <i class="fas fa-clock" style="font-size: 0.7rem; color: #b45309;"></i>
                </div>
                <div style="font-size: 0.9rem; font-weight: 900; color: #b45309;">{{ $pendingTransactions ?? 0 }} Pendentes</div>
            </div>
        </div>
    </div>
</div>
@endif
    </div>
</div>

<div style="margin-top: 25px;">
    <!-- Transações Recentes -->
    <div class="card animate-up" style="animation-delay: 0.8s;">
        <div class="card-header">
            <h3>Transações Recentes</h3>
            <a href="{{ route('dashboard.transactions') }}" style="font-size: 0.85rem; color: var(--primary); text-decoration: none; font-weight: 600;">Ver todas <i class="fas fa-arrow-right" style="font-size: 0.7rem;"></i></a>
        </div>
        <div class="table-wrapper">
            <table>
                <thead>
                    <tr>
                        <th>UUID</th>
                        <th>Cliente</th>
                        <th>Valor</th>
                        <th>Método</th>
                        <th>Status</th>
                        <th>Data</th>
                    </tr>
                </thead>
                <tbody>
                    @forelse($recentTransactions ?? [] as $tx)
                        <tr>
                            <td style="font-family: monospace; font-size: 0.8rem;">
                                <a href="{{ route('dashboard.transactions.show', $tx->uuid) }}" style="color: var(--primary); text-decoration: none;">
                                    {{ Str::limit($tx->uuid, 12) }}
                                </a>
                            </td>
                            <td>{{ $tx->customer_name ?? '-' }}</td>
                            <td style="font-weight: 600;">R$ {{ number_format($tx->amount, 2, ',', '.') }}</td>
                            <td>{{ ucfirst(str_replace('_', ' ', $tx->payment_method ?? '-')) }}</td>
                            <td>
                                @php
                                    $statusColors = [
                                        'approved' => 'badge-success',
                                        'pending'  => 'badge-warning',
                                        'refused'  => 'badge-danger',
                                        'refunded' => 'badge-gray',
                                        'cancelled'=> 'badge-gray',
                                        'processing'=> 'badge-primary',
                                        'overdue'  => 'badge-danger',
                                    ];
                                    $statusLabels = [
                                        'approved' => 'Aprovado',
                                        'pending'  => 'Pendente',
                                        'refused'  => 'Recusado',
                                        'refunded' => 'Estornado',
                                        'cancelled'=> 'Cancelado',
                                        'processing'=> 'Processando',
                                        'overdue'  => 'Vencido',
                                    ];
                                    $cls = $statusColors[$tx->status] ?? 'badge-gray';
                                    $lbl = $statusLabels[$tx->status] ?? ucfirst($tx->status);
                                @endphp
                                <span class="badge {{ $cls }}">{{ $lbl }}</span>
                            </td>
                            <td style="color: var(--text-muted);">{{ $tx->created_at?->format('d/m/Y H:i') ?? '-' }}</td>
                        </tr>
                    @empty
                        <tr><td colspan="6" style="text-align: center; padding: 40px; color: var(--text-muted);">Nenhuma transação recente.</td></tr>
                    @endforelse
                </tbody>
            </table>
        </div>
    </div>
</div>
@endsection

@section('scripts')
<script>
    document.addEventListener('DOMContentLoaded', function() {
        const ctx = document.getElementById('volumeChart');
        if (!ctx) return;

        const labels = @json($dailyLabels ?? []);
        const data = @json($dailyVolumes ?? []);

        const gradient = ctx.getContext('2d').createLinearGradient(0, 0, 0, 400);
        gradient.addColorStop(0, 'rgba(76, 29, 149, 0.2)');
        gradient.addColorStop(1, 'rgba(76, 29, 149, 0)');

        new Chart(ctx, {
            type: 'line',
            data: {
                labels: labels.length ? labels : ['Seg', 'Ter', 'Qua', 'Qui', 'Sex', 'Sáb', 'Dom'],
                datasets: [{
                    label: 'Volume (R$)',
                    data: data.length ? data : [0, 0, 0, 0, 0, 0, 0],
                    borderColor: '#4C1D95',
                    borderWidth: 3,
                    backgroundColor: gradient,
                    fill: true,
                    tension: 0.4,
                    pointRadius: 4,
                    pointBackgroundColor: '#fff',
                    pointBorderColor: '#4C1D95',
                    pointBorderWidth: 2
                }]
            },
            options: {
                responsive: true,
                maintainAspectRatio: false,
                plugins: {
                    legend: { display: false }
                },
                scales: {
                    y: {
                        beginAtZero: true,
                        grid: { borderDash: [5, 5], color: '#f1f5f9' },
                        ticks: {
                            color: '#64748b',
                            font: { size: 11 },
                            callback: function(value) { return 'R$ ' + value.toLocaleString('pt-BR'); }
                        }
                    },
                    x: {
                        grid: { display: false },
                        ticks: { color: '#64748b', font: { size: 11 } }
                    }
                }
            }
        });
    });
</script>
@endsection
