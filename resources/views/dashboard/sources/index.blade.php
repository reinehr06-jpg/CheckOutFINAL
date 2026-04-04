@extends('dashboard.layouts.app')

@section('content')
<div class="d-flex justify-content-between flex-wrap flex-md-nowrap align-items-center pt-3 pb-2 mb-3 border-bottom">
    <h1 class="h2">Sistemas de Origem</h1>
    <div class="btn-toolbar mb-2 mb-md-0">
        <button type="button" class="btn btn-sm btn-primary" data-bs-toggle="modal" data-bs-target="#createModal">
            + Adicionar Sistema
        </button>
    </div>
</div>

<div class="alert alert-info mb-4">
    <i class="fas fa-info-circle"></i>
    <strong>Para que serve:</strong> Cada sistema de origem (Basileia Vendas, Eventos, Cursos, etc) que chama seu checkout deve ser cadastrado aqui. 
    O Checkout usará o <code>callback_url</code> para enviar notificações de pagamento para o sistema correto.
</div>

@if(session('success'))
<div class="alert alert-success alert-dismissible fade show" role="alert">
    {{ session('success') }}
    <button type="button" class="btn-close" data-bs-dismiss="alert"></button>
</div>
@endif

<div class="table-responsive">
    <table class="table table-striped table-hover">
            <thead>
            <tr>
                <th>Sistema</th>
                <th>Descrição</th>
                <th>Tipos de Produto</th>
                <th>Callback URL</th>
                <th>Status</th>
                <th>Criado em</th>
                <th>Ações</th>
            </tr>
            </thead>
        <tbody>
            @forelse($sources as $source)
            <tr>
                <td>
                    <strong>{{ $source->source_name }}</strong>
                </td>
                <td>{{ $source->description ?? '-' }}</td>
                <td>
                    @if($source->product_types)
                        @foreach($source->product_types as $type)
                            @php
                                $typeMap = ['saas' => 'SaaS', 'evento' => 'Evento', 'curso' => 'Curso', 'lancamento' => 'Lançamento', 'outro' => 'Outro'];
                            @endphp
                            <span class="badge bg-info">{{ $typeMap[$type] ?? $type }}</span>
                        @endforeach
                    @else
                        <span class="text-muted">-</span>
                    @endif
                </td>
                <td>
                    <code class="d-inline-block text-truncate" style="max-width: 300px;" title="{{ $source->callback_url }}">
                        {{ $source->callback_url }}
                    </code>
                </td>
                <td>
                    @if($source->active)
                    <span class="badge bg-success">Ativo</span>
                    @else
                    <span class="badge bg-secondary">Inativo</span>
                    @endif
                </td>
                <td>{{ $source->created_at->format('d/m/Y H:i') }}</td>
                <td>
                    <div class="btn-group btn-group-sm">
                        <button class="btn btn-outline-primary" data-bs-toggle="modal" data-bs-target="#editModal{{ $source->id }}">
                            Editar
                        </button>
                        <form action="{{ route('dashboard.sources.toggle', $source->id) }}" method="POST" class="d-inline">
                            @csrf
                            @method('PATCH')
                            <button type="submit" class="btn btn-outline-{{ $source->active ? 'warning' : 'success' }}">
                                {{ $source->active ? 'Desativar' : 'Ativar' }}
                            </button>
                        </form>
                        <form action="{{ route('dashboard.sources.destroy', $source->id) }}" method="POST" class="d-inline" onsubmit="return confirm('Tem certeza que deseja excluir?')">
                            @csrf
                            @method('DELETE')
                            <button type="submit" class="btn btn-outline-danger">Excluir</button>
                        </form>
                    </div>
                </td>
            </tr>
            @empty
            <tr>
                <td colspan="5" class="text-center py-4">
                    <p class="text-muted mb-0">Nenhum sistema cadastrado.</p>
                    <p class="text-muted">Clique em "Adicionar Sistema" para começar.</p>
                </td>
            </tr>
            @endforelse
        </tbody>
    </table>
</div>

<!-- Create Modal -->
<div class="modal fade" id="createModal" tabindex="-1">
    <div class="modal-dialog">
        <div class="modal-content">
            <div class="modal-header">
                <h5 class="modal-title">Adicionar Sistema</h5>
                <button type="button" class="btn-close" data-bs-dismiss="modal"></button>
            </div>
            <form action="{{ route('dashboard.sources.store') }}" method="POST">
                @csrf
                <div class="modal-body">
                    <div class="mb-3">
                        <label class="form-label">Nome do Sistema</label>
                        <input type="text" name="source_name" class="form-control" placeholder="basileia_vendas" required>
                        <small class="text-muted">Identificador único do sistema (use underscore)</small>
                    </div>
                    <div class="mb-3">
                        <label class="form-label">Descrição</label>
                        <input type="text" name="description" class="form-control" placeholder="Sistema de vendas de SaaS">
                        <small class="text-muted">Descrição opcional para identificar o sistema</small>
                    </div>
                    <div class="mb-3">
                        <label class="form-label">Callback URL</label>
                        <input type="url" name="callback_url" class="form-control" placeholder="https://basileia-vendas.com/api/webhook/checkout" required>
                        <small class="text-muted">URL para onde o Checkout enviará as notificações</small>
                    </div>
                    <div class="mb-3">
                        <label class="form-label">Webhook Secret</label>
                        <input type="text" name="webhook_secret" class="form-control" placeholder="Secret gerado pelo sistema de origem" required minlength="16">
                        <small class="text-muted">Secret para assinar as requisições (mínimo 16 caracteres)</small>
                    </div>
                    <div class="mb-3">
                        <label class="form-label">Tipos de Produto</label>
                        <div class="form-check">
                            <input type="checkbox" name="product_types[]" class="form-check-input" id="pt_saas" value="saas">
                            <label class="form-check-label" for="pt_saas">SaaS (Software)</label>
                        </div>
                        <div class="form-check">
                            <input type="checkbox" name="product_types[]" class="form-check-input" id="pt_evento" value="evento">
                            <label class="form-check-label" for="pt_evento">Evento/Ingressos</label>
                        </div>
                        <div class="form-check">
                            <input type="checkbox" name="product_types[]" class="form-check-input" id="pt_curso" value="curso">
                            <label class="form-check-label" for="pt_curso">Curso</label>
                        </div>
                        <div class="form-check">
                            <input type="checkbox" name="product_types[]" class="form-check-input" id="pt_lancamento" value="lancamento">
                            <label class="form-check-label" for="pt_lancamento">Lançamento</label>
                        </div>
                        <div class="form-check">
                            <input type="checkbox" name="product_types[]" class="form-check-input" id="pt_outro" value="outro">
                            <label class="form-check-label" for="pt_outro">Outro</label>
                        </div>
                    </div>
                    <div class="mb-3 form-check">
                        <input type="checkbox" name="active" class="form-check-input" id="activeCheck" checked>
                        <label class="form-check-label" for="activeCheck">Sistema ativo</label>
                    </div>
                </div>
                <div class="modal-footer">
                    <button type="button" class="btn btn-secondary" data-bs-dismiss="modal">Cancelar</button>
                    <button type="submit" class="btn btn-primary">Salvar</button>
                </div>
            </form>
        </div>
    </div>
</div>

<!-- Edit Modals -->
@foreach($sources as $source)
<div class="modal fade" id="editModal{{ $source->id }}" tabindex="-1">
    <div class="modal-dialog">
        <div class="modal-content">
            <div class="modal-header">
                <h5 class="modal-title">Editar Sistema</h5>
                <button type="button" class="btn-close" data-bs-dismiss="modal"></button>
            </div>
            <form action="{{ route('dashboard.sources.update', $source->id) }}" method="POST">
                @csrf
                @method('PUT')
                <div class="modal-body">
                    <div class="mb-3">
                        <label class="form-label">Nome do Sistema</label>
                        <input type="text" name="source_name" class="form-control" value="{{ $source->source_name }}" required>
                    </div>
                    <div class="mb-3">
                        <label class="form-label">Descrição</label>
                        <input type="text" name="description" class="form-control" value="{{ $source->description }}" placeholder="Descrição opcional">
                    </div>
                    <div class="mb-3">
                        <label class="form-label">Callback URL</label>
                        <input type="url" name="callback_url" class="form-control" value="{{ $source->callback_url }}" required>
                    </div>
                    <div class="mb-3">
                        <label class="form-label">Webhook Secret</label>
                        <input type="text" name="webhook_secret" class="form-control" value="{{ $source->webhook_secret }}" required minlength="16">
                    </div>
                    <div class="mb-3">
                        <label class="form-label">Tipos de Produto</label>
                        @php
                            $currentTypes = $source->product_types ?? [];
                        @endphp
                        <div class="form-check">
                            <input type="checkbox" name="product_types[]" class="form-check-input" id="edit_pt_saas{{ $source->id }}" value="saas" {{ in_array('saas', $currentTypes) ? 'checked' : '' }}>
                            <label class="form-check-label" for="edit_pt_saas{{ $source->id }}">SaaS (Software)</label>
                        </div>
                        <div class="form-check">
                            <input type="checkbox" name="product_types[]" class="form-check-input" id="edit_pt_evento{{ $source->id }}" value="evento" {{ in_array('evento', $currentTypes) ? 'checked' : '' }}>
                            <label class="form-check-label" for="edit_pt_evento{{ $source->id }}">Evento/Ingressos</label>
                        </div>
                        <div class="form-check">
                            <input type="checkbox" name="product_types[]" class="form-check-input" id="edit_pt_curso{{ $source->id }}" value="curso" {{ in_array('curso', $currentTypes) ? 'checked' : '' }}>
                            <label class="form-check-label" for="edit_pt_curso{{ $source->id }}">Curso</label>
                        </div>
                        <div class="form-check">
                            <input type="checkbox" name="product_types[]" class="form-check-input" id="edit_pt_lancamento{{ $source->id }}" value="lancamento" {{ in_array('lancamento', $currentTypes) ? 'checked' : '' }}>
                            <label class="form-check-label" for="edit_pt_lancamento{{ $source->id }}">Lançamento</label>
                        </div>
                        <div class="form-check">
                            <input type="checkbox" name="product_types[]" class="form-check-input" id="edit_pt_outro{{ $source->id }}" value="outro" {{ in_array('outro', $currentTypes) ? 'checked' : '' }}>
                            <label class="form-check-label" for="edit_pt_outro{{ $source->id }}">Outro</label>
                        </div>
                    </div>
                    <div class="mb-3 form-check">
                        <input type="checkbox" name="active" class="form-check-input" id="editActiveCheck{{ $source->id }}" {{ $source->active ? 'checked' : '' }}>
                        <label class="form-check-label" for="editActiveCheck{{ $source->id }}">Sistema ativo</label>
                    </div>
                </div>
                <div class="modal-footer">
                    <button type="button" class="btn btn-secondary" data-bs-dismiss="modal">Cancelar</button>
                    <button type="submit" class="btn btn-primary">Atualizar</button>
                </div>
            </form>
        </div>
    </div>
</div>
@endforeach
@endsection