<!DOCTYPE html>
<html lang="pt-BR">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <meta name="csrf-token" content="{{ csrf_token() }}">
    <title>Login - Checkout Basileia</title>
    <link href="https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700;800&family=Space+Grotesk:wght@500;700&display=swap" rel="stylesheet">
    <style>
        * { box-sizing: border-box; margin: 0; padding: 0; }
        body {
            font-family: 'Inter', -apple-system, BlinkMacSystemFont, sans-serif;
            background: #0f0f1a;
            min-height: 100vh;
            display: flex;
            align-items: center;
            justify-content: center;
            padding: 20px;
            position: relative;
            overflow: hidden;
        }
        body::before {
            content: '';
            position: absolute;
            top: -50%;
            left: -50%;
            width: 200%;
            height: 200%;
            background: 
                radial-gradient(circle at 20% 30%, rgba(123, 47, 247, 0.15) 0%, transparent 40%),
                radial-gradient(circle at 80% 70%, rgba(99, 102, 241, 0.1) 0%, transparent 40%),
                radial-gradient(circle at 50% 50%, rgba(76, 29, 149, 0.08) 0%, transparent 50%);
            animation: bgPulse 15s ease-in-out infinite;
        }
        @keyframes bgPulse {
            0%, 100% { transform: translate(0, 0) rotate(0deg); }
            50% { transform: translate(-2%, -2%) rotate(1deg); }
        }
        .login-card {
            background: rgba(255, 255, 255, 0.03);
            backdrop-filter: blur(20px);
            border: 1px solid rgba(255, 255, 255, 0.08);
            border-radius: 24px;
            padding: 48px;
            width: 100%;
            max-width: 420px;
            position: relative;
            box-shadow: 
                0 25px 50px -12px rgba(0, 0, 0, 0.5),
                0 0 0 1px rgba(255, 255, 255, 0.05) inset;
        }
        .login-card::before {
            content: '';
            position: absolute;
            top: 0;
            left: 50%;
            transform: translateX(-50%);
            width: 80%;
            height: 1px;
            background: linear-gradient(90deg, transparent, rgba(123, 47, 247, 0.5), transparent);
        }
        .login-header {
            text-align: center;
            margin-bottom: 40px;
        }
        .brand-logo {
            width: 64px;
            height: 64px;
            background: linear-gradient(135deg, #7b2ff7 0%, #9f67ff 100%);
            border-radius: 16px;
            display: flex;
            align-items: center;
            justify-content: center;
            margin: 0 auto 20px;
            font-size: 28px;
            font-weight: 800;
            color: white;
            box-shadow: 0 8px 24px rgba(123, 47, 247, 0.4);
        }
        .login-header h1 {
            font-family: 'Space Grotesk', sans-serif;
            font-size: 2rem;
            font-weight: 700;
            color: white;
            letter-spacing: -0.5px;
            margin-bottom: 8px;
        }
        .login-header p {
            color: rgba(255, 255, 255, 0.5);
            font-size: 0.9rem;
        }
        .form-group {
            margin-bottom: 24px;
        }
        .form-group label {
            display: block;
            font-size: 0.75rem;
            font-weight: 600;
            color: rgba(255, 255, 255, 0.6);
            margin-bottom: 8px;
            text-transform: uppercase;
            letter-spacing: 1px;
        }
        .form-group input {
            width: 100%;
            padding: 16px 20px;
            border: 1px solid rgba(255, 255, 255, 0.08);
            border-radius: 12px;
            font-size: 0.95rem;
            font-family: inherit;
            transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
            color: white;
            background: rgba(255, 255, 255, 0.03);
        }
        .form-group input::placeholder {
            color: rgba(255, 255, 255, 0.3);
        }
        .form-group input:focus {
            outline: none;
            border-color: #7b2ff7;
            box-shadow: 0 0 0 4px rgba(123, 47, 247, 0.15), 0 4px 12px rgba(0, 0, 0, 0.2);
            background: rgba(255, 255, 255, 0.05);
        }
        .btn-login {
            width: 100%;
            padding: 16px;
            background: linear-gradient(135deg, #7b2ff7 0%, #6366F1 100%);
            color: white;
            border: none;
            border-radius: 12px;
            font-size: 0.95rem;
            font-weight: 700;
            cursor: pointer;
            transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
            font-family: inherit;
            margin-top: 8px;
            position: relative;
            overflow: hidden;
        }
        .btn-login::before {
            content: '';
            position: absolute;
            top: 0;
            left: -100%;
            width: 100%;
            height: 100%;
            background: linear-gradient(90deg, transparent, rgba(255,255,255,0.2), transparent);
            transition: left 0.5s;
        }
        .btn-login:hover {
            transform: translateY(-2px);
            box-shadow: 0 12px 32px rgba(123, 47, 247, 0.4);
        }
        .btn-login:hover::before {
            left: 100%;
        }
        .error-box {
            background: rgba(239, 68, 68, 0.1);
            border: 1px solid rgba(239, 68, 68, 0.3);
            color: #fca5a5;
            border-radius: 12px;
            padding: 16px;
            margin-bottom: 24px;
            font-size: 0.85rem;
        }
        .error-box p { display: flex; align-items: center; gap: 8px; }
        .footer-text {
            text-align: center;
            color: rgba(255, 255, 255, 0.3);
            font-size: 0.75rem;
            margin-top: 32px;
        }
    </style>
</head>
<body>
    <div class="login-card">
        <div class="login-header">
            <div class="brand-logo">B</div>
            <h1>Checkout</h1>
            <p>Acesse sua conta para continuar</p>
        </div>

        @if($errors->any())
            <div class="error-box">
                @foreach($errors->all() as $error)
                    <p><i class="fas fa-exclamation-circle"></i> {{ $error }}</p>
                @endforeach
            </div>
        @endif

        <form method="POST" action="{{ route('login.post') }}">
            @csrf
            <div class="form-group">
                <label for="email">Email</label>
                <input type="email" id="email" name="email" value="{{ old('email') }}" required autofocus placeholder="seu@email.com">
            </div>
            <div class="form-group">
                <label for="password">Senha</label>
                <input type="password" id="password" name="password" required placeholder="••••••••">
            </div>
            <button type="submit" class="btn-login">Entrar</button>
        </form>

        <p class="footer-text">Checkout Payment Platform &copy; {{ date('Y') }}</p>
    </div>
</body>
</html>
