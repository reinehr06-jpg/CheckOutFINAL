# Relatório de Auditoria e Mapeamento de Falhas Críticas — Basileia Pay

Este documento apresenta uma análise detalhada da arquitetura do sistema, identificando falhas de segurança críticas (como bypass de autenticação), dados mockados persistentes no frontend que impedem um estado limpo, endpoints órfãos ou ausentes no Laravel API, botões e funcionalidades sem lógica real no painel e inconsistências na estilização e usabilidade (Scroll Lag, Dark Mode, Sidebar).

---

## 1. Segurança e Controle de Acesso (Crítico)

### 1.1. Bypass de Autenticação no Dashboard
* **Arquivo**: `apps/dashboard/src/app/(dashboard)/layout.tsx`
* **Problema**: O arquivo de layout do grupo de rotas do painel `DashboardLayout` renderiza os componentes internos (`Topbar`, `Sidebar`, e `children`) de forma direta, sem nenhuma validação de login ou encapsulamento no guardião de rotas.
* **Causa**: O componente `AuthGuard` (definido em [AuthGuard.tsx](file:///Users/viniciusreinehr/CheckOutFINAL/apps/dashboard/src/components/auth/AuthGuard.tsx)) existe, mas não está sendo importado nem encapsulando os filhos no layout principal do painel. Qualquer usuário que digite `/dashboard` diretamente no navegador entra no painel principal sem possuir um token ativo.
* **Como Corrigir**: Importar `AuthGuard` e encapsular o retorno HTML principal do layout dentro dele:
  ```tsx
  import { AuthGuard } from '@/components/auth/AuthGuard';
  // ...
  return (
    <AuthGuard>
      <div className="min-h-screen w-full ...">
        {/* Resto do layout */}
      </div>
    </AuthGuard>
  );
  ```

### 1.2. Requisições sem Token Bearer no Cliente de API
* **Arquivo**: `apps/dashboard/src/lib/api/client.ts`
* **Problema**: O cliente de requisições `apiClient` realiza requisições `fetch` para o backend sem ler o token salvo no `localStorage` sob a chave `basileia_token`. Isso fará com que qualquer chamada real para o backend protegido falhe com HTTP 401.
* **Como Corrigir**: Alterar o `apiClient` para obter e anexar o token de autenticação no cabeçalho `Authorization`:
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
  ```

---

## 2. Dados Fictícios (Mock) vs. Estado Limpo do Sistema

### 2.1. Fallback de Webhooks para Dados Fixos
* **Arquivo**: `apps/dashboard/src/hooks/api/useWebhooks.ts`
* **Problema**: Mesmo que o banco de dados esteja limpo e o backend retorne um array vazio `[]`, a interface do usuário carrega os registros mockados `mockEndpoints` e `mockDeliveries`.
* **Causa**: No hook `useWebhooks`, as funções tratam o retorno de tamanho `0` como falha ou forçam o preenchimento caso a lista de dados esteja vazia:
  ```typescript
  setEndpoints(endpointsRes.data.length ? endpointsRes.data : mockEndpoints);
  setDeliveries(deliveriesRes.data.length ? deliveriesRes.data : mockDeliveries);
  ```
* **Como Corrigir**: Alterar a lógica para inicializar com arrays vazios `[]` e definir apenas o retorno da API, exibindo dados reais ou o estado vazio nativo:
  ```typescript
  setEndpoints(endpointsRes.data || []);
  setDeliveries(deliveriesRes.data || []);
  ```

### 2.2. Telas de Gateways e Assinaturas Totalmente Estáticas
* **Arquivos**: 
  * [gateways/page.tsx](file:///Users/viniciusreinehr/CheckOutFINAL/apps/dashboard/src/app/(dashboard)/dashboard/gateways/page.tsx)
  * [subscriptions/page.tsx](file:///Users/viniciusreinehr/CheckOutFINAL/apps/dashboard/src/app/(dashboard)/dashboard/subscriptions/page.tsx)
* **Problema**: Ambas as telas utilizam variáveis estáticas locais (`initialGateways` e `initialSubscriptions`) diretamente no estado do componente. Elas não chamam os hooks correspondentes (`useGateways.ts` no caso de gateways) para buscar os dados cadastrados na API. Isso impede que os dados reais inseridos no banco apareçam na tela.
* **Como Corrigir**: Integrar as telas com os hooks de API correspondentes e remover os dados fictícios locais.

---

## 3. Integração de Sistemas e Fluxos de Checkout

### 3.1. Rota de Criação de Sistema Ausente no Laravel
* **Arquivo**: `apps/api/routes/api.php`
* **Problema**: O backend possui o método `store` implementado em [SystemController.php](file:///Users/viniciusreinehr/CheckOutFINAL/apps/api/app/Http/Controllers/Api/V1/Dashboard/SystemController.php#L53), mas não existe rota registrada no arquivo de rotas para a criação de sistemas. Apenas o método `GET` está mapeado.
* **Como Corrigir**: Registrar o endpoint `POST` no grupo de rotas protegidas em `routes/api.php`:
  ```php
  Route::get('dashboard/systems', [\App\Http\Controllers\Api\V1\Dashboard\SystemController::class, 'index']);
  Route::post('dashboard/systems', [\App\Http\Controllers\Api\V1\Dashboard\SystemController::class, 'store']);
  Route::get('dashboard/systems/{id}', [\App\Http\Controllers\Api\V1\Dashboard\SystemController::class, 'show']);
  ```

### 3.2. Criação de Sistema Apenas Visual no Frontend
* **Arquivo**: `apps/dashboard/src/app/(dashboard)/dashboard/systems/page.tsx`
* **Problema**: No modal de criação de novo sistema, ao preencher o formulário, o manipulador `onSubmit` apenas previne o comportamento padrão e fecha o modal (`onSubmit={e => { e.preventDefault(); setShowNew(false); }}`). O formulário não faz nenhuma requisição HTTP `POST` para salvar o novo sistema na API.
* **Como Corrigir**: Adicionar a integração utilizando a chamada `apiClient` para realizar o `POST` para `/api/v1/dashboard/systems`.

### 3.3. Configuração Incorreta do Host de Redirecionamento de Checkout
* **Arquivos**:
  * [CheckoutSessionController.php](file:///Users/viniciusreinehr/CheckOutFINAL/apps/api/app/Http/Controllers/Api/V1/CheckoutSessionController.php#L88)
  * [CheckoutPreviewService.php](file:///Users/viniciusreinehr/CheckOutFINAL/apps/api/app/Services/Studio/CheckoutPreviewService.php#L34)
  * [SendRecoveryEmailJob.php](file:///Users/viniciusreinehr/CheckOutFINAL/apps/api/app/Jobs/SendRecoveryEmailJob.php#L48)
* **Problema**: Ao gerar o link de pagamento final, o backend usa a configuração `config('app.checkout_url')` que retorna `null`.
* **Causa**: O parâmetro está cadastrado no arquivo customizado de configuração do sistema `config/basileia.php` sob a chave `'checkout_url'`, e não no arquivo padrão `config/app.php`.
* **Como Corrigir**: Alterar as chamadas nos três arquivos para ler a chave de configuração correta:
  ```php
  config('basileia.checkout_url')
  ```

### 3.4. Ausência do Serviço de Checkout e Rotas Reversas no Proxy Nginx
* **Arquivos**: 
  * [docker-compose.yml](file:///Users/viniciusreinehr/CheckOutFINAL/docker-compose.yml)
  * [infra/nginx/default.conf](file:///Users/viniciusreinehr/CheckOutFINAL/infra/nginx/default.conf)
* **Problema**: O serviço Next.js de Checkout (`apps/checkout`) não está definido nas tags de serviços do `docker-compose.yml`. Além disso, o Nginx não possui regras de direcionamento configuradas para as rotas `/pay/` ou `/ck/`. Logo, os clientes não conseguem acessar o visualizador de pagamento.
* **Como Corrigir**: 
  1. Adicionar o serviço `checkout` no `docker-compose.yml`:
     ```yaml
     checkout:
       build:
         context: ./apps/checkout
         dockerfile: Dockerfile
       restart: unless-stopped
       environment:
         - NEXT_PUBLIC_API_URL=/api
         - NODE_ENV=production
     ```
  2. Adicionar as regras de localização no `default.conf` do Nginx para encaminhar o fluxo de pagamento para o container do checkout:
     ```nginx
     location /pay/ {
         proxy_pass http://checkout:3000;
         # ... headers de proxy
     }
     location /ck/ {
         proxy_pass http://checkout:3000;
         # ... headers de proxy
     }
     ```

---

## 4. Botões e Funcionalidades Não Operantes (Mocks de UI)

### 4.1. Estúdio de Checkout (Totalmente Travado)
* **Arquivo**: [studio/page.tsx](file:///Users/viniciusreinehr/CheckOutFINAL/apps/dashboard/src/app/(dashboard)/dashboard/checkouts/studio/page.tsx)
* **Problemas identificados**:
  * **Estilo e Avançado**: As abas de estilo (`activePropertyTab === 'estilo'`) e avançado (`activePropertyTab === 'avancado'`) renderizam apenas pequenos componentes estáticos/códigos de exemplo fixos. A aba avançada deveria apresentar um campo `textarea` para manipulação real de folha de estilo (CSS).
  * **Falta de Lógica em Blocos**: A variável de estado `selectedBlock` apenas suporta as opções `'hero' | 'checkout' | 'footer'`. Os demais blocos listados na lateral esquerda (Etapas, Resumo do Pedido, Produtos, Benefícios, Depoimentos, Garantia e FAQ) disparam apenas um alerta visual de tela (toast), não tendo suporte a cliques ou áreas de edição no formulário lateral.
  * **Pontos de Atenção**: As marcações e avisos visuais no painel de edição do canvas não possuem ações programadas no código e servem apenas como preenchimento estético.

### 4.2. Fluxo de Exportação Estático
* **Arquivos**: 
  * [gateways/page.tsx](file:///Users/viniciusreinehr/CheckOutFINAL/apps/dashboard/src/app/(dashboard)/dashboard/gateways/page.tsx#L576)
  * [subscriptions/page.tsx](file:///Users/viniciusreinehr/CheckOutFINAL/apps/dashboard/src/app/(dashboard)/dashboard/subscriptions/page.tsx#L694)
* **Problema**: O botão "Exportar" dispara apenas um toast avisando que a exportação foi iniciada. Ele deve renderizar um menu de seleção (Dropdown) ou abrir um Modal com as opções de exportação em PDF, CSV e Excel, integrados com rotas de download do Laravel API.

### 4.3. Criação de Gateway de Pagamento
* **Arquivo**: [gateways/page.tsx](file:///Users/viniciusreinehr/CheckOutFINAL/apps/dashboard/src/app/(dashboard)/dashboard/gateways/page.tsx#L585)
* **Problema**: O botão "Novo gateway" apenas chama o toast de simulação e não abre nenhuma caixa de configuração. O Laravel API possui a lógica completa de persistência e criptografia de credenciais em `GatewayController@store`, porém a rota `POST dashboard/gateways` está ausente em `routes/api.php` e não existe formulário integrado no dashboard.

### 4.4. Ações de Auditoria e Ocorrências
* **Arquivo**: [orders/page.tsx](file:///Users/viniciusreinehr/CheckOutFINAL/apps/dashboard/src/app/(dashboard)/dashboard/orders/page.tsx)
* **Problemas**:
  * O botão de "Conciliação" financeiro apenas aciona um toast e não executa o fluxo prático.
  * O botão "Ver todas as ocorrências" também é mockado via toast e não possui direcionamento ou filtro de log funcional.
  * As opções "Ver" contidas nos cartões de "Pontos de Atenção" não filtram a listagem principal de pedidos.

### 4.5. Criação de Webhooks
* **Arquivo**: [webhooks/page.tsx](file:///Users/viniciusreinehr/CheckOutFINAL/apps/dashboard/src/app/(dashboard)/dashboard/webhooks/page.tsx#L200)
* **Problema**: A criação de webhook no modal de duas etapas adiciona o webhook apenas no estado local React da tabela (`setEndpoints`). Não há nenhuma requisição HTTP `POST` para salvar permanentemente a URL do receptor no banco de dados.

### 4.6. Módulo de Recuperação (Recovery) Órfão
* **Arquivos**:
  * [recovery/page.tsx](file:///Users/viniciusreinehr/CheckOutFINAL/apps/dashboard/src/app/(dashboard)/recovery/page.tsx)
  * [api.php](file:///Users/viniciusreinehr/CheckOutFINAL/apps/api/routes/api.php)
* **Problema**: O painel de Recovery do frontend exibe gráficos e listas de sessões abandonadas puramente fixas (estáticas). No backend, embora exista o controller [RecoveryController.php](file:///Users/viniciusreinehr/CheckOutFINAL/apps/api/app/Http/Controllers/Api/V1/RecoveryController.php), não existem rotas registradas em `api.php` para `/v1/recovery/campaigns`, `/v1/recovery/attempts` ou `/v1/recovery/stats`.

### 4.7. Redirecionamento Incorreto de Alertas
* **Arquivo**: [Sidebar.tsx](file:///Users/viniciusreinehr/CheckOutFINAL/apps/dashboard/src/components/layout/Sidebar.tsx#L39)
* **Problemas**:
  * A aba "Alertas" na barra lateral redireciona o usuário para `/dashboard/trust` (Trust Layer) em vez de enviá-lo para a tela correta `/alerts` (Central de Alertas).
  * O botão "Ver todos os alertas" na barra lateral operacional da página inicial e no sumário de sistemas são apenas botões nulos sem comportamento de clique.
  * **Simulador de Status**: Como a barra lateral envia o usuário incorretamente para o painel antifraude (`/dashboard/trust`), ele se depara com o bloco de simulação de cargo e indisponibilidade de sistema, que não deve estar associado a rotas operacionais do usuário final.

---

## 5. Documentação da API Desatualizada

* **Arquivo**: [DeveloperDocsViewer.tsx](file:///Users/viniciusreinehr/CheckOutFINAL/apps/dashboard/src/components/developers/DeveloperDocsViewer.tsx#L123)
* **Problema**: O visualizador de documentação de desenvolvedores dentro do dashboard instrui a criação de checkout apontando para `POST /v1/checkouts` enviando o campo `system_id`. No entanto:
  1. A rota real no Laravel API é `POST /v1/checkout-sessions` (veja em [api.php](file:///Users/viniciusreinehr/CheckOutFINAL/apps/api/routes/api.php#L28)).
  2. O validador da requisição (`CreateCheckoutSessionRequest.php`) exige o parâmetro `checkout_id` e não `system_id`.
* **Impacto**: Desenvolvedores externos que seguirem a documentação integrada obterão erros HTTP 404 ou 422 ao tentar integrar seus sistemas.

---

## 6. Bugs de Estilo, Interface e Performance

### 6.1. Inconsistência de Chaves do Modo Noturno (Dark Mode)
* **Arquivos**:
  * [Topbar.tsx](file:///Users/viniciusreinehr/CheckOutFINAL/apps/dashboard/src/components/layout/Topbar.tsx#L49) (Chave utilizada: `basileia_theme`)
  * [ThemeToggle.tsx](file:///Users/viniciusreinehr/CheckOutFINAL/apps/dashboard/src/components/ThemeToggle.tsx#L11) (Chave utilizada: `basileia-theme`)
* **Problema**: Há uma divergência na chave de gravação do localStorage. Além disso, o layout inicial (`layout.tsx`) não lê nenhuma destas chaves durante a montagem do documento html. O estado da variável `dark` em `Topbar.tsx` inicia com base em `document.documentElement.classList.contains('dark')` (que sempre carrega vazio do lado do servidor), impedindo que o tema noturno persista após recarregar a página.

### 6.2. Rolagem da Barra Lateral (Sidebar)
* **Arquivo**: [layout.tsx](file:///Users/viniciusreinehr/CheckOutFINAL/apps/dashboard/src/app/(dashboard)/layout.tsx)
* **Problema**: A barra lateral rola junto com o conteúdo da página porque a altura da tela não é travada. O comportamento padrão ideal para painéis administrativos é travar a tela externa e permitir rolagem apenas no box do conteúdo e nas subfunções da barra lateral.
* **Solução recomendada**:
  1. Alterar o container pai no layout do painel para ter altura travada (`h-screen overflow-hidden`).
  2. Definir a tag `main` ou a área de conteúdo do layout com rolagem independente (`overflow-y-auto`).

### 6.3. Lag de Scroll na Tela Inicial
* **Arquivo**: [layout.tsx](file:///Users/viniciusreinehr/CheckOutFINAL/apps/dashboard/src/app/(dashboard)/layout.tsx#L10)
* **Problema**: O uso de filtros com raio de desfoque excessivo (`blur-[160px]` e `blur-[140px]`) em overlays decorativas de luz de fundo causa lag perceptível ao rolar a página em navegadores baseados em Chromium e WebKit, pois força a repintura constante de filtros rasterizados complexos.
* **Solução recomendada**: Substituir os filtros de blur extremos por gradientes CSS radiais pré-renderizados, ou aplicar as propriedades CSS `will-change-transform` e `transform: translate3d(0,0,0)` para forçar a renderização acelerada por hardware (GPU).
