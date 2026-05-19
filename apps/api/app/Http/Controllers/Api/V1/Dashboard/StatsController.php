<?php

namespace App\Http\Controllers\Api\V1\Dashboard;

use App\Http\Controllers\Controller;
use App\Models\Payment;
use App\Models\Order;
use App\Models\CheckoutSession;
use App\Models\ConnectedSystem;
use App\Services\TenantContext;
use Illuminate\Support\Facades\DB;

class StatsController extends Controller
{
    public function index()
    {
        $user = auth()->user();
        
        // Super admin sem company_id: mostra dados agregados de todas as empresas
        if ($user && $user->isSuperAdmin() && !$user->company_id) {
            return $this->globalStats();
        }
        
        $companyId = TenantContext::companyId();
        
        if (!$companyId) {
            return response()->json([
                'success' => true,
                'data' => [
                    'volume_processed' => 'R$ 0,00',
                    'volume_change' => '+0%',
                    'volume_trend' => 'up',
                    'volume_chart' => [0,0,0,0,0,0,0],
                    'net_revenue' => 'R$ 0,00',
                    'revenue_change' => '+0%',
                    'revenue_trend' => 'up',
                    'revenue_chart' => [0,0,0,0,0,0,0],
                    'approval_rate' => '0%',
                    'approval_change' => '+0%',
                    'approval_trend' => 'up',
                    'approval_chart' => [0,0,0,0,0,0,0],
                    'failure_rate' => '0%',
                    'failure_change' => '+0%',
                    'failure_trend' => 'up',
                    'failure_chart' => [0,0,0,0,0,0,0],
                    'conversion_rate' => '0%',
                    'conversion_change' => '+0%',
                    'conversion_trend' => 'up',
                    'conversion_chart' => [0,0,0,0,0,0,0],
                    'active_systems' => 0,
                    'pending_payments' => 0,
                    'failed_payments' => 0,
                    'orders_today' => 0,
                    'payments' => [],
                ]
            ]);
        }
        
        $today = now()->startOfDay();
        $sevenDaysAgo = now()->subDays(7);

        // Volume processado (total pago)
        $totalVolume = Payment::where('company_id', $companyId)
            ->where('status', 'paid')
            ->sum('amount');
        
        $volumeToday = Payment::where('company_id', $companyId)
            ->where('status', 'paid')
            ->where('created_at', '>=', $today)
            ->sum('amount');

        $volumeLastWeek = Payment::where('company_id', $companyId)
            ->where('status', 'paid')
            ->whereBetween('created_at', [$sevenDaysAgo, $today])
            ->sum('amount');

        // Receita liquida (aproximacao: volume - estornos)
        $refunded = Payment::where('company_id', $companyId)
            ->where('status', 'refunded')
            ->sum('amount');
        
        $netRevenue = $totalVolume - $refunded;

        // Taxa de aprovacao
        $totalPayments = Payment::where('company_id', $companyId)->count();
        $approvedPayments = Payment::where('company_id', $companyId)
            ->where('status', 'paid')
            ->count();
        
        $approvalRate = $totalPayments > 0 ? round(($approvedPayments / $totalPayments) * 100, 2) : 0;

        // Falhas
        $failedPayments = Payment::where('company_id', $companyId)
            ->where('status', 'failed')
            ->count();
        
        $failureRate = $totalPayments > 0 ? round(($failedPayments / $totalPayments) * 100, 2) : 0;

        // Conversao (sessoes que viraram pagamento)
        $totalSessions = CheckoutSession::where('company_id', $companyId)->count();
        $paidSessions = Payment::where('company_id', $companyId)
            ->where('status', 'paid')
            ->count();
        
        $conversionRate = $totalSessions > 0 ? round(($paidSessions / $totalSessions) * 100, 2) : 0;

        // Sistemas operando
        $activeSystems = ConnectedSystem::where('company_id', $companyId)
            ->where('status', 'active')
            ->count();

        // Chart data - volume por dia (ultimos 7 dias)
        $volumeChart = [];
        $revenueChart = [];
        $approvalChart = [];
        $failureChart = [];
        $conversionChart = [];

        for ($i = 6; $i >= 0; $i--) {
            $date = now()->subDays($i)->startOfDay();
            $nextDate = (clone $date)->addDay();

            $dayVolume = Payment::where('company_id', $companyId)
                ->where('status', 'paid')
                ->whereBetween('created_at', [$date, $nextDate])
                ->sum('amount');
            
            $dayTotal = Payment::where('company_id', $companyId)
                ->whereBetween('created_at', [$date, $nextDate])
                ->count();
            
            $dayApproved = Payment::where('company_id', $companyId)
                ->where('status', 'paid')
                ->whereBetween('created_at', [$date, $nextDate])
                ->count();

            $dayFailed = Payment::where('company_id', $companyId)
                ->where('status', 'failed')
                ->whereBetween('created_at', [$date, $nextDate])
                ->count();

            $daySessions = CheckoutSession::where('company_id', $companyId)
                ->whereBetween('created_at', [$date, $nextDate])
                ->count();

            $volumeChart[] = $dayVolume / 100;
            $revenueChart[] = ($dayVolume - $refunded) / 100;
            $approvalChart[] = $dayTotal > 0 ? round(($dayApproved / $dayTotal) * 100, 1) : 0;
            $failureChart[] = $dayTotal > 0 ? round(($dayFailed / $dayTotal) * 100, 2) : 0;
            $conversionChart[] = $daySessions > 0 ? round(($dayApproved / $daySessions) * 100, 1) : 0;
        }

        // Pagamentos recentes
        $recentPayments = Payment::where('company_id', $companyId)
            ->with('order')
            ->latest()
            ->limit(10)
            ->get()
            ->map(function ($p) {
                return [
                    'id' => $p->id,
                    'uuid' => $p->uuid,
                    'customer' => $p->order?->customer_name ?? 'N/A',
                    'method' => $p->method,
                    'gateway' => $p->gateway_account_id ? 'Gateway' : 'N/A',
                    'value' => 'R$ ' . number_format($p->amount / 100, 2, ',', '.'),
                    'status' => $p->status,
                    'risk' => 'low',
                    'created_at' => $p->created_at->format('d/m H:i'),
                ];
            });

        return response()->json([
            'success' => true,
            'data' => [
                'volume_processed' => 'R$ ' . number_format($totalVolume / 100, 2, ',', '.'),
                'volume_change' => $volumeLastWeek > 0 ? '+' . round((($volumeToday - ($volumeLastWeek / 7)) / ($volumeLastWeek / 7)) * 100, 2) . '%' : '+0%',
                'volume_trend' => $volumeToday > 0 ? 'up' : 'down',
                'volume_chart' => $volumeChart,

                'net_revenue' => 'R$ ' . number_format($netRevenue / 100, 2, ',', '.'),
                'revenue_change' => '+0%',
                'revenue_trend' => 'up',
                'revenue_chart' => $revenueChart,

                'approval_rate' => $approvalRate . '%',
                'approval_change' => '+0%',
                'approval_trend' => 'up',
                'approval_chart' => $approvalChart,

                'failure_rate' => $failureRate . '%',
                'failure_change' => '+0%',
                'failure_trend' => $failureRate > 5 ? 'down' : 'up',
                'failure_chart' => $failureChart,

                'conversion_rate' => $conversionRate . '%',
                'conversion_change' => '+0%',
                'conversion_trend' => 'up',
                'conversion_chart' => $conversionChart,

                'active_systems' => $activeSystems,
                'pending_payments' => Payment::where('company_id', $companyId)->where('status', 'pending')->count(),
                'failed_payments' => $failedPayments,
                'orders_today' => Order::where('company_id', $companyId)->where('created_at', '>=', $today)->count(),
                'payments' => $recentPayments,
            ]
        ]);
    }

    private function globalStats()
    {
        $today = now()->startOfDay();
        $sevenDaysAgo = now()->subDays(7);

        $totalVolume = Payment::where('status', 'paid')->sum('amount');
        $volumeToday = Payment::where('status', 'paid')->where('created_at', '>=', $today)->sum('amount');
        $refunded = Payment::where('status', 'refunded')->sum('amount');
        $netRevenue = $totalVolume - $refunded;

        $totalPayments = Payment::count();
        $approvedPayments = Payment::where('status', 'paid')->count();
        $failedPayments = Payment::where('status', 'failed')->count();
        
        $approvalRate = $totalPayments > 0 ? round(($approvedPayments / $totalPayments) * 100, 2) : 0;
        $failureRate = $totalPayments > 0 ? round(($failedPayments / $totalPayments) * 100, 2) : 0;

        $totalSessions = CheckoutSession::count();
        $conversionRate = $totalSessions > 0 ? round(($approvedPayments / $totalSessions) * 100, 2) : 0;
        $activeSystems = ConnectedSystem::where('status', 'active')->count();

        $volumeChart = [];
        $approvalChart = [];
        $failureChart = [];
        $conversionChart = [];
        $revenueChart = [];

        for ($i = 6; $i >= 0; $i--) {
            $date = now()->subDays($i)->startOfDay();
            $nextDate = (clone $date)->addDay();

            $dayVolume = Payment::where('status', 'paid')->whereBetween('created_at', [$date, $nextDate])->sum('amount');
            $dayTotal = Payment::whereBetween('created_at', [$date, $nextDate])->count();
            $dayApproved = Payment::where('status', 'paid')->whereBetween('created_at', [$date, $nextDate])->count();
            $dayFailed = Payment::where('status', 'failed')->whereBetween('created_at', [$date, $nextDate])->count();
            $daySessions = CheckoutSession::whereBetween('created_at', [$date, $nextDate])->count();

            $volumeChart[] = $dayVolume / 100;
            $revenueChart[] = $dayVolume / 100;
            $approvalChart[] = $dayTotal > 0 ? round(($dayApproved / $dayTotal) * 100, 1) : 0;
            $failureChart[] = $dayTotal > 0 ? round(($dayFailed / $dayTotal) * 100, 2) : 0;
            $conversionChart[] = $daySessions > 0 ? round(($dayApproved / $daySessions) * 100, 1) : 0;
        }

        $recentPayments = Payment::with('order')->latest()->limit(10)->get()->map(function ($p) {
            return [
                'id' => $p->id,
                'uuid' => $p->uuid,
                'customer' => $p->order?->customer_name ?? 'N/A',
                'method' => $p->method,
                'gateway' => $p->gateway_account_id ? 'Gateway' : 'N/A',
                'value' => 'R$ ' . number_format($p->amount / 100, 2, ',', '.'),
                'status' => $p->status,
                'risk' => 'low',
                'created_at' => $p->created_at->format('d/m H:i'),
            ];
        });

        return response()->json([
            'success' => true,
            'data' => [
                'volume_processed' => 'R$ ' . number_format($totalVolume / 100, 2, ',', '.'),
                'volume_change' => '+0%',
                'volume_trend' => 'up',
                'volume_chart' => $volumeChart,
                'net_revenue' => 'R$ ' . number_format($netRevenue / 100, 2, ',', '.'),
                'revenue_change' => '+0%',
                'revenue_trend' => 'up',
                'revenue_chart' => $revenueChart,
                'approval_rate' => $approvalRate . '%',
                'approval_change' => '+0%',
                'approval_trend' => 'up',
                'approval_chart' => $approvalChart,
                'failure_rate' => $failureRate . '%',
                'failure_change' => '+0%',
                'failure_trend' => $failureRate > 5 ? 'down' : 'up',
                'failure_chart' => $failureChart,
                'conversion_rate' => $conversionRate . '%',
                'conversion_change' => '+0%',
                'conversion_trend' => 'up',
                'conversion_chart' => $conversionChart,
                'active_systems' => $activeSystems,
                'pending_payments' => Payment::where('status', 'pending')->count(),
                'failed_payments' => $failedPayments,
                'orders_today' => Order::where('created_at', '>=', $today)->count(),
                'payments' => $recentPayments,
            ]
        ]);
    }
}
