<?php

namespace App\Http\Controllers\Dashboard;

use App\Http\Controllers\Controller;
use App\Models\SourceConfig;
use Illuminate\Http\Request;
use Illuminate\Support\Str;

class SourceConfigController extends Controller
{
    public function index()
    {
        $sources = SourceConfig::orderBy('created_at', 'desc')->get();
        return view('dashboard.sources.index', compact('sources'));
    }

    public function store(Request $request)
    {
        $request->validate([
            'source_name' => 'required|string|max:255|unique:source_configs,source_name',
            'description' => 'sometimes|string|max:500',
            'callback_url' => 'required|url',
            'webhook_secret' => 'required|string|min:16',
            'product_types' => 'sometimes|array',
            'product_types.*' => 'in:saas,evento,curso,lancamento,outro',
        ]);

        $webhookSecret = $request->input('webhook_secret');
        
        SourceConfig::create([
            'source_name' => $request->input('source_name'),
            'description' => $request->input('description'),
            'callback_url' => $request->input('callback_url'),
            'webhook_secret' => $webhookSecret,
            'product_types' => $request->input('product_types', []),
            'active' => $request->boolean('active', true),
        ]);

        return redirect()->route('dashboard.sources.index')
            ->with('success', 'Sistema cadastrado com sucesso!');
    }

    public function update(Request $request, SourceConfig $source)
    {
        $request->validate([
            'source_name' => 'required|string|max:255|unique:source_configs,source_name,' . $source->id,
            'description' => 'sometimes|string|max:500',
            'callback_url' => 'required|url',
            'webhook_secret' => 'required|string|min:16',
            'product_types' => 'sometimes|array',
            'product_types.*' => 'in:saas,evento,curso,lancamento,outro',
        ]);

        $source->update([
            'source_name' => $request->input('source_name'),
            'description' => $request->input('description'),
            'callback_url' => $request->input('callback_url'),
            'webhook_secret' => $request->input('webhook_secret'),
            'product_types' => $request->input('product_types', []),
            'active' => $request->boolean('active', true),
        ]);

        return redirect()->route('dashboard.sources.index')
            ->with('success', 'Sistema atualizado com sucesso!');
    }

    public function destroy(SourceConfig $source)
    {
        $source->delete();
        
        return redirect()->route('dashboard.sources.index')
            ->with('success', 'Sistema removido com sucesso!');
    }

    public function toggle(SourceConfig $source)
    {
        $source->update([
            'active' => !$source->active,
        ]);

        $status = $source->active ? 'ativado' : 'desativado';
        
        return redirect()->route('dashboard.sources.index')
            ->with('success', "Sistema {$status} com sucesso!");
    }
}