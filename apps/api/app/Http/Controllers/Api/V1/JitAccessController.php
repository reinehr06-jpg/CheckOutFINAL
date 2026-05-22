<?php

namespace App\Http\Controllers\Api\V1;

use App\Http\Controllers\Controller;
use App\Models\JitAccessRequest;
use App\Models\User;
use App\Notifications\JitApprovalNotification;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Str;

class JitAccessController extends Controller
{
    public function request(Request $request): JsonResponse
    {
        $data = $request->validate([
            'target_role' => 'required|string|in:admin,finance,support,operator',
            'reason' => 'required|string|min:10|max:500',
        ]);

        $user = $request->user();

        $existing = JitAccessRequest::where('requested_by', $user->id)
            ->active()
            ->where('target_role', $data['target_role'])
            ->first();

        if ($existing) {
            return response()->json([
                'success' => false,
                'error' => ['code' => 'jit_already_active', 'message' => 'Você já possui um acesso JIT ativo para esta função.'],
            ], 409);
        }

        $jitRequest = JitAccessRequest::create([
            'uuid' => Str::uuid(),
            'requested_by' => $user->id,
            'target_role' => $data['target_role'],
            'reason' => $data['reason'],
            'status' => 'pending',
            'expires_at' => now()->addHour(),
        ]);

        $this->notifyApprovers($jitRequest);

        return response()->json([
            'success' => true,
            'data' => [
                'id' => $jitRequest->uuid,
                'status' => 'pending',
                'target_role' => $data['target_role'],
                'expires_at' => $jitRequest->expires_at,
            ],
        ], 201);
    }

    public function approve(Request $request, string $uuid): JsonResponse
    {
        $approver = $request->user();

        if (!$approver->isSuperAdmin()) {
            return response()->json(['message' => 'Apenas super admins podem aprovar solicitações JIT.'], 403);
        }

        $jitRequest = JitAccessRequest::where('uuid', $uuid)->firstOrFail();

        if ($jitRequest->status !== 'pending') {
            return response()->json([
                'success' => false,
                'error' => ['code' => 'jit_already_processed', 'message' => 'Solicitação já processada.'],
            ], 409);
        }

        $data = $request->validate(['expires_in_minutes' => 'integer|min:15|max:480']);
        $expiresIn = $data['expires_in_minutes'] ?? 60;

        $jitRequest->update([
            'status' => 'approved',
            'approved_by' => $approver->id,
            'approved_at' => now(),
            'expires_at' => now()->addMinutes($expiresIn),
        ]);

        try {
            $jitRequest->requester->notify(new JitApprovalNotification($jitRequest));
        } catch (\Exception $e) {
            logger()->warning('Failed to send JIT approval notification: ' . $e->getMessage());
        }

        return response()->json(['success' => true, 'data' => ['status' => 'approved', 'expires_at' => $jitRequest->expires_at]]);
    }

    public function deny(Request $request, string $uuid): JsonResponse
    {
        $approver = $request->user();

        if (!$approver->isSuperAdmin()) {
            return response()->json(['message' => 'Apenas super admins podem negar solicitações JIT.'], 403);
        }

        $jitRequest = JitAccessRequest::where('uuid', $uuid)->firstOrFail();

        if ($jitRequest->status !== 'pending') {
            return response()->json(['message' => 'Solicitação já processada.'], 409);
        }

        $data = $request->validate(['reason' => 'nullable|string|max:500']);

        $jitRequest->update([
            'status' => 'denied',
            'denied_at' => now(),
            'denied_reason' => $data['reason'] ?? null,
        ]);

        return response()->json(['success' => true]);
    }

    public function list(Request $request): JsonResponse
    {
        $user = $request->user();
        $isSuperAdmin = $user->isSuperAdmin();

        $query = JitAccessRequest::with('requester:id,name,email', 'approver:id,name,email')
            ->orderBy('created_at', 'desc');

        if (!$isSuperAdmin) {
            $query->where('requested_by', $user->id);
        }

        if ($status = $request->query('status')) {
            $query->where('status', $status);
        }

        $requests = $query->paginate(20);

        return response()->json(['success' => true, 'data' => $requests]);
    }

    public function myActive(Request $request): JsonResponse
    {
        $user = $request->user();

        $active = JitAccessRequest::where('requested_by', $user->id)
            ->active()
            ->get(['uuid', 'target_role', 'expires_at']);

        return response()->json(['success' => true, 'data' => $active]);
    }

    private function notifyApprovers(JitAccessRequest $jitRequest): void
    {
        $approvers = User::where('role', 'super_admin')->where('status', 'active')->get();

        foreach ($approvers as $approver) {
            try {
                $approver->notify(new JitApprovalNotification($jitRequest));
            } catch (\Exception $e) {
                logger()->warning("Failed to notify approver {$approver->id}: {$e->getMessage()}");
            }
        }
    }
}
