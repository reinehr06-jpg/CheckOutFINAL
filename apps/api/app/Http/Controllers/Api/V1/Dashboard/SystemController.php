<?php

namespace App\Http\Controllers\Api\V1\Dashboard;

use App\Http\Controllers\Controller;
use App\Models\ConnectedSystem;
use App\Services\TenantContext;
use Illuminate\Http\Request;
use Illuminate\Support\Str;

class SystemController extends Controller
{
    public function index()
    {
        $user = auth()->user();
        
        $query = ConnectedSystem::query();

        if ($user && $user->isSuperAdmin() && !$user->company_id) {
            // Super admin ve todos os sistemas
            $query->with(['apiKeys']);
        } else {
            $companyId = TenantContext::companyId();
            if (!$companyId) {
                return response()->json(['success' => true, 'data' => []]);
            }
            $query->where('company_id', $companyId)->with(['apiKeys']);
        }

        $systems = $query->latest()->get();

        return response()->json([
            'success' => true,
            'data' => $systems->map(fn($s) => [
                'id' => $s->id,
                'uuid' => $s->uuid,
                'name' => $s->name,
                'slug' => $s->slug,
                'description' => $s->description ?? 'Gateway de Pagamento',
                'logo_url' => $s->logo_url,
                'status' => $s->status,
                'environment' => $s->environment,
                'gateway_default' => $s->apiKeys->first()?->name ?? 'N/A',
                'checkout_default' => 'N/A',
                'last_activity' => $s->updated_at?->diffForHumans() ?? '---',
                'uptime' => '99.9%',
                'reqs' => '0 req/s',
                'created_at' => $s->created_at->format('d/m/Y H:i'),
            ])
        ]);
    }

    public function store(Request $request)
    {
        $validated = $request->validate([
            'name' => 'required|string|max:255',
            'environment' => 'required|in:sandbox,production',
        ]);

        $system = ConnectedSystem::create([
            'company_id' => TenantContext::companyId(),
            'name' => $validated['name'],
            'slug' => Str::slug($validated['name']),
            'environment' => $validated['environment'],
            'status' => 'active',
        ]);

        return response()->json([
            'success' => true,
            'data' => $system
        ], 201);
    }

    public function show($id)
    {
        $system = ConnectedSystem::where('company_id', TenantContext::companyId())
            ->findOrFail($id);

        return response()->json([
            'success' => true,
            'data' => $system
        ]);
    }
}
