@extends('dashboard.layouts.app')
@section('title', 'Integrações')

@section('header_actions')
    <button onclick="toggleDrawer('drawer-create', true)" class="btn" style="background: rgba(255,255,255,0.2); color: white; border: 1px solid rgba(255,255,255,0.3); padding: 8px 16px; border-radius: 10px; font-weight: 800; font-size: 0.75rem; cursor: pointer; display: flex; align-items: center; gap: 8px;">
        <i class="fas fa-plus"></i> NOVA CONEXÃO ELITE
    </button>
@endsection

@section('content')
<!-- Metric Bar -->
<div class="kpi-grid" style="margin-bottom: 24px;">
    <div class="kpi-card animate-up" style="animation-delay: 0.1s;">
        <div class="label">Sistemas Conectados</div>
        <div class="value">{{ $integrations->count() }}</div>
        <i class="fas fa-plug kpi-icon"></i>
    </div>
    <div class="kpi-card animate-up" style="animation-delay: 0.2s; border-left: 3px solid var(--success);">
        <div class="label">Integrações Ativas</div>
        <div class="value">{{ $integrations->where('status', 'active')->count() }}</div>
        <i class="fas fa-check-circle kpi-icon"></i>
    </div>
    <div class="kpi-card animate-up" style="animation-delay: 0.3s;">
        <div class="label">Vendas Processadas</div>
        <div class="value">{{ number_format($integrations->sum('transactions_count')) }}</div>
        <i class="fas fa-exchange-alt kpi-icon"></i>
    </div>
    <div class="kpi-card animate-up" style="animation-delay: 0.4s; border-left: 3px solid var(--primary-light);">
        <div class="label">Saúde das APIs</div>
        <div class="value">100%</div>
        <i class="fas fa-heartbeat kpi-icon"></i>
    </div>
</div>

<!-- Filter Bar Elite -->
<div class="card animate-up" style="padding: 12px 20px; margin-bottom: 24px; border-radius: 16px; display: flex; align-items: center; justify-content: space-between; background: #fff; border: 1px solid var(--border);">
    <div style="display: flex; align-items: center; gap: 15px;">
        <div style="font-size: 0.7rem; font-weight: 900; color: var(--text-muted); text-transform: uppercase; letter-spacing: 0.5px;">Filtrar por:</div>
        <div style="position: relative;">
            <select style="appearance: none; background: #f8fafc; border: 1px solid var(--border); padding: 8px 36px 8px 16px; border-radius: 10px; font-size: 0.8rem; font-weight: 700; color: var(--text-primary); cursor: pointer; min-width: 180px;">
                <option>Todos os Status</option>
                <option>Ativos</option>
                <option>Pausados</option>
            </select>
            <i class="fas fa-chevron-down" style="position: absolute; right: 12px; top: 50%; transform: translateY(-50%); font-size: 0.6rem; color: var(--text-muted); pointer-events: none;"></i>
        </div>
        <div style="position: relative;">
            <input type="text" placeholder="Buscar sistema..." style="background: #f8fafc; border: 1px solid var(--border); padding: 8px 16px; border-radius: 10px; font-size: 0.8rem; font-weight: 600; min-width: 240px;">
        </div>
    </div>
    <div style="display: flex; align-items: center; gap: 12px;">
        <span style="font-size: 0.75rem; color: var(--text-muted); font-weight: 600;">Exibindo {{ $integrations->count() }} resultados</span>
        <button class="btn" style="background: #f1f5f9; color: #475569; border: none; padding: 10px; border-radius: 10px; cursor: pointer;"><i class="fas fa-sync-alt"></i></button>
    </div>
</div>

<!-- Grid List -->
<div style="display: grid; grid-template-columns: repeat(auto-fill, minmax(400px, 1fr)); gap: 24px;">
    @forelse($integrations as $int)
        <div class="card animate-up" style="padding: 24px; border-radius: 20px; transition: all 0.3s ease; position: relative; overflow: hidden; display: flex; flex-direction: column; justify-content: space-between; min-height: 220px; box-shadow: var(--shadow-sm); border: 1px solid var(--border);">
            <div style="position: absolute; top: 0; right: 0; padding: 16px;">
                @if($int->status === 'active')
                    <span style="background: #ecfdf5; color: #10b981; padding: 6px 12px; border-radius: 8px; font-size: 0.65rem; font-weight: 900; text-transform: uppercase; letter-spacing: 0.5px;">Ativo</span>
                @else
                    <span style="background: #fef2f2; color: #ef4444; padding: 6px 12px; border-radius: 8px; font-size: 0.65rem; font-weight: 900; text-transform: uppercase; letter-spacing: 0.5px;">Pausado</span>
                @endif
            </div>

            <div>
                <div style="display: flex; align-items: center; gap: 15px; margin-bottom: 20px;">
                    <div style="width: 52px; height: 52px; background: rgba(124, 58, 237, 0.08); color: var(--primary); border-radius: 14px; display: flex; align-items: center; justify-content: center; font-size: 1.4rem; border: 1px solid rgba(124, 58, 237, 0.1);">
                        <i class="fas fa-plug"></i>
                    </div>
                    <div>
                        <h3 style="font-size: 1.15rem; font-weight: 900; color: var(--bg-sidebar); margin-bottom: 2px;">{{ $int->name }}</h3>
                        <div style="display: flex; align-items: center; gap: 6px;">
                             <i class="fas fa-link" style="font-size: 0.65rem; color: var(--text-muted);"></i>
                             <p style="font-size: 0.75rem; color: var(--text-muted); font-weight: 600;">{{ Str::limit($int->base_url, 35) }}</p>
                        </div>
                    </div>
                </div>
                
                <div style="background: #f8fafc; padding: 14px; border-radius: 14px; margin-bottom: 20px; border: 1px solid var(--border-light);">
                    <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 10px;">
                        <span style="font-size: 0.7rem; font-weight: 800; text-transform: uppercase; color: #64748b; letter-spacing: 0.5px;">Chave de Acesso</span>
                        <code style="font-size: 0.85rem; font-weight: 800; color: var(--primary); background: #fff; padding: 2px 8px; border-radius: 6px; border: 1px solid var(--border);">{{ $int->api_key_prefix }}...</code>
                    </div>
                    <div style="display: flex; justify-content: space-between; align-items: center;">
                        <div style="display: flex; align-items: center; gap: 6px;">
                            <span style="font-size: 0.7rem; font-weight: 800; text-transform: uppercase; color: #64748b; letter-spacing: 0.5px;">Performance</span>
                            <i class="fas fa-info-circle" style="font-size: 0.6rem; color: var(--text-muted);"></i>
                        </div>
                        <span style="font-size: 1rem; font-weight: 900; color: var(--bg-sidebar);">{{ number_format($int->transactions_count ?? 0) }} <span style="font-size: 0.7rem; font-weight: 700; color: var(--text-muted);">vendas</span></span>
                    </div>
                </div>
            </div>

            <div style="display: grid; grid-template-columns: 1.2fr 0.8fr; gap: 12px;">
                <a href="{{ route('dashboard.integrations.show', $int->id) }}" class="btn" style="background: var(--primary); color: white; border: none; padding: 14px; border-radius: 12px; font-weight: 800; font-size: 0.85rem; text-decoration: none; text-align: center; transition: all 0.2s ease; box-shadow: 0 4px 12px rgba(124, 58, 237, 0.2);">
                     DADOS DA CONEXÃO
                </a>
                <form method="POST" action="{{ route('dashboard.integrations.toggle', $int->id) }}" style="display: inline;">
                    @csrf
                    <button type="submit" style="width: 100%; background: #f1f5f9; color: #475569; border: 1px solid var(--border); padding: 14px; border-radius: 12px; font-weight: 800; font-size: 0.85rem; cursor: pointer; transition: all 0.2s ease;">
                        {{ $int->status === 'active' ? 'PAUSAR' : 'ATIVAR' }}
                    </button>
                </form>
            </div>
        </div>
    @empty
        <div class="card animate-up" style="grid-column: 1 / -1; padding: 80px 24px; text-align: center; background: #fff; border: 2px dashed var(--border);">
            <div style="width: 80px; height: 80px; background: #f8fafc; color: var(--text-muted); border-radius: 50%; display: flex; align-items: center; justify-content: center; font-size: 2.5rem; margin: 0 auto 24px; opacity: 0.5;">
                <i class="fas fa-network-wired"></i>
            </div>
            <h3 style="font-size: 1.4rem; font-weight: 900; color: var(--bg-sidebar); margin-bottom: 8px;">Nenhum sistema conectado</h3>
            <p style="font-size: 0.95rem; color: var(--text-muted); max-width: 440px; margin: 0 auto 30px;">Comece conectando sua primeira plataforma de vendas para automatizar seus recebimentos.</p>
            <button onclick="toggleDrawer('drawer-create', true)" class="btn" style="background: var(--primary); color: white; border: none; padding: 16px 32px; border-radius: 14px; font-weight: 900; font-size: 0.95rem; cursor: pointer; box-shadow: 0 10px 20px -5px rgba(124, 58, 237, 0.4);">
                CRIAR MINHA PRIMEIRA CONEXÃO
            </button>
        </div>
    @endforelse
</div>

<!-- Side Drawer Create (Premium Panel) -->
<div id="drawer-create" class="drawer-overlay" onclick="if(event.target === this) toggleDrawer('drawer-create', false)">
    <div class="drawer-content">
        <div class="drawer-header">
            <div>
                <h3>Nova Conexão Elite</h3>
                <p style="font-size: 0.75rem; opacity: 0.8; font-weight: 600;">Expanda seu ecossistema de pagamentos.</p>
            </div>
            <button class="drawer-close" onclick="toggleDrawer('drawer-create', false)">
                <i class="fas fa-times"></i>
            </button>
        </div>
        
        <div class="drawer-body">
            <form id="form-create-integration" method="POST" action="{{ route('dashboard.integrations.store') }}">
                @csrf
                
                <div style="margin-bottom: 30px;">
                    <h5 style="font-size: 0.7rem; font-weight: 900; text-transform: uppercase; color: var(--text-muted); margin-bottom: 16px; letter-spacing: 0.5px;">1. Identificação Básica</h5>
                    
                    <div class="form-group-elite">
                        <label for="name">Nome do Sistema</label>
                        <div class="input-group-elite">
                            <i class="fas fa-desktop input-group-icon"></i>
                            <input type="text" name="name" id="name" class="input-elite" placeholder="Ex: Basileia Vendas - Loja Principal" required>
                        </div>
                    </div>

                    <div class="form-group-elite">
                        <label for="base_url">URL Base do Sistema (API)</label>
                        <div class="input-group-elite">
                            <i class="fas fa-link input-group-icon"></i>
                            <input type="url" name="base_url" id="base_url" class="input-elite" placeholder="https://vendas.seusite.com" value="{{ $template->base_url ?? '' }}">
                        </div>
                        <p class="form-help-elite">Onde seu sistema está hospedado.</p>
                    </div>
                </div>

                <div style="margin-bottom: 30px; border-top: 1px solid var(--border-light); padding-top: 24px;">
                    <div style="display: flex; align-items: center; justify-content: space-between; margin-bottom: 16px;">
                        <h5 style="font-size: 0.7rem; font-weight: 900; text-transform: uppercase; color: var(--text-muted); letter-spacing: 0.5px; margin: 0;">2. Configuração Avançada (Opcional)</h5>
                        @if($template)
                            <span style="font-size: 0.6rem; color: var(--primary); font-weight: 800; background: var(--primary-glow); padding: 2px 8px; border-radius: 5px;">PRÉ-PREENCHIDO</span>
                        @endif
                    </div>
                    
                    <div class="form-group-elite">
                        <label for="webhook_url">URL de Notificações (Webhook)</label>
                        <div class="input-group-elite">
                            <i class="fas fa-broadcast-tower input-group-icon"></i>
                            <input type="url" name="webhook_url" id="webhook_url" class="input-elite" placeholder="https://vendas.com/api/webhook/checkout" value="{{ $template->webhook_url ?? '' }}">
                        </div>
                        <p class="form-help-elite">URL para onde enviaremos o status dos pagamentos.</p>
                    </div>

                    <div class="form-group-elite">
                        <label for="webhook_secret">Webhook Secret (Whsec)</label>
                        <div class="input-group-elite">
                            <i class="fas fa-shield-halved input-group-icon"></i>
                            <input type="text" name="webhook_secret" id="webhook_secret" class="input-elite" placeholder="whsec_..." value="{{ $template->webhook_secret ?? '' }}">
                        </div>
                        <p class="form-help-elite">Copie este valor do seu sistema de vendas.</p>
                    </div>
                </div>

                <div class="glass-section">
                    <p style="font-size: 0.75rem; color: var(--primary); font-weight: 700; line-height: 1.5; margin: 0; display: flex; gap: 10px;">
                        <i class="fas fa-shield-check" style="font-size: 1rem; margin-top: 2px;"></i>
                        <span>O Basileia Secure gerará automaticamente um Token Bearer para autenticação segura deste sistema.</span>
                    </p>
                </div>
            </form>
        </div>

        <div class="drawer-footer">
            <button type="button" class="btn" onclick="toggleDrawer('drawer-create', false)" style="flex: 1; height: 50px; background: #f8fafc; border: 1px solid var(--border); color: var(--text-muted); border-radius: 12px; font-weight: 800;">CANCELAR</button>
            <button type="submit" form="form-create-integration" class="btn btn-primary" style="flex: 2; height: 50px; justify-content: center; border-radius: 12px; font-weight: 900; box-shadow: 0 10px 20px -5px rgba(124, 58, 237, 0.3);">CONFIRMAR CRIAÇÃO</button>
        </div>
    </div>
</div>

<script>
    function toggleDrawer(id, show) {
        const drawer = document.getElementById(id);
        if (show) {
            drawer.classList.add('active');
            document.body.style.overflow = 'hidden';
        } else {
            drawer.classList.remove('active');
            document.body.style.overflow = '';
        }
    }

    // Escape to close
    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape') toggleDrawer('drawer-create', false);
    });
</script>
@endsection
