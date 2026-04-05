<!DOCTYPE html>
<html lang="pt-BR">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <meta name="csrf-token" content="{{ csrf_token() }}">
    <title>Login Elite - Checkout</title>
    <link href="https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700;800;900&display=swap" rel="stylesheet">
    <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.4.0/css/all.min.css">
    <link rel="stylesheet" href="{{ asset('css/checkout.css') }}">
</head>
<body class="login-body">
    <div class="login-glass animate-up">
        <div class="login-header">
            <h1>Checkout <span>Elite</span></h1>
            <p>Acesso Restrito ao Painel de Controle</p>
        </div>

        @if($errors->any())
            <div style="background: rgba(239, 68, 68, 0.1); border: 1px solid rgba(239, 68, 68, 0.2); color: #f87171; border-radius: 8px; padding: 12px; margin-bottom: 20px; font-size: 0.8rem; font-weight: 600;">
                @foreach($errors->all() as $error)
                    <p><i class="fas fa-exclamation-circle" style="margin-right: 8px;"></i>{{ $error }}</p>
                @endforeach
            </div>
        @endif

        <form method="POST" action="{{ route('login.post') }}" class="login-form">
            @csrf
            <div class="form-group">
                <label for="email">E-mail Corporativo</label>
                <input type="email" id="email" name="email" class="form-control" value="{{ old('email') }}" required autofocus placeholder="nome@empresa.com">
            </div>
            <div class="form-group">
                <label for="password">Chave de Acesso</label>
                <input type="password" id="password" name="password" class="form-control" required placeholder="••••••••">
            </div>
            <button type="submit" class="login-btn">
                <span>Entrar no Sistema</span>
                <i class="fas fa-chevron-right" style="margin-left: 10px; font-size: 0.8rem;"></i>
            </button>
        </form>

        <div style="margin-top: 32px; text-align: center; border-top: 1px solid rgba(255,255,255,0.05); padding-top: 24px;">
            <p style="color: #64748b; font-size: 0.7rem; font-weight: 700; text-transform: uppercase; letter-spacing: 1px;">
                Platform Elite &copy; {{ date('Y') }}
            </p>
        </div>
    </div>

    <style>
        .login-header h1 span {
            color: var(--primary-light);
            font-size: 0.8rem;
            text-transform: uppercase;
            letter-spacing: 3px;
            display: block;
            margin-top: -5px;
        }
    </style>
</body>
</html>
