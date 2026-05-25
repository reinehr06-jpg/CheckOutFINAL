<?php

namespace App\Http\Controllers\Api\V1\Dashboard;

use App\Http\Controllers\Controller;
use App\Models\Gateway;
use App\Models\GatewayAccount;
use App\Models\GatewayHealthSnapshot;
use App\Services\Gateway\GatewayEngine;
use App\Services\TenantContext;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Str;

class GatewayController extends Controller
{
    public function __construct(
        private readonly GatewayEngine $engine,
    ) {}

    public function index(): JsonResponse
    {
        $companyId = TenantContext::companyId();

        $gateways = Gateway::where('company_id', $companyId)
            ->latest()
            ->get();

        return response()->json([
            'success' => true,
            'data' => $gateways->map(fn(Gateway $g) => [
                'id' => $g->id,
                'slug' => $g->slug,
                'name' => $g->name,
                'provider' => $g->type,
                'environment' => $g->getConfig('environment', 'sandbox'),
                'status' => $g->status,
                'is_default' => $g->is_default,
                'last_tested_at' => $g->last_tested_at?->format('d/m/Y H:i'),
                'last_test_status' => $g->last_test_status,
                'circuit_state' => $this->engine->getCircuitBreaker()->getState($g),
                'account_uuid' => $g->gatewayAccount?->uuid,
            ]),
        ]);
    }

    public function store(Request $request): JsonResponse
    {
        $validated = $request->validate([
            'name' => 'required|string|max:255',
            'provider' => 'required|string',
            'environment' => 'required|in:sandbox,production',
            'credentials' => 'required|array',
        ]);

        $companyId = TenantContext::companyId();
        $slug = strtolower($validated['provider']);

        $gateway = Gateway::firstOrCreate(
            ['company_id' => $companyId, 'slug' => $slug],
            [
                'name' => $validated['name'],
                'type' => $slug,
                'status' => 'active',
                'is_default' => !Gateway::where('company_id', $companyId)->exists(),
            ]
        );

        $gateway->setConfig('environment', $validated['environment']);

        $gatewayAccount = GatewayAccount::create([
            'company_id' => $companyId,
            'uuid' => Str::uuid(),
            'name' => $validated['name'],
            'gateway_type' => $slug,
            'environment' => $validated['environment'],
            'status' => 'active',
        ]);

        $result = $this->engine->connect($gateway, $validated['credentials']);

        return response()->json([
            'success' => true,
            'data' => [
                'gateway' => [
                    'id' => $gateway->id,
                    'slug' => $gateway->slug,
                    'name' => $gateway->name,
                    'provider' => $gateway->type,
                    'status' => $gateway->status,
                ],
                'account' => [
                    'uuid' => $gatewayAccount->uuid,
                    'name' => $gatewayAccount->name,
                    'environment' => $gatewayAccount->environment,
                ],
                'connection' => [
                    'success' => $result->success,
                    'message' => $result->message,
                    'latency_ms' => $result->latencyMs,
                ],
            ],
        ], 201);
    }

    public function show(string $uuid): JsonResponse
    {
        $account = $this->resolveGatewayAccount($uuid);
        $gateway = $this->resolveGateway($account);

        $circuitState = $this->engine->getCircuitBreaker()->getState($gateway);
        $failures = $this->engine->getCircuitBreaker()->consecutiveFailures($gateway);

        $latestSnapshot = GatewayHealthSnapshot::where('gateway_id', $gateway->id)
            ->latest()
            ->first();

        return response()->json([
            'success' => true,
            'data' => [
                'gateway' => [
                    'id' => $gateway->id,
                    'slug' => $gateway->slug,
                    'name' => $gateway->name,
                    'provider' => $gateway->type,
                    'status' => $gateway->status,
                    'is_default' => $gateway->is_default,
                    'last_tested_at' => $gateway->last_tested_at?->format('d/m/Y H:i'),
                    'last_test_status' => $gateway->last_test_status,
                ],
                'account' => [
                    'uuid' => $account->uuid,
                    'name' => $account->name,
                    'environment' => $account->environment,
                    'status' => $account->status,
                    'gateway_type' => $account->gateway_type,
                    'settings' => $account->settings,
                ],
                'circuit_breaker' => [
                    'state' => $circuitState,
                    'consecutive_failures' => $failures,
                ],
                'health' => $latestSnapshot ? [
                    'approval_rate' => $latestSnapshot->approval_rate,
                    'failure_rate' => $latestSnapshot->failure_rate,
                    'avg_latency_ms' => $latestSnapshot->avg_latency_ms,
                    'total_transactions' => $latestSnapshot->total_transactions,
                    'last_approved_at' => $latestSnapshot->last_approved_at?->format('d/m/Y H:i'),
                    'last_failed_at' => $latestSnapshot->last_failed_at?->format('d/m/Y H:i'),
                ] : null,
                'capabilities' => $this->engine->getRegistry()->getCapabilities()[$gateway->type] ?? [],
            ],
        ]);
    }

    public function update(Request $request, string $uuid): JsonResponse
    {
        $account = $this->resolveGatewayAccount($uuid);
        $gateway = $this->resolveGateway($account);

        $validated = $request->validate([
            'name' => 'sometimes|string|max:255',
            'environment' => 'sometimes|in:sandbox,production',
            'credentials' => 'sometimes|array',
        ]);

        if (isset($validated['name'])) {
            $account->update(['name' => $validated['name']]);
        }

        if (isset($validated['environment'])) {
            $account->update(['environment' => $validated['environment']]);
            $gateway->setConfig('environment', $validated['environment']);
        }

        if (isset($validated['credentials'])) {
            $this->engine->connect($gateway, $validated['credentials']);
        }

        return response()->json([
            'success' => true,
            'message' => 'Gateway updated successfully.',
        ]);
    }

    public function destroy(string $uuid): JsonResponse
    {
        $account = $this->resolveGatewayAccount($uuid);
        $gateway = $this->resolveGateway($account);

        $activePayments = $account->payments()
            ->whereIn('status', ['pending', 'processing'])
            ->count();

        if ($activePayments > 0) {
            return response()->json([
                'success' => false,
                'message' => "Cannot delete gateway: {$activePayments} active payment(s) in progress.",
            ], 409);
        }

        $this->engine->disconnect($gateway, 'deleted');

        $account->delete();

        return response()->json([
            'success' => true,
            'message' => 'Gateway deleted successfully.',
        ]);
    }

    public function test(string $uuid): JsonResponse
    {
        $account = $this->resolveGatewayAccount($uuid);
        $gateway = $this->resolveGateway($account);

        $result = $this->engine->test($gateway);

        $statusCode = $result->success ? 200 : 502;

        return response()->json([
            'success' => $result->success,
            'status' => $result->success ? 'success' : 'failed',
            'message' => $result->message,
            'latency_ms' => $result->latencyMs,
            'provider_info' => $result->providerInfo,
            'errors' => $result->errors,
        ], $statusCode);
    }

    public function health(string $uuid): JsonResponse
    {
        $account = $this->resolveGatewayAccount($uuid);
        $gateway = $this->resolveGateway($account);

        $snapshots = GatewayHealthSnapshot::where('gateway_id', $gateway->id)
            ->latest()
            ->take(50)
            ->get()
            ->map(fn(GatewayHealthSnapshot $s) => [
                'id' => $s->id,
                'approval_rate' => $s->approval_rate,
                'failure_rate' => $s->failure_rate,
                'avg_latency_ms' => $s->avg_latency_ms,
                'timeout_count' => $s->timeout_count,
                'total_transactions' => $s->total_transactions,
                'last_approved_at' => $s->last_approved_at?->format('d/m/Y H:i'),
                'last_failed_at' => $s->last_failed_at?->format('d/m/Y H:i'),
                'recorded_at' => $s->created_at?->format('d/m/Y H:i'),
            ]);

        $circuitState = $this->engine->getCircuitBreaker()->getState($gateway);
        $failures = $this->engine->getCircuitBreaker()->consecutiveFailures($gateway);

        return response()->json([
            'success' => true,
            'data' => [
                'gateway' => [
                    'id' => $gateway->id,
                    'name' => $gateway->name,
                    'slug' => $gateway->slug,
                    'status' => $gateway->status,
                ],
                'circuit_breaker' => [
                    'state' => $circuitState,
                    'consecutive_failures' => $failures,
                ],
                'snapshots' => $snapshots,
            ],
        ]);
    }

    public function capabilities(): JsonResponse
    {
        $capabilities = $this->engine->getRegistry()->getCapabilities();

        return response()->json([
            'success' => true,
            'data' => $capabilities,
        ]);
    }

    private function resolveGatewayAccount(string $uuid): GatewayAccount
    {
        return GatewayAccount::where('company_id', TenantContext::companyId())
            ->where('uuid', $uuid)
            ->firstOrFail();
    }

    private function resolveGateway(GatewayAccount $account): Gateway
    {
        $slug = strtolower($account->gateway_type);

        return Gateway::firstOrCreate(
            ['company_id' => $account->company_id, 'slug' => $slug],
            [
                'name' => $account->name,
                'type' => $slug,
                'status' => $account->status ?? 'active',
                'is_default' => !Gateway::where('company_id', $account->company_id)->exists(),
            ]
        );
    }
}
