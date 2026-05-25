<?php

use App\Models\Gateway;
use App\Models\GatewayAccount;
use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        // Add gateway_id FK → gateways alongside existing gateway_account_id
        $tables = [
            'checkout_sessions'        => 'gateway_account_id',
            'payments'                 => 'gateway_account_id',
            'payment_attempts'         => 'gateway_account_id',
            'pix_subscriptions'        => 'gateway_account_id',
            'gateway_health_snapshots' => 'gateway_account_id',
            'gateway_credentials'      => 'gateway_account_id',
        ];

        foreach ($tables as $table => $after) {
            Schema::table($table, function (Blueprint $t) use ($table, $after) {
                $t->foreignId('gateway_id')->nullable()->constrained('gateways')->nullOnDelete()->after($after);
            });
        }

        // ── Data Migration ─────────────────────────────────────────────
        // Map existing GatewayAccount records to Gateway records,
        // matching by gateway_type → slug, creating Gateways as needed.
        //
        // NOTE: routing_rules and routing_decisions keep their existing
        // *_gateway_id columns pointing to GatewayAccount for backward compat.

        $this->ensureGatewayRecordsExist();

        foreach (array_keys($tables) as $table) {
            $this->populateGatewayId($table, 'gateway_account_id');
        }
    }

    public function down(): void
    {
        $tables = [
            'checkout_sessions',
            'payments',
            'payment_attempts',
            'pix_subscriptions',
            'gateway_health_snapshots',
            'gateway_credentials',
        ];

        foreach ($tables as $table) {
            Schema::table($table, function (Blueprint $t) {
                $t->dropConstrainedForeignId('gateway_id');
            });
        }
    }

    private function ensureGatewayRecordsExist(): void
    {
        $accountTypes = GatewayAccount::select('company_id', 'gateway_type')
            ->distinct()
            ->get();

        foreach ($accountTypes as $account) {
            $slug = strtolower($account->gateway_type);

            if (Gateway::where('company_id', $account->company_id)->where('slug', $slug)->exists()) {
                continue;
            }

            $hasExisting = Gateway::where('company_id', $account->company_id)->exists();

            Gateway::create([
                'company_id' => $account->company_id,
                'name' => ucfirst($slug) . ' Gateway',
                'slug' => $slug,
                'type' => $slug,
                'status' => 'active',
                'is_default' => !$hasExisting,
            ]);
        }
    }

    private function populateGatewayId(string $table, string $fkColumn): void
    {
        $rows = DB::table($table)
            ->select('id', $fkColumn)
            ->whereNotNull($fkColumn)
            ->whereNull('gateway_id')
            ->get();

        foreach ($rows as $row) {
            $account = GatewayAccount::find($row->{$fkColumn});
            if (!$account) continue;

            $slug = strtolower($account->gateway_type);
            $gateway = Gateway::where('company_id', $account->company_id)
                ->where('slug', $slug)
                ->first();

            if ($gateway) {
                DB::table($table)->where('id', $row->id)->update(['gateway_id' => $gateway->id]);
            }
        }
    }
};
