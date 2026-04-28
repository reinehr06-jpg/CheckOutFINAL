@extends('dashboard.layouts.app')
@section('title', '🔗 Gerador de Link Seguro')

@section('content')
<div style="max-width: 800px; margin: 0 auto;">
    <div class="card animate-up" style="padding: 40px; border-radius: 24px; box-shadow: var(--shadow-lg);">
        <div style="text-align: center; margin-bottom: 30px;">
            <div style="width: 64px; height: 64px; background: rgba(124, 58, 237, 0.1); color: var(--primary); border-radius: 20px; display: flex; align-items: center; justify-content: center; font-size: 2rem; margin: 0 auto 20px;">
                <i class="fas fa-shield-halved"></i>
            </div>
            <h2 style="font-size: 1.5rem; font-weight: 800; color: var(--text-main);">Proteção de Dados do Cliente</h2>
            <p style="color: var(--text-secondary); margin-top: 8px;">Cole o link gigante do Asaas ou Vendas e receba um link curto e tokenizado para enviar ao seu cliente.</p>
        </div>

        <form method="POST" action="{{ route('dashboard.tokenizer.post') }}" style="margin-bottom: 30px;">
            @csrf
            <div style="margin-bottom: 20px;">
                <label style="display: block; font-size: 0.75rem; font-weight: 800; color: var(--text-muted); text-transform: uppercase; margin-bottom: 8px;">Link Original (Gigante)</label>
                <textarea name="url" placeholder="https://secure.basileia.global/?asaas_payment_id=..." style="width: 100%; min-height: 120px; padding: 16px; border-radius: 12px; border: 1px solid var(--border); font-family: inherit; font-size: 0.9rem; background: #f8fafc; transition: all 0.2s;" required></textarea>
            </div>
            <button type="submit" style="width: 100%; background: var(--primary); color: white; border: none; padding: 16px; border-radius: 12px; font-weight: 800; font-size: 1rem; cursor: pointer; display: flex; align-items: center; justify-content: center; gap: 10px; transition: all 0.2s;">
                <i class="fas fa-magic"></i> GERAR LINK SEGURO
            </button>
        </form>

        @if(isset($shortUrl))
        <div class="animate-up" style="background: #f0fdf4; border: 1px solid #dcfce7; border-radius: 16px; padding: 24px;">
            <div style="display: flex; align-items: center; gap: 12px; color: #166534; margin-bottom: 15px;">
                <i class="fas fa-check-circle"></i>
                <span style="font-weight: 800; font-size: 0.9rem;">LINK PRONTO PARA ENVIO</span>
            </div>
            
            <div style="display: flex; gap: 10px;">
                <input type="text" id="shortUrlInput" value="{{ $shortUrl }}" readonly style="flex: 1; padding: 12px 16px; border-radius: 10px; border: 1px solid #bbf7d0; background: white; font-weight: 700; color: #166534; font-size: 0.9rem;">
                <button onclick="copyLink()" style="background: #166534; color: white; border: none; padding: 0 20px; border-radius: 10px; font-weight: 800; cursor: pointer; transition: all 0.2s;">
                    <i class="fas fa-copy"></i> COPIAR
                </button>
            </div>
            
            <div style="margin-top: 15px; display: flex; gap: 10px;">
                <a href="https://wa.me/?text={{ urlencode('Olá! Aqui está o seu link seguro para pagamento: ' . $shortUrl) }}" target="_blank" style="flex: 1; background: #25d366; color: white; text-decoration: none; padding: 12px; border-radius: 10px; text-align: center; font-weight: 800; font-size: 0.85rem; display: flex; align-items: center; justify-content: center; gap: 8px;">
                    <i class="fab fa-whatsapp"></i> ENVIAR WHATSAPP
                </a>
                <a href="{{ $shortUrl }}" target="_blank" style="flex: 1; background: white; color: #166534; border: 1px solid #bbf7d0; text-decoration: none; padding: 12px; border-radius: 10px; text-align: center; font-weight: 800; font-size: 0.85rem; display: flex; align-items: center; justify-content: center; gap: 8px;">
                    <i class="fas fa-external-link-alt"></i> TESTAR LINK
                </a>
            </div>
        </div>
        @endif
    </div>

    <div class="card animate-up" style="margin-top: 24px; padding: 24px; background: rgba(124, 58, 237, 0.05); border: 1px dashed var(--primary); border-radius: 20px;">
        <h3 style="font-size: 0.9rem; font-weight: 800; color: var(--primary); margin-bottom: 10px;">🛡️ Por que usar o Gerador de Link Seguro?</h3>
        <ul style="font-size: 0.85rem; color: var(--text-secondary); line-height: 1.6; padding-left: 20px;">
            <li><strong>Privacidade:</strong> O nome, email e documento do cliente ficam ocultos.</li>
            <li><strong>Estética:</strong> Links curtos passam mais credibilidade e profissionalismo.</li>
            <li><strong>Rastreabilidade:</strong> Você consegue ver no dashboard quem abriu o link.</li>
            <li><strong>Segurança:</strong> O link é tokenizado e protegido contra ataques de força bruta.</li>
        </ul>
    </div>
</div>

<script>
function copyLink() {
    const input = document.getElementById('shortUrlInput');
    input.select();
    document.execCommand('copy');
    
    const btn = event.currentTarget;
    const originalText = btn.innerHTML;
    btn.innerHTML = '<i class="fas fa-check"></i> COPIADO!';
    btn.style.background = '#10b981';
    
    setTimeout(() => {
        btn.innerHTML = originalText;
        btn.style.background = '#166534';
    }, 2000);
}
</script>
@endsection
