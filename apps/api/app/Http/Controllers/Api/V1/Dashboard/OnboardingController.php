<?php

namespace App\Http\Controllers\Api\V1\Dashboard;

use App\Http\Controllers\Controller;
use App\Models\CheckoutExperience;
use App\Models\CheckoutExperienceVersion;
use App\Models\ConnectedSystem;
use App\Models\GatewayAccount;
use App\Services\TenantContext;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Str;

class OnboardingController extends Controller
{
    public function status(): JsonResponse
    {
        $companyId = TenantContext::companyId();

        $hasSystem = ConnectedSystem::where('company_id', $companyId)->exists();
        $hasGateway = GatewayAccount::where('company_id', $companyId)->exists();
        $hasGatewayTested = GatewayAccount::where('company_id', $companyId)
            ->where('last_test_status', 'success')
            ->exists();
        $hasCheckout = CheckoutExperience::where('company_id', $companyId)->exists();
        $hasPublished = CheckoutExperience::where('company_id', $companyId)
            ->whereNotNull('published_version_id')
            ->exists();
        $hasTestTransaction = false;

        $currentStep = match (true) {
            !$hasSystem => 1,
            !$hasGateway || !$hasGatewayTested => 3,
            !$hasCheckout => 4,
            !$hasPublished => 5,
            default => 6,
        };

        return response()->json([
            'success' => true,
            'data' => [
                'has_system' => $hasSystem,
                'has_gateway' => $hasGateway,
                'has_gateway_tested' => $hasGatewayTested,
                'has_checkout' => $hasCheckout,
                'has_published' => $hasPublished,
                'has_test_transaction' => $hasTestTransaction,
                'current_step' => $currentStep,
            ],
        ]);
    }

    public function publishCheckout(Request $request): JsonResponse
    {
        $companyId = TenantContext::companyId();

        $checkout = CheckoutExperience::where('company_id', $companyId)
            ->whereNull('published_version_id')
            ->first();

        if (!$checkout) {
            return response()->json([
                'success' => false,
                'message' => 'Nenhum checkout pendente de publicação encontrado.',
            ], 404);
        }

        $version = CheckoutExperienceVersion::create([
            'uuid' => Str::uuid(),
            'checkout_experience_id' => $checkout->id,
            'company_id' => $companyId,
            'config_json' => $request->config_json ?? ($checkout->config_json ?? []),
            'status' => 'published',
        ]);

        $checkout->update([
            'published_version_id' => $version->id,
            'status' => 'active',
        ]);

        return response()->json([
            'success' => true,
            'data' => $version,
        ]);
    }
}
