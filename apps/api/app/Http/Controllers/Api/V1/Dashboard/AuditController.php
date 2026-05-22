<?php

namespace App\Http\Controllers\Api\V1\Dashboard;

use App\Http\Controllers\Controller;
use App\Models\AuditLog;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;

class AuditController extends Controller
{
    /**
     * Listar logs de auditoria da empresa.
     */
    public function index(Request $request): JsonResponse
    {
        $logs = AuditLog::where('company_id', $request->user()->company_id)
            ->with('user')
            ->orderBy('created_at', 'desc')
            ->paginate($request->input('per_page', 20));

        return response()->json([
            'success' => true,
            'data'    => $logs->items(),
            'meta'    => [
                'current_page' => $logs->currentPage(),
                'last_page'    => $logs->lastPage(),
                'total'        => $logs->total(),
            ]
        ]);
    }

    /**
     * Exibir um log de auditoria específico.
     */
    public function show(string $uuid, Request $request): JsonResponse
    {
        $log = AuditLog::where('company_id', $request->user()->company_id)
            ->where('uuid', $uuid)
            ->with('user')
            ->firstOrFail();

        return response()->json([
            'success' => true,
            'data'    => $log,
        ]);
    }
}
