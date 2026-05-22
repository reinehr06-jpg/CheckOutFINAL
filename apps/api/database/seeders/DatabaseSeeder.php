<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;

class DatabaseSeeder extends Seeder
{
    public function run(): void
    {
        $this->call([
            CompanySeeder::class,
        ]);

        if (env('APP_SEED_DEMO', false)) {
            $this->call([
                ConnectedSystemSeeder::class,
                GatewaySeeder::class,
                CheckoutSessionSeeder::class,
            ]);
        }
    }
}
