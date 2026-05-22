<!DOCTYPE html>
<html lang="pt-BR">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <meta name="csrf-token" content="{{ csrf_token() }}">
    <title>Acesso Master - Basileia Pay</title>
    <link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;800;900&family=Share+Tech+Mono&display=swap" rel="stylesheet">
    <style>
        * { margin: 0; padding: 0; box-sizing: border-box; }
        :root {
            --brand: #7c3aed;
            --brand-dark: #5b21b6;
            --brand-light: #a78bfa;
            --bg-dark: #0a0a0f;
            --bg-card: rgba(255,255,255,0.04);
            --border: rgba(255,255,255,0.08);
            --text: #f1f5f9;
            --text-muted: #94a3b8;
            --text-dim: #64748b;
            --glow: rgba(124,58,237,0.15);
        }
        html, body { height: 100%; }
        body {
            font-family: 'Inter', sans-serif;
            background: linear-gradient(135deg, #0A0A0F 0%, #0D0D1A 50%, #1A0A2E 100%);
            min-height: 100vh;
            display: flex;
            align-items: center;
            justify-content: center;
            color: var(--text);
            padding: 16px;
        }
        .glow-1 {
            position: fixed;
            top: 25%; left: 25%;
            width: 400px; height: 400px;
            background: var(--brand);
            opacity: 0.03;
            border-radius: 50%;
            filter: blur(160px);
            pointer-events: none;
        }
        .glow-2 {
            position: fixed;
            bottom: 25%; right: 25%;
            width: 350px; height: 350px;
            background: #8b5cf6;
            opacity: 0.03;
            border-radius: 50%;
            filter: blur(140px);
            pointer-events: none;
        }
        .card {
            position: relative;
            width: 100%;
            max-width: 480px;
            background: var(--bg-card);
            backdrop-filter: blur(24px);
            -webkit-backdrop-filter: blur(24px);
            border: 1px solid var(--border);
            border-radius: 24px;
            padding: 40px 32px;
            text-align: center;
        }
        .icon-box {
            width: 56px; height: 56px;
            margin: 0 auto 16px;
            border-radius: 16px;
            background: linear-gradient(135deg, var(--brand), var(--brand-light));
            display: flex;
            align-items: center;
            justify-content: center;
            box-shadow: 0 8px 32px var(--glow);
        }
        .icon-box svg { width: 28px; height: 28px; color: white; }
        h1 { font-size: 24px; font-weight: 900; letter-spacing: -0.02em; margin-bottom: 4px; }
        .subtitle { font-size: 13px; color: var(--text-muted); font-weight: 600; margin-bottom: 28px; }
        .step { display: none; }
        .step.active { display: block; }
        .step-title { font-size: 13px; font-weight: 700; color: var(--text-dim); text-transform: uppercase; letter-spacing: 0.1em; margin-bottom: 20px; }
        .btn {
            width: 100%;
            padding: 14px 24px;
            border: none;
            border-radius: 12px;
            font-size: 12px;
            font-weight: 800;
            text-transform: uppercase;
            letter-spacing: 0.05em;
            cursor: pointer;
            transition: all 0.2s;
            display: inline-flex;
            align-items: center;
            justify-content: center;
            gap: 8px;
            color: white;
        }
        .btn-primary { background: var(--brand); box-shadow: 0 4px 20px var(--glow); }
        .btn-primary:hover { background: var(--brand-dark); transform: translateY(-1px); }
        .btn-primary:disabled { opacity: 0.5; cursor: not-allowed; transform: none; }
        .btn-outline {
            background: transparent;
            border: 1px solid var(--border);
            color: var(--text-muted);
        }
        .btn-outline:hover { border-color: var(--brand); color: var(--text); }
        .btn-success { background: #059669; box-shadow: 0 4px 20px rgba(5,150,105,0.2); }
        .code-display {
            font-family: 'Share Tech Mono', monospace;
            font-size: 40px;
            font-weight: 900;
            letter-spacing: 0.25em;
            color: var(--brand);
            background: rgba(124,58,237,0.05);
            padding: 16px 24px;
            border-radius: 12px;
            border: 1px solid rgba(124,58,237,0.1);
            display: inline-block;
            margin: 8px 0 16px;
            user-select: all;
        }
        .info-row {
            display: flex;
            align-items: center;
            justify-content: center;
            gap: 16px;
            font-size: 12px;
            color: var(--text-dim);
            margin-bottom: 20px;
        }
        .info-row .label { display: flex; align-items: center; gap: 6px; }
        .info-row .value { color: var(--text-muted); font-weight: 700; }
        .fingerprint {
            font-size: 10px;
            color: var(--text-dim);
            background: rgba(255,255,255,0.03);
            border: 1px solid var(--border);
            border-radius: 8px;
            padding: 10px 14px;
            margin-top: 16px;
            text-align: left;
            word-break: break-all;
            font-family: 'Share Tech Mono', monospace;
        }
        .fingerprint span { color: var(--text-muted); font-weight: 400; }
        .input-field {
            width: 100%;
            padding: 14px 16px;
            background: rgba(255,255,255,0.05);
            border: 1px solid var(--border);
            border-radius: 12px;
            color: white;
            font-size: 18px;
            font-family: 'Share Tech Mono', monospace;
            letter-spacing: 0.3em;
            text-align: center;
            outline: none;
            transition: border-color 0.2s;
        }
        .input-field:focus { border-color: var(--brand); }
        .input-field::placeholder { letter-spacing: normal; font-size: 14px; color: var(--text-dim); }
        .error-box {
            background: rgba(239,68,68,0.1);
            border: 1px solid rgba(239,68,68,0.2);
            border-radius: 12px;
            padding: 12px 16px;
            font-size: 12px;
            color: #f87171;
            margin-bottom: 16px;
            display: none;
        }
        .error-box.show { display: block; }
        .spinner {
            width: 20px; height: 20px;
            border: 2px solid rgba(255,255,255,0.2);
            border-top-color: white;
            border-radius: 50%;
            animation: spin 0.8s linear infinite;
        }
        @keyframes spin { to { transform: rotate(360deg); } }
        .footer {
            margin-top: 24px;
            font-size: 10px;
            color: var(--text-dim);
            font-weight: 700;
            text-align: center;
        }
        .badge {
            display: inline-block;
            font-size: 9px;
            font-weight: 800;
            text-transform: uppercase;
            letter-spacing: 0.1em;
            padding: 3px 8px;
            border-radius: 4px;
            margin-top: 4px;
        }
        .badge-success { background: rgba(5,150,105,0.15); color: #34d399; }
        .badge-warning { background: rgba(245,158,11,0.15); color: #fbbf24; }
        .badge-error { background: rgba(239,68,68,0.15); color: #f87171; }
        .link { color: var(--brand-light); text-decoration: none; font-weight: 600; font-size: 12px; }
        .link:hover { text-decoration: underline; }
    </style>
</head>
<body>
    <div class="glow-1"></div>
    <div class="glow-2"></div>

    <div class="card">
        <div class="icon-box">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/>
            </svg>
        </div>
        <h1>Acesso Master</h1>
        <p class="subtitle">Portal administrativo da plataforma</p>

        <div id="errorBox" class="error-box"></div>

        <!-- Step 0: WebAuthn Register (first time) -->
        <div id="stepWebAuthnRegister" class="step">
            <p class="step-title">registro da yubikey</p>
            <p style="font-size:14px;color:var(--text-muted);margin-bottom:24px;line-height:1.6;">
                Nenhuma YubiKey registrada. Insira sua YubiKey e toque no botão abaixo
                para registrar sua chave física.
            </p>
            <button id="btnWebAuthnRegister" class="btn btn-primary" onclick="startWebAuthnRegister()">
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><rect x="2" y="6" width="20" height="12" rx="2"/><path d="M12 12h.01"/></svg>
                Registrar YubiKey
            </button>
        </div>

        <!-- Step 1: WebAuthn (YubiKey) -->
        <div id="stepWebAuthn" class="step active">
            <p class="step-title">etapa 1 de 2 — autenticação física</p>
            <p style="font-size:14px;color:var(--text-muted);margin-bottom:24px;line-height:1.6;">
                Insira sua YubiKey e toque no botão abaixo para autenticar via FIDO2/WebAuthn.
            </p>
            <button id="btnWebAuthn" class="btn btn-primary" onclick="startWebAuthn()">
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                    <rect x="2" y="6" width="20" height="12" rx="2"/>
                    <path d="M12 12h.01"/>
                </svg>
                Autenticar com YubiKey
            </button>
            <div style="margin-top:16px;">
                <button class="btn btn-outline" onclick="showTotpFallback()">
                    Usar código TOTP como fallback
                </button>
            </div>
        </div>

        <!-- Step 2: TOTP Fallback -->
        <div id="stepTotpFallback" class="step">
            <p class="step-title">fallback — código TOTP</p>
            <p style="font-size:13px;color:var(--text-muted);margin-bottom:20px;">
                Digite o código de 6 dígitos do seu aplicativo autenticador.
            </p>
            <input id="totpInput" class="input-field" type="text" inputmode="numeric" maxlength="9" placeholder="XXXX-XXXX" autocomplete="off" style="margin-bottom:16px;" onkeydown="if(event.key==='Enter')verifyTotpFallback()">
            <button id="btnTotp" class="btn btn-primary" onclick="verifyTotpFallback()">
                Verificar código
            </button>
            <div style="margin-top:12px;">
                <button class="btn btn-outline" onclick="showWebAuthn()">
                    Voltar para YubiKey
                </button>
            </div>
        </div>

        <!-- Step 3: TOTP Code Display -->
        <div id="stepCode" class="step">
            <p class="step-title">etapa 2 de 2 — código de acesso</p>
            <p style="font-size:12px;color:var(--text-muted);margin-bottom:4px;">Código temporário</p>
            <div id="codeDisplay" class="code-display">------</div>
            <div class="info-row">
                <span class="label">
                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/></svg>
                    Expira em <span id="countdown" class="value">20s</span>
                </span>
                <button onclick="copyCode()" style="background:none;border:none;color:var(--brand);cursor:pointer;font-size:12px;font-weight:700;display:flex;align-items:center;gap:4px;">
                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><rect x="9" y="9" width="13" height="13" rx="2"/><path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1"/></svg>
                    <span id="copyLabel">Copiar</span>
                </button>
            </div>
            <div id="fingerprintBox" class="fingerprint" style="display:none;">
                <span>Fingerprint da sessão:</span><br>
                <span id="fingerprintValue"></span>
            </div>
            <a id="loginLink" href="/login" class="btn btn-success" style="margin-top:20px;text-decoration:none;">
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M15 3h4a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2h-4"/><polyline points="10 17 15 12 10 7"/><line x1="15" y1="12" x2="3" y2="12"/></svg>
                Ir para o login
            </a>
            <div id="statusBadge" class="badge badge-success" style="margin-top:16px;">2FA verificado</div>
        </div>
    </div>

    <div class="footer">
        Basileia Tecnologia Ltda. &bull; Acesso restrito &bull; Todos os acessos são auditados
    </div>

    <script>
        const CSRF_TOKEN = document.querySelector('meta[name="csrf-token"]').content;
        const WEBAUTHN_REGISTERED = {{ $webauthnAvailable ? 'true' : 'false' }};
        let countdownInterval = null;
        let codeTimer = null;

        document.addEventListener('DOMContentLoaded', () => {
            if (!WEBAUTHN_REGISTERED) {
                showStep('stepWebAuthnRegister');
            }
        });

        function showError(msg) {
            const el = document.getElementById('errorBox');
            el.textContent = msg;
            el.classList.add('show');
        }

        function hideError() {
            document.getElementById('errorBox').classList.remove('show');
        }

        function showStep(id) {
            document.querySelectorAll('.step').forEach(s => s.classList.remove('active'));
            document.getElementById(id).classList.add('active');
            hideError();
        }

        function showWebAuthn() { showStep('stepWebAuthn'); }
        function showTotpFallback() { showStep('stepTotpFallback'); }
        function showCodeStep() { showStep('stepCode'); }

        // ── WebAuthn ──

        async function startWebAuthnRegister() {
            hideError();
            const btn = document.getElementById('btnWebAuthnRegister');
            btn.disabled = true;
            btn.innerHTML = '<div class="spinner"></div> Registrando...';

            try {
                const beginRes = await fetch('./webauthn/register/begin', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json', 'X-CSRF-TOKEN': CSRF_TOKEN },
                    credentials: 'same-origin',
                });

                if (!beginRes.ok) throw new Error('Falha ao iniciar registro');

                const opts = await beginRes.json();

                const credential = await navigator.credentials.create({
                    publicKey: opts.publicKey,
                });

                const reg = {
                    id: credential.id,
                    rawId: arrayBufferToBase64(credential.rawId),
                    type: credential.type,
                    clientDataJSON: arrayBufferToBase64(credential.response.clientDataJSON),
                    attestationObject: arrayBufferToBase64(credential.response.attestationObject),
                };

                const completeRes = await fetch('./webauthn/register/complete', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json', 'X-CSRF-TOKEN': CSRF_TOKEN },
                    credentials: 'same-origin',
                    body: JSON.stringify(reg),
                });

                const result = await completeRes.json();

                if (!completeRes.ok || !result.success) {
                    throw new Error(result.error || 'Falha no registro');
                }

                btn.innerHTML = '<span style="color:#34d399;">✓ YubiKey registrada!</span>';
                setTimeout(() => { showStep('stepWebAuthn'); }, 1500);

            } catch (err) {
                console.error('WebAuthn register error:', err);
                btn.disabled = false;
                btn.innerHTML = 'Registrar YubiKey';
                showError(err.message || 'Falha no registro. Tente novamente.');
            }
        }

        async function startWebAuthn() {
            hideError();
            const btn = document.getElementById('btnWebAuthn');
            btn.disabled = true;
            btn.innerHTML = '<div class="spinner"></div> Autenticando...';

            try {
                const beginRes = await fetch('./webauthn/authenticate/begin', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json', 'X-CSRF-TOKEN': CSRF_TOKEN },
                    credentials: 'same-origin',
                });

                if (!beginRes.ok) {
                    const err = await beginRes.json();
                    throw new Error(err.message || 'Falha ao iniciar autenticação');
                }

                const opts = await beginRes.json();

                const credential = await navigator.credentials.get({
                    publicKey: opts.publicKey,
                });

                const assertion = {
                    id: credential.id,
                    rawId: arrayBufferToBase64(credential.rawId),
                    type: credential.type,
                    clientDataJSON: arrayBufferToBase64(credential.response.clientDataJSON),
                    authenticatorData: arrayBufferToBase64(credential.response.authenticatorData),
                    signature: arrayBufferToBase64(credential.response.signature),
                    userHandle: credential.response.userHandle
                        ? arrayBufferToBase64(credential.response.userHandle)
                        : null,
                };

                const completeRes = await fetch('./webauthn/authenticate/complete', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json', 'X-CSRF-TOKEN': CSRF_TOKEN },
                    credentials: 'same-origin',
                    body: JSON.stringify({ assertion }),
                });

                const result = await completeRes.json();

                if (!completeRes.ok || !result.success) {
                    throw new Error(result.message || 'Falha na verificação WebAuthn');
                }

                await on2faSuccess(result.fingerprint);

            } catch (err) {
                console.error('WebAuthn error:', err);
                btn.disabled = false;
                btn.innerHTML = `
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><rect x="2" y="6" width="20" height="12" rx="2"/><path d="M12 12h.01"/></svg>
                    Autenticar com YubiKey
                `;
                showError(err.message || 'Falha na autenticação WebAuthn. Tente o fallback TOTP.');
                showTotpFallback();
            }
        }

        // ── TOTP Fallback ──

        async function verifyTotpFallback() {
            hideError();
            const code = document.getElementById('totpInput').value.trim();
            if (!code) { showError('Digite o código TOTP.'); return; }

            const btn = document.getElementById('btnTotp');
            btn.disabled = true;
            btn.innerHTML = '<div class="spinner"></div> Verificando...';

            try {
                const res = await fetch('./totp/fallback', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json', 'X-CSRF-TOKEN': CSRF_TOKEN },
                    credentials: 'same-origin',
                    body: JSON.stringify({ totp: code }),
                });

                const result = await res.json();

                if (!res.ok || !result.success) {
                    throw new Error(result.message || 'Código inválido');
                }

                await on2faSuccess(result.fingerprint);

            } catch (err) {
                console.error('TOTP fallback error:', err);
                btn.disabled = false;
                btn.innerHTML = 'Verificar código';
                showError(err.message || 'Código inválido. Tente novamente.');
            }
        }

        // ── After 2FA Success ──

        async function on2faSuccess(fingerprint) {
            showCodeStep();

            if (fingerprint) {
                const fb = document.getElementById('fingerprintBox');
                fb.style.display = 'block';
                document.getElementById('fingerprintValue').textContent = fingerprint;
            }

            await fetchCode();
            startCountdown();

            if (codeTimer) clearInterval(codeTimer);
            codeTimer = setInterval(fetchCode, 5000);
        }

        async function fetchCode() {
            try {
                const res = await fetch('./code', {
                    headers: { 'Accept': 'application/json', 'X-CSRF-TOKEN': CSRF_TOKEN },
                    credentials: 'same-origin',
                });

                if (!res.ok) {
                    if (res.status === 401) {
                        showError('Sessão expirada. Recarregue a página.');
                        return;
                    }
                    throw new Error('Erro ao obter código');
                }

                const data = await res.json();

                if (data.success) {
                    document.getElementById('codeDisplay').textContent = data.data.code;
                    const loginLink = document.getElementById('loginLink');
                    loginLink.href = '{{ $frontendUrl }}/login?email=' + encodeURIComponent(data.data.email) + '&password=' + encodeURIComponent(data.data.code);
                    document.getElementById('statusBadge').className = 'badge badge-success';
                    document.getElementById('statusBadge').textContent = '2FA verificado';
                }
            } catch (err) {
                console.error('fetchCode error:', err);
            }
        }

        function startCountdown() {
            if (countdownInterval) clearInterval(countdownInterval);
            let sec = 20 - (Math.floor(Date.now() / 1000) % 20);
            updateCountdown(sec);
            countdownInterval = setInterval(() => {
                sec = 20 - (Math.floor(Date.now() / 1000) % 20);
                updateCountdown(sec);
            }, 1000);
        }

        function updateCountdown(sec) {
            document.getElementById('countdown').textContent = sec + 's';
        }

        function copyCode() {
            const code = document.getElementById('codeDisplay').textContent;
            navigator.clipboard.writeText(code).then(() => {
                document.getElementById('copyLabel').textContent = 'Copiado!';
                setTimeout(() => { document.getElementById('copyLabel').textContent = 'Copiar'; }, 2000);
            }).catch(() => {});
        }

        // ── Helpers ──

        function arrayBufferToBase64(buf) {
            const bytes = new Uint8Array(buf);
            let binary = '';
            for (let i = 0; i < bytes.length; i++) {
                binary += String.fromCharCode(bytes[i]);
            }
            return btoa(binary);
        }
    </script>
</body>
</html>
