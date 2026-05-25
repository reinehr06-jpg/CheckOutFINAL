<?php

namespace App\Http\Controllers\Api\V1;

use App\Http\Controllers\Controller;
use App\Models\CheckoutExperience;
use App\Models\CheckoutExperienceVersion;
use App\Models\BlockPreset;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Str;

class StudioController extends Controller
{
    public function index(): JsonResponse
    {
        $checkouts = CheckoutExperience::where('company_id', \App\Services\TenantContext::companyId())
            ->with(['publishedVersion'])
            ->get();

        return response()->json([
            'success' => true,
            'data' => $checkouts->map(fn($c) => [
                'id' => $c->id,
                'uuid' => $c->uuid,
                'name' => $c->name,
                'slug' => $c->slug,
                'status' => $c->status,
                'published_version' => $c->publishedVersion?->uuid,
                'created_at' => $c->created_at->format('d/m/Y H:i'),
            ])
        ]);
    }

    public function store(Request $request): JsonResponse
    {
        $validated = $request->validate([
            'name' => 'required|string|max:255',
            'theme_color' => 'nullable|string|max:7',
            'allow_pix' => 'boolean',
            'allow_card' => 'boolean',
            'system_uuid' => 'nullable|string|exists:connected_systems,uuid',
        ]);

        $checkout = CheckoutExperience::create([
            'uuid' => Str::uuid(),
            'company_id' => \App\Services\TenantContext::companyId(),
            'name' => $validated['name'],
            'slug' => Str::slug($validated['name']),
            'status' => 'draft',
            'config_json' => [
                'theme_color' => $validated['theme_color'] ?? '#8B5CF6',
                'allow_pix' => $validated['allow_pix'] ?? true,
                'allow_card' => $validated['allow_card'] ?? true,
            ],
        ]);

        return response()->json([
            'success' => true,
            'data' => $checkout,
        ], 201);
    }

    public function show(string $id): JsonResponse
    {
        $checkout = CheckoutExperience::where('company_id', \App\Services\TenantContext::companyId())
            ->where('id', $id)
            ->firstOrFail();
        
        return response()->json([
            'success' => true,
            'data' => $checkout
        ]);
    }

    public function update(Request $request, string $id): JsonResponse
    {
        $checkout = CheckoutExperience::where('company_id', \App\Services\TenantContext::companyId())
            ->where('id', $id)
            ->firstOrFail();

        $validated = $request->validate([
            'name' => 'sometimes|string|max:255',
            'theme_color' => 'nullable|string|max:7',
            'allow_pix' => 'sometimes|boolean',
            'allow_card' => 'sometimes|boolean',
        ]);

        $updates = [];
        if (isset($validated['name'])) {
            $updates['name'] = $validated['name'];
        }

        $config = $checkout->config_json ?? [];
        if (isset($validated['theme_color'])) {
            $config['theme_color'] = $validated['theme_color'];
        }
        if (isset($validated['allow_pix'])) {
            $config['allow_pix'] = $validated['allow_pix'];
        }
        if (isset($validated['allow_card'])) {
            $config['allow_card'] = $validated['allow_card'];
        }
        $updates['config_json'] = $config;

        $checkout->update($updates);

        return response()->json([
            'success' => true,
            'data' => $checkout->fresh(),
        ]);
    }

    public function presets(Request $request): JsonResponse
    {
        $niche = $request->query('niche');
        $query = BlockPreset::where(function($q) {
            $q->whereNull('company_id')->orWhere('company_id', Auth::user()->company_id);
        });

        if ($niche) {
            $query->where('niche', $niche);
        }

        return response()->json($query->get());
    }

    public function publish(Request $request, string $id): JsonResponse
    {
        $checkout = CheckoutExperience::where('company_id', Auth::user()->company_id)
            ->where('id', $id)
            ->firstOrFail();

        return DB::transaction(function () use ($checkout, $request) {
            $version = CheckoutExperienceVersion::create([
                'uuid'           => Str::uuid(),
                'checkout_experience_id'    => $checkout->id,
                'company_id'     => $checkout->company_id,
                'config_json'    => $request->config_json ?? [],
                'status'         => 'published',
            ]);

            $checkout->update([
                'published_version_id' => $version->id,
            ]);

            return response()->json($version);
        });
    }
}
