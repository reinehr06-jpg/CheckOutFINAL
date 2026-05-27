<?php

namespace App\Console\Commands;

use Illuminate\Console\Command;
use Laravel\Sanctum\PersonalAccessToken;
use Carbon\Carbon;

class PurgeExpiredTokens extends Command
{
    protected $signature = 'tokens:purge';
    protected $description = 'Remove tokens expirados do banco de dados';

    public function handle()
    {
        $deleted = PersonalAccessToken::where('expires_at', '<', Carbon::now())->delete();
        $this->info("$deleted tokens expirados removidos.");
    }
}
