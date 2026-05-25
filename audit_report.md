# Relatório de Auditoria e Mapeamento de Falhas Críticas — Basileia Pay

Este documento apresenta uma análise de auditoria profunda e exaustiva sobre a base de código do sistema **Basileia Pay**, abrangendo o painel administrativo (`apps/dashboard`), a interface de pagamento público (`apps/checkout`), o visualizador de documentação (`apps/developers`) e o ecossistema Laravel (`apps/api`). 

Abaixo estão detalhados cada bug de segurança, inconsistência de banco de dados, rota mal configurada, telas ou botões mockados no front-end, desalinhamento de documentação de API e problemas de estilo e desempenho. Cada seção exibe o **caminho absoluto do arquivo**, as **linhas exatas do código**, o **código fonte original problemático**, o **plano de correção com código corrigido** e a **explicação do impacto**.

---

## 1. Falhas de Segurança, Autenticação e Controle de Acesso (Crítico)

### 1.1. Bypass de Autenticação com Flashing de Conteúdo Protegido no Dashboard
* **Arquivo**: [AuthGuard.tsx](file:///Users/viniciusreinehr/CheckOutFINAL/apps/dashboard/src/components/auth/AuthGuard.tsx)
* **Localização**: Linhas 39 a 53
* **Descrição do Problema**: O `AuthGuard` verifica se o usuário está autenticado e, caso contrário, redireciona-o para `/login`. No entanto, a lógica de redirecionamento é executada dentro de um `useEffect` (que roda apenas após a renderização inicial no cliente). O componente retorna `children` diretamente se `isLoading` for falso. Como o estado de carregamento é definido como falso assim que o carregamento local é concluído (mesmo sem um token válido), a árvore de componentes filhos (`Topbar`, `Sidebar`, gráficos, dados sigilosos) é renderizada e pisca na tela do navegador por vários frames antes do redirecionamento ocorrer.

#### Código Fonte Original:
```tsx
  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#F4F0FF]">
        <div className="flex flex-col items-center gap-3">
          <div className="w-8 h-8 bg-gradient-to-br from-brand to-brand-accent rounded-xl flex items-center justify-center shadow-lg shadow-brand/20">
            <span className="text-white font-black text-lg">B</span>
          </div>
          <div className="w-6 h-6 border-2 border-brand/30 border-t-brand rounded-full animate-spin" />
        </div>
      </div>
    );
  }

  return <>{children}</>;
```

#### Código Corrigido (Plano de Resolução):
```tsx
  const isAuthRoute =
    pathname.startsWith('/login') ||
    pathname.startsWith('/2fa') ||
    pathname.startsWith('/register') ||
    pathname.startsWith('/forgot-password') ||
    pathname.startsWith('/reset-password');

  const isPublicRoute =
    pathname.startsWith('/session-expired') ||
    pathname.startsWith('/restricted');

  // Verifica explicitamente se existe token ativo no momento da renderização
  const hasToken = typeof window !== 'undefined' ? !!localStorage.getItem('basileia_token') : !!user;

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#F4F0FF]">
        <div className="flex flex-col items-center gap-3">
          <div className="w-8 h-8 bg-gradient-to-br from-brand to-brand-accent rounded-xl flex items-center justify-center shadow-lg shadow-brand/20">
            <span className="text-white font-black text-lg">B</span>
          </div>
          <div className="w-6 h-6 border-2 border-brand/30 border-t-brand rounded-full animate-spin" />
        </div>
      </div>
    );
  }

  // Se for rota protegida e não houver token, bloqueia a renderização dos filhos
  if (!hasToken && !isAuthRoute && !isPublicRoute) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#F4F0FF]">
        <p className="text-xs font-bold text-slate-400">Redirecionando para login...</p>
      </div>
    );
  }

  return <>{children}</>;
```

---

### 1.2. Ausência de Envio do Token de Autenticação no Cliente de API do Front-end
* **Arquivo**: [client.ts](file:///Users/viniciusreinehr/CheckOutFINAL/apps/dashboard/src/lib/api/client.ts)
* **Localização**: Linhas 30 a 39
* **Descrição do Problema**: A função `apiClient` encapsula o consumo dos endpoints da API, porém ela envia os cabeçalhos padrão ('Content-Type', 'Accept', 'X-Request-ID') sem ler o token do usuário no `localStorage` (`basileia_token`). Como resultado, qualquer chamada feita por este cliente para rotas protegidas pelo middleware `auth:sanctum` falhará instantaneamente com erro HTTP 401.

#### Código Fonte Original:
```typescript
  const response = await fetch(`${API_BASE_URL}${path}`, {
    ...options,
    headers: {
      'Content-Type': 'application/json',
      'Accept': 'application/json',
      'X-Request-ID': requestId,
      ...(options.headers || {}),
    },
    credentials: 'include',
  });
```

#### Código Corrigido (Plano de Resolução):
```typescript
  const token = typeof window !== 'undefined' ? localStorage.getItem('basileia_token') : null;

  const headers: Record<string, string> = {
    'Content-Type': 'application/json',
    'Accept': 'application/json',
    'X-Request-ID': requestId,
    ...(options.headers || {}),
  };

  if (token) {
    headers['Authorization'] = `Bearer ${token}`;
  }

  const response = await fetch(`${API_BASE_URL}${path}`, {
    ...options,
    headers,
    credentials: 'include',
  });
```

---

### 1.3. Middleware global 'resolve.api.key' Bloqueando Rotas do Dashboard
* **Arquivo**: [api.php](file:///Users/viniciusreinehr/CheckOutFINAL/apps/api/routes/api.php)
* **Localização**: Linha 49
* **Descrição do Problema**: A rota do grupo de rotas protegidas é configurada com os middlewares `['auth:sanctum', 'tracing', 'resolve.api.key', 'throttle:dashboard']`. A presença de `resolve.api.key` obriga que toda requisição envie o cabeçalho externo `X-API-Key` de integração. Usuários navegando no Dashboard utilizam sessões SPA e tokens Bearer de usuário autenticado, e não chaves de integração. Esse middleware gera um bloqueio em cascata em todas as requisições normais do painel da UI, respondendo `401 Header X-API-Key é obrigatório`.

#### Código Fonte Original:
```php
    Route::middleware(['auth:sanctum', 'tracing', 'resolve.api.key', 'throttle:dashboard'])->group(function () {
```

#### Código Corrigido (Plano de Resolução):
Remover o middleware `resolve.api.key` do grupo global do dashboard, aplicando-o apenas nos endpoints específicos de integração externa ou separando o grupo em rotas internas de controle e rotas de integração pública:
```php
    // Rotas do painel operacional do usuário autenticado no Dashboard
    Route::middleware(['auth:sanctum', 'tracing', 'throttle:dashboard'])->group(function () {
        
        // Auth Me
        Route::get('auth/me', [\App\Http\Controllers\Api\V1\AuthController::class, 'me']);

        // Dashboard Stats & Lists
        Route::get('dashboard/stats', [\App\Http\Controllers\Api\V1\Dashboard\StatsController::class, 'index']);
        Route::get('dashboard/payments', [\App\Http\Controllers\Api\V1\PaymentController::class, 'index']);
        Route::get('dashboard/orders', [\App\Http\Controllers\Api\V1\Dashboard\OrderController::class, 'index']);
        Route::get('dashboard/systems', [\App\Http\Controllers\Api\V1\Dashboard\SystemController::class, 'index']);
        // ... outras rotas internas do dashboard ...
    });

    // Rotas para integrações de API externa (conectadas via X-API-Key)
    Route::middleware(['resolve.api.key', 'throttle:api_external', 'rate.company'])->group(function () {
        Route::post('checkout-sessions', [\App\Http\Controllers\Api\V1\CheckoutSessionController::class, 'store']);
        Route::get('checkout-sessions/{id}', [\App\Http\Controllers\Api\V1\CheckoutSessionController::class, 'show']);
    });
```

---

## 2. Erros e Omissões de Roteamento e Middleware no Laravel API

### 2.1. Arquivo de Rotas 'routes/checkout.php' Totalmente Ignorado pelo Bootstrap
* **Arquivo**: [app.php](file:///Users/viniciusreinehr/CheckOutFINAL/apps/api/bootstrap/app.php)
* **Localização**: Linhas 11 a 24
* **Descrição do Problema**: O arquivo `routes/checkout.php` define endpoints essenciais do pagamento, como `/ck/{slug}`, `/checkout/pix/{uuid}`, `/checkout/boleto/{uuid}`, e processamento de checkout de cartões. Contudo, este arquivo não foi incluído ou carregado no bootstrap do Laravel 11. Qualquer tentativa de requisição a essas rotas resulta em erro HTTP 404.

#### Código Fonte Original:
```php
return Application::configure(basePath: dirname(__DIR__))
    ->withRouting(
        // web.php mantido apenas para redirect + /health
        web: __DIR__.'/../routes/web.php',
        // api.php com todos os endpoints v1 e v2
        api: __DIR__.'/../routes/api.php',
        // webhooks continua igual
        then: function () {
            \Illuminate\Support\Facades\Route::middleware('web')
                ->group(base_path('routes/webhook.php'));

            \Illuminate\Support\Facades\Route::middleware('api')
                ->group(base_path('routes/master.php'));
        },
    )
```

#### Código Corrigido (Plano de Resolução):
Mapear o arquivo `routes/checkout.php` sob o middleware `web` (ou criar um middleware dedicado sem verificação CSRF estrita para processamento de pagamentos):
```php
return Application::configure(basePath: dirname(__DIR__))
    ->withRouting(
        web: __DIR__.'/../routes/web.php',
        api: __DIR__.'/../routes/api.php',
        then: function () {
            // Registro explícito das rotas de checkout modularizado
            \Illuminate\Support\Facades\Route::middleware('web')
                ->group(base_path('routes/checkout.php'));

            \Illuminate\Support\Facades\Route::middleware('web')
                ->group(base_path('routes/webhook.php'));

            \Illuminate\Support\Facades\Route::middleware('api')
                ->group(base_path('routes/master.php'));
        },
    )
```

---

### 2.2. Exclusão de CSRF para Rotas de Processamento do Checkout (Erro HTTP 419)
* **Arquivo**: [app.php](file:///Users/viniciusreinehr/CheckOutFINAL/apps/api/bootstrap/app.php) ou [VerifyCsrfToken.php](file:///Users/viniciusreinehr/CheckOutFINAL/apps/api/app/Http/Middleware/VerifyCsrfToken.php)
* **Descrição do Problema**: Como as rotas de checkout rodam sobre o grupo de middleware `web` (necessário para manipulação de sessões), as requisições `POST` (ex: `/checkout/process/{uuid}`, `/pay/{uuid}/process`, `/evento/{slug}/pay`) falharão com o erro `HTTP 419 Page Expired` no momento do envio dos dados de pagamento, porque os compradores externos não possuem token de sessão CSRF ativo.
* **Solução**: No Laravel 11, as exclusões de tokens CSRF devem ser registradas na closure de configuração do middleware do bootstrap.

#### Código Corrigido em `bootstrap/app.php` (Plano de Resolução):
```php
    ->withMiddleware(function (Middleware $middleware) {
        // Exclui rotas de pagamento e processamento de verificação CSRF
        $middleware->validateCsrfTokens(except: [
            'checkout/process/*',
            'checkout/pix/process/*',
            'checkout/boleto/process/*',
            'checkout/asaas/process/*',
            'evento/*/pay',
            'pay/*/process',
            'webhooks/*',
            'webhooks/checkout'
        ]);

        $middleware->prepend(\App\Http\Middleware\RequestTracingMiddleware::class);
        // ...
    })
```

---

### 2.3. Rota de Webhook com Middleware Não Definido ('api.auth')
* **Arquivo**: [webhook.php](file:///Users/viniciusreinehr/CheckOutFINAL/apps/api/routes/webhook.php)
* **Localização**: Linha 15
* **Descrição do Problema**: A rota `POST /webhooks/checkout` está mapeada com o middleware `'api.auth'`. Contudo, se verificarmos o arquivo `bootstrap/app.php`, o alias `'api.auth'` não está definido nas configurações de middleware da aplicação, o que gera uma falha de compilação de rotas do Laravel ao tentar resolver o alias inexistente.

#### Código Fonte Original:
```php
Route::middleware('api.auth')
    ->post('/webhooks/checkout', [\App\Http\Controllers\Api\V1\VendasWebhookController::class, 'handle'])
    ->name('webhooks.vendas');
```

#### Código Corrigido em `bootstrap/app.php` (Plano de Resolução):
Mapear o alias `'api.auth'` para apontar para a classe middleware `\App\Http\Middleware\AuthenticateApi::class`:
```php
        // Route middleware aliases em bootstrap/app.php
        $middleware->alias([
            'api.auth' => \App\Http\Middleware\AuthenticateApi::class,
            'reauth' => \App\Http\Middleware\RequireReauth::class,
            'resolve.api.key' => \App\Http\Middleware\ResolveApiKey::class,
            // ...
        ]);
```

---

### 2.4. Rota de Criação de Sistemas Inexistente no Laravel
* **Arquivo**: [api.php](file:///Users/viniciusreinehr/CheckOutFINAL/apps/api/routes/api.php)
* **Localização**: Linhas 58
* **Descrição do Problema**: O front-end permite gerenciar e "cadastrar" novos sistemas de checkout, e a controller `SystemController.php` possui a lógica de persistência implementada. Entretanto, apenas o método `GET` está declarado no arquivo de rotas, impedindo a criação permanente de novos sistemas integrados através da API.

#### Código Fonte Original:
```php
        Route::get('dashboard/systems', [\App\Http\Controllers\Api\V1\Dashboard\SystemController::class, 'index']);
```

#### Código Corrigido (Plano de Resolução):
Adicionar a rota `POST` correspondente:
```php
        Route::get('dashboard/systems', [\App\Http\Controllers\Api\V1\Dashboard\SystemController::class, 'index']);
        Route::post('dashboard/systems', [\App\Http\Controllers\Api\V1\Dashboard\SystemController::class, 'store']);
        Route::get('dashboard/systems/{id}', [\App\Http\Controllers\Api\V1\Dashboard\SystemController::class, 'show']);
```

---

## 3. Inconsistência de Schema de Banco de Dados e Modelos

### 3.1. Tabela 'recovery_attempts' Inexistente no Banco de Dados
* **Arquivo de Mapeamento**: [RecoveryAttempt.php](file:///Users/viniciusreinehr/CheckOutFINAL/apps/api/app/Models/RecoveryAttempt.php) / [RecoveryService.php](file:///Users/viniciusreinehr/CheckOutFINAL/apps/api/app/Domain/Recovery/Services/RecoveryService.php)
* **Descrição do Problema**: A classe de domínio `RecoveryService` executa operações de contagem e inserção no model `RecoveryAttempt` (ex: `RecoveryAttempt::create(...)`). No entanto, **não há nenhuma migração** criando a tabela `recovery_attempts` na base PostgreSQL, gerando falhas fatais no processamento de carrinhos abandonados.

#### Script de Migração Faltante a ser Criado (Plano de Resolução):
Criação do arquivo de migração `database/migrations/2026_05_22_000000_create_recovery_attempts_table.php`:
```php
<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('recovery_attempts', function (Blueprint $table) {
            $table->id();
            $table->uuid('uuid')->unique();
            $table->foreignId('company_id')->constrained('companies')->cascadeOnDelete();
            $table->foreignId('system_id')->nullable()->constrained('connected_systems')->nullOnDelete();
            $table->foreignId('campaign_id')->constrained('recovery_campaigns')->cascadeOnDelete();
            $table->foreignId('checkout_session_id')->constrained('checkout_sessions')->cascadeOnDelete();
            $table->string('customer_email');
            $table->string('status')->default('pending'); // pending, sent, clicked, recovered, expired
            $table->string('channel'); // email, whatsapp, sms
            $table->string('relink_token', 64)->unique();
            $table->text('relink_url');
            $table->timestamp('relink_expires_at');
            $table->integer('discount_applied')->nullable(); // valor em centavos
            $table->timestamps();
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('recovery_attempts');
    }
};
```

---

### 3.2. Colunas Faltantes na Tabela 'recovery_campaigns' e Desync com a Lógica de Serviço
* **Arquivo**: [2026_05_15_140000_create_memory_and_recovery_tables.php](file:///Users/viniciusreinehr/CheckOutFINAL/apps/api/database/migrations/2026_05_15_140000_create_memory_and_recovery_tables.php)
* **Descrição do Problema**: A migração inicial da tabela `recovery_campaigns` declara apenas as colunas `id`, `company_id`, `name`, `channel`, `delay_minutes`, `status` e `content`. Entretanto, `RecoveryService.php` lê e filtra dados com base em colunas inexistentes na tabela:
  * `system_id` (para filtro de origem)
  * `trigger_event` (gatilho de abandono)
  * `max_recovery_attempts` (limite por campanha)
  * `channel_email` (booleano indicador)
  * `relink_expires_hours` (tempo de expiração do link)
  * `discount_type` e `discount_value` (cálculo de benefício)

#### Código de Migração Original:
```php
        Schema::create('recovery_campaigns', function (Blueprint $table) {
            $table->id();
            $table->foreignId('company_id')->constrained('companies')->cascadeOnDelete();
            $table->string('name');
            $table->string('channel'); // email, whatsapp, sms
            $table->integer('delay_minutes');
            $table->string('status')->default('active');
            $table->jsonb('content')->nullable(); // Template ou mensagem
            $table->timestamps();
        });
```

#### Código de Migração Corrigido (Plano de Resolução):
Criar uma nova migration complementar ou ajustar o schema inicial da seguinte forma:
```php
        Schema::create('recovery_campaigns', function (Blueprint $table) {
            $table->id();
            $table->foreignId('company_id')->constrained('companies')->cascadeOnDelete();
            $table->foreignId('system_id')->nullable()->constrained('connected_systems')->nullOnDelete();
            $table->string('name');
            $table->string('channel'); // email, whatsapp, sms
            $table->string('trigger_event'); // cart_abandoned, payment_failed, identification_left
            $table->integer('delay_minutes');
            $table->integer('max_recovery_attempts')->default(3);
            $table->boolean('channel_email')->default(true);
            $table->string('discount_type')->nullable(); // fixed, percent, none
            $table->integer('discount_value')->default(0);
            $table->integer('relink_expires_hours')->default(24);
            $table->string('status')->default('active');
            $table->jsonb('content')->nullable(); // Template ou mensagem
            $table->timestamps();
        });
```

Ajustar também o `$fillable` no model [RecoveryCampaign.php](file:///Users/viniciusreinehr/CheckOutFINAL/apps/api/app/Models/RecoveryCampaign.php) para refletir os novos campos.

---

## 4. Componentes de UI Estáticos (Mocks) vs. Integração com a API

### 4.1. Fallbacks Estáticos Escondendo Dados Reais de Webhooks
* **Arquivo**: [useWebhooks.ts](file:///Users/viniciusreinehr/CheckOutFINAL/apps/dashboard/src/hooks/api/useWebhooks.ts)
* **Localização**: Linhas 50 a 55
* **Descrição do Problema**: Mesmo quando o banco de dados do sistema está limpo, o front-end carrega dados fictícios (`mockEndpoints` e `mockDeliveries`). Isso acontece porque o hook sobrescreve arrays reais vazios (`[]`) retornados pelo Laravel, impedindo a visualização da tela inicial limpa do cliente.

#### Código Fonte Original:
```typescript
  setEndpoints(endpointsRes.data.length ? endpointsRes.data : mockEndpoints);
  setDeliveries(deliveriesRes.data.length ? deliveriesRes.data : mockDeliveries);
```

#### Código Corrigido (Plano de Resolução):
```typescript
  setEndpoints(endpointsRes.data || []);
  setDeliveries(deliveriesRes.data || []);
```

---

### 4.2. Telas de Gateways e Assinaturas Ignorando Hooks do Backend
* **Arquivos**: [gateways/page.tsx](file:///Users/viniciusreinehr/CheckOutFINAL/apps/dashboard/src/app/(dashboard)/dashboard/gateways/page.tsx) e [subscriptions/page.tsx](file:///Users/viniciusreinehr/CheckOutFINAL/apps/dashboard/src/app/(dashboard)/dashboard/subscriptions/page.tsx)
* **Descrição do Problema**: Ambas as páginas renderizam listas de dados utilizando constantes estáticas (`initialGateways` e `initialSubscriptions`) salvas no estado React local do componente. Elas não chamam os hooks de requisição real (`useGateways`), tornando a tela insensível aos cadastros e transições do banco de dados real.
* **Correção**: Implementar chamada aos hooks correspondentes do dashboard:
```typescript
  // Exemplo em gateways/page.tsx:
  const { data: gateways, isLoading, mutate } = useGateways();
```

---

### 4.3. Criação de Gateway de Pagamento Travada e Rota Faltante
* **Arquivo**: [gateways/page.tsx](file:///Users/viniciusreinehr/CheckOutFINAL/apps/dashboard/src/app/(dashboard)/dashboard/gateways/page.tsx) e [api.php](file:///Users/viniciusreinehr/CheckOutFINAL/apps/api/routes/api.php)
* **Descrição**: O botão "Novo gateway" emite apenas um alerta fictício na interface. Não existe um formulário ou modal integrado para capturar credenciais. Além disso, a rota `POST dashboard/gateways` para persistência no banco não está exposta no arquivo `api.php` do Laravel.
* **Correção**: Registrar a rota no Laravel e integrar um modal de inserção no dashboard para disparar um payload POST contendo `{ name, provider, configs: [...] }`.

---

### 4.4. Estúdio de Checkout Bloqueado para Customização e Abas Estáticas
* **Arquivo**: [studio/page.tsx](file:///Users/viniciusreinehr/CheckOutFINAL/apps/dashboard/src/app/(dashboard)/dashboard/checkouts/studio/page.tsx)
* **Descrição do Problema**:
  1. **Abas Inativas**: As guias "Estilo" e "Avançado" renderizam pequenos componentes visuais estáticos e strings pré-fixadas. O usuário não consegue manipular cores ou layouts. A aba "Avançado" deveria conter uma área de texto editável (`textarea`) para configuração direta de CSS injetado e cabeçalhos.
  2. **Lógica de Blocos Paralisada**: A edição de blocos está limitada a "hero", "checkout" e "footer". Os blocos "Etapas", "FAQ", "Depoimentos" e outros exibem toasts nulos na tela ao invés de abrir a barra lateral de parametrização dinâmica de conteúdo.

#### Código Sugerido para a Aba "Avançado" (Plano de Resolução):
```tsx
  {activePropertyTab === 'avancado' && (
    <div className="space-y-4 animate-in fade-in duration-200 p-2 text-left">
      <label className="text-[10px] font-black uppercase text-slate-400 block mb-1">
        Custom CSS & Injeção de Scripts
      </label>
      <textarea 
        className="w-full h-44 bg-slate-900 border border-slate-800 text-emerald-400 font-mono text-[10px] p-2.5 rounded-lg focus:outline-none focus:ring-1 focus:ring-brand"
        value={customCssState}
        onChange={(e) => setCustomCssState(e.target.value)}
        placeholder="/* Escreva suas regras CSS customizadas aqui */\n.checkout-button {\n  background-color: #7c3aed;\n}"
      />
      <p className="text-[9px] font-bold text-slate-400">
        Essas regras serão renderizadas na página pública de checkout.
      </p>
    </div>
  )}
```

---

### 4.5. Fluxo de Criação de Webhooks Apenas em Estado React Local
* **Arquivo**: [webhooks/page.tsx](file:///Users/viniciusreinehr/CheckOutFINAL/apps/dashboard/src/app/(dashboard)/dashboard/webhooks/page.tsx)
* **Descrição do Problema**: Ao preencher as etapas de criação de novo receptor de webhook, a função de salvamento apenas realiza um `setEndpoints([...endpoints, newWebhook])`. O webhook nunca é enviado via requisição `POST /v1/webhooks` para a API, sumindo imediatamente após qualquer atualização de página (refresh).
* **Correção**: Implementar requisição assíncrona ao backend com `apiClient` e chamar a revalidação da query dos dados.

---

## 5. Problemas de Usabilidade, Navegação e Modo Noturno

### 5.1. Conflito de Chaves e Falta de Persistência no Modo Noturno (Dark Mode)
* **Arquivos**: [ThemeToggle.tsx](file:///Users/viniciusreinehr/CheckOutFINAL/apps/dashboard/src/components/ThemeToggle.tsx) e [Topbar.tsx](file:///Users/viniciusreinehr/CheckOutFINAL/apps/dashboard/src/components/layout/Topbar.tsx)
* **Descrição do Problema**: O `ThemeToggle` lê e grava no localStorage sob o nome de chave `"basileia-theme"` (hífen). Já a `Topbar` tenta manipular o modo noturno gravando sob a chave `"basileia_theme"` (underline). Devido a esse desalinhamento, as duas instâncias de chave se sobrepõem e não sincronizam o estado de tema. Adicionalmente, a inicialização em `Topbar` lê o estado direto da classe do documento HTML em tempo de execução no cliente, gerando falhas visuais.

#### Correção Recomendada:
Padronizar a leitura e escrita do tema em todo o ecossistema utilizando uma única constante central de chave (ex: `basileia_theme`) e escutando eventos de alteração de armazenamento caso os componentes coexistam na mesma janela de visualização.

---

### 5.2. Lag de Scroll na Tela Inicial devido a Blur Rasterizado Excessivo
* **Arquivo**: [layout.tsx](file:///Users/viniciusreinehr/CheckOutFINAL/apps/dashboard/src/app/(dashboard)/layout.tsx)
* **Localização**: Linhas 11 e 12
* **Descrição**: Os filtros `blur-[160px]` e `blur-[140px]` aplicados em duas divs decorativas sobrepostas causam atrasos perceptíveis ao rolar a página em navegadores baseados em Chromium. O cálculo de desfoque extremo em resoluções altas força a repintura (repaint) contínua da viewport via CPU.

#### Código Fonte Original:
```tsx
        <div className="absolute top-[-15%] left-[-5%] w-[45%] h-[45%] bg-brand/5 rounded-full blur-[160px] pointer-events-none" />
        <div className="absolute bottom-[-10%] right-[10%] w-[35%] h-[35%] bg-brand-accent/5 rounded-full blur-[140px] pointer-events-none" />
```

#### Código Corrigido (Plano de Resolução):
Substituir o filtro dinâmico de desfoque por um gradiente radial puro em CSS (radial-gradient), reduzindo o processamento gráfico de renderização:
```tsx
        <div className="absolute top-[-15%] left-[-5%] w-[45%] h-[45%] bg-[radial-gradient(circle,rgba(124,58,237,0.06)_0%,transparent_70%)] rounded-full pointer-events-none" />
        <div className="absolute bottom-[-10%] right-[10%] w-[35%] h-[35%] bg-[radial-gradient(circle,rgba(236,72,153,0.06)_0%,transparent_70%)] rounded-full pointer-events-none" />
```
*(Se o visual com desfoque exato for estritamente necessário, injetar as propriedades `will-change: transform` e `transform: translate3d(0,0,0)` para mover a rasterização para a placa gráfica/GPU).*

---

### 5.3. Rolagem Indesejada da Barra Lateral (Sidebar) com o Conteúdo da Página
* **Arquivo**: [layout.tsx](file:///Users/viniciusreinehr/CheckOutFINAL/apps/dashboard/src/app/(dashboard)/layout.tsx)
* **Descrição do Problema**: A barra lateral de navegação interna do Dashboard não possui altura travada independente, rolando junto com o scroll do corpo principal da página quando as tabelas ou relatórios são longos. Isso prejudica a experiência e usabilidade do usuário, que perde acesso aos links de navegação rápida ao ler o final da página.
* **Correção**: Travar o container do layout principal e atribuir rolagem exclusiva para a área de conteúdo (`main`).

#### Estrutura Corrigida no Layout Principal (Plano de Resolução):
```tsx
export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  return (
    <AuthGuard>
      <div className="h-screen w-full bg-[#F4F0FF] p-1.5 2xl:p-2.5 relative font-sans overflow-hidden">
        {/* Overlays decorativas pré-renderizadas */}
        <div className="w-full h-full relative z-10 flex">
          <Sidebar />
          
          <main className="flex-1 flex flex-col min-w-0 pl-4 h-full overflow-y-auto">
            <Topbar />
            
            <div className="flex-1 pt-1.5 pb-10">
              <div className="w-full min-w-0 px-1">
                {children}
              </div>
            </div>
          </main>
        </div>
      </div>
    </AuthGuard>
  );
}
```

---

### 5.4. Redirecionamento Incorreto do Link de Alertas na Barra Lateral
* **Arquivo**: [Sidebar.tsx](file:///Users/viniciusreinehr/CheckOutFINAL/apps/dashboard/src/components/layout/Sidebar.tsx)
* **Localização**: Linha 41
* **Descrição do Problema**: A aba "Alertas" do hub executivo na barra lateral possui o link apontando para `/dashboard/trust` (que renderiza a tela de simulação de cargor e antifraude), em vez de redirecionar para a tela operacional correspondente de alertas localizada em `/dashboard/alerts`.

#### Código Fonte Original:
```typescript
      { name: 'Alertas', icon: Bell, href: '/dashboard/trust' }
```

#### Código Corrigido (Plano de Resolução):
```typescript
      { name: 'Alertas', icon: Bell, href: '/dashboard/alerts' }
```

---

## 6. Divergência na Documentação de Desenvolvedor (API Docs)

### 6.1. Endpoint Incorreto de Criação de Checkout no Painel de Desenvolvedores
* **Arquivos**: [DeveloperDocsViewer.tsx](file:///Users/viniciusreinehr/CheckOutFINAL/apps/dashboard/src/components/developers/DeveloperDocsViewer.tsx) (Linha 123) e [DeveloperSandboxPanel.tsx](file:///Users/viniciusreinehr/CheckOutFINAL/apps/dashboard/src/components/developers/DeveloperSandboxPanel.tsx) (Linha 73)
* **Descrição do Problema**: A documentação instrui os programadores a dispararem requisições HTTP `POST` para o endpoint `/v1/checkouts` enviando o campo `system_id`. No entanto, na API real do Laravel, o endpoint foi declarado como `POST /v1/checkout-sessions` (ver [api.php](file:///Users/viniciusreinehr/CheckOutFINAL/apps/api/routes/api.php#L28)) e a validação do formulário (`CreateCheckoutSessionRequest.php`) exige o envio de `checkout_id` (ID da experiência estética cadastrada) e não `system_id`. Seguir a documentação integrada gerará erro de endpoint ausente (404) ou validação violada (422) aos integradores.

#### Detalhes do Desalinhamento:
* **Documentado**: `POST /v1/checkouts` enviando `{ "system_id": "sys_..." }`
* **API Real**: `POST /v1/checkout-sessions` enviando `{ "checkout_id": 1, "amount": 1000 }` (Mais o cabeçalho obrigatório `Idempotency-Key` e chave de integração `X-API-Key`).

#### Correção Sugerida para as Telas de Documentação (Plano de Resolução):
Atualizar todos os textos de exemplos no front-end para exibir o endpoint `/v1/checkout-sessions` e instruir o envio dos parâmetros obrigatórios corretos conforme a validação real do Laravel API.

---

## 7. Informações de Configurações Reais (Host do Checkout)

### 7.1. Chave de Configuração Incorreta para o Host do Checkout Session no Laravel
* **Arquivos**: [CheckoutSessionController.php](file:///Users/viniciusreinehr/CheckOutFINAL/apps/api/app/Http/Controllers/Api/V1/CheckoutSessionController.php#L88), [CheckoutPreviewService.php](file:///Users/viniciusreinehr/CheckOutFINAL/apps/api/app/Services/Studio/CheckoutPreviewService.php#L34), e [SendRecoveryEmailJob.php](file:///Users/viniciusreinehr/CheckOutFINAL/apps/api/app/Jobs/SendRecoveryEmailJob.php#L48)
* **Descrição do Problema**: O backend monta o link absoluto que é retornado na geração da sessão ou e-mail de recuperação invocando `config('app.checkout_url')`. Porém, esta configuração retorna `null` porque o parâmetro foi configurado sob o arquivo proprietário de configurações do sistema: `config/basileia.php` (`checkout_url`).

#### Código Fonte Original:
```php
config('app.checkout_url')
```

#### Código Corrigido (Plano de Resolução):
```php
config('basileia.checkout_url')
```

---

*Fim da auditoria técnica. Todos os itens de código mapeados acima estão detalhados para orientar as correções prioritárias.*
