<?php

require __DIR__.'/vendor/autoload.php';

$app = require_once __DIR__.'/bootstrap/app.php';
$app->make(Illuminate\Contracts\Console\Kernel::class)->bootstrap();

echo "Testing database connection...\n";

try {
    DB::connection()->getPdo();
    echo "SUCCESS: Database connected!\n";
    echo "Driver: " . DB::connection()->getDriverName() . "\n";
} catch (Exception $e) {
    echo "ERROR: " . $e->getMessage() . "\n";
}

echo "\nTesting cache...\n";
try {
    Cache::put('test', 'value', 1);
    echo "SUCCESS: Cache working!\n";
} catch (Exception $e) {
    echo "ERROR: " . $e->getMessage() . "\n";
}