<?php

namespace App\Console\Commands;

use App\Services\Crypto\TenantEncryption;
use App\Services\Vault\VaultProvider;
use Illuminate\Console\Command;

class RotateKek extends Command
{
    protected $signature = 'basileia:rotate-kek
        {--old-version= : KEK version currently in use (default: current - 1)}
        {--force : Skip confirmation}';

    protected $description = 'Re-wrap all tenant DEKs with a new KEK version';

    public function handle(TenantEncryption $encryption): int
    {
        if (!extension_loaded('sodium')) {
            $this->error('sodium extension required.');
            return self::FAILURE;
        }

        $oldVersion = $this->option('old-version')
            ?? (int) config('security.kek_version', 1) - 1;

        if ($oldVersion < 1) {
            $this->error('Invalid old KEK version. Must be >= 1.');
            return self::FAILURE;
        }

        $count = \App\Models\TenantKey::where('kek_version', $oldVersion)->count();

        if ($count === 0) {
            $this->warn("No tenant keys found with KEK version {$oldVersion}.");
            return self::SUCCESS;
        }

        $this->info("Found {$count} tenant DEKs encrypted with KEK version {$oldVersion}.");

        if (!$this->option('force')) {
            $this->newLine();
            $this->warn('Before proceeding:');
            $this->line('  1. Set NEW SECURITY_ENCRYPTION_KEY in environment');
            $this->line('  2. Set SECURITY_KEK_VERSION=' . ($oldVersion + 1));
            $this->line('  3. Ensure old key is still accessible (rotation reads old, writes new)');
            $this->newLine();

            if (!$this->confirm('Continue with KEK rotation?')) {
                $this->info('Cancelled.');
                return self::SUCCESS;
            }
        }

        $rotated = $encryption->rewrapAllDek($oldVersion);

        $this->info("Successfully re-wrapped {$rotated} DEKs with new KEK.");
        $this->warn('Keep the old KEK available for at least one rotation cycle.');
        $this->warn('After confirming all DEKs are accessible, revoke the old KEK.');

        return self::SUCCESS;
    }
}
