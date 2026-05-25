<?php

declare(strict_types=1);

namespace App\Console\Commands;

use App\Models\Gateway;
use App\Services\Gateway\GatewayEngine;
use Illuminate\Console\Command;
use Illuminate\Support\Facades\Log;

class CheckGatewayHealthCommand extends Command
{
    protected $signature = 'gateway:check-health
        {--gateway= : Check a specific gateway by ID}
        {--company= : Check gateways for a specific company}';

    protected $description = 'Test connection health for all active gateways';

    public function handle(GatewayEngine $engine): int
    {
        $query = Gateway::where('status', 'active');

        if ($gatewayId = $this->option('gateway')) {
            $query->where('id', $gatewayId);
        }

        if ($companyId = $this->option('company')) {
            $query->where('company_id', $companyId);
        }

        $gateways = $query->get();

        if ($gateways->isEmpty()) {
            $this->warn('No active gateways found to check.');
            return Command::SUCCESS;
        }

        $this->info("Checking health for {$gateways->count()} gateway(s)...");

        $successCount = 0;
        $failCount = 0;

        foreach ($gateways as $gateway) {
            $this->line("  Testing [{$gateway->name}] ({$gateway->slug})...");

            try {
                $result = $engine->test($gateway);

                if ($result->success) {
                    $this->info("    ✓ {$result->message} ({$result->latencyMs}ms)");
                    $successCount++;
                } else {
                    $this->error("    ✗ {$result->message}");
                    $failCount++;
                }
            } catch (\Throwable $e) {
                $this->error("    ✗ Exception: {$e->getMessage()}");
                $failCount++;
                Log::error('Gateway health check failed with exception', [
                    'gateway_id' => $gateway->id,
                    'error' => $e->getMessage(),
                ]);
            }
        }

        $this->newLine();
        $this->info("Results: {$successCount} passed, {$failCount} failed.");

        return $failCount > 0 ? Command::FAILURE : Command::SUCCESS;
    }
}
