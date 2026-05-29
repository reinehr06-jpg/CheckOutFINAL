<?php
$baseUrl = 'http://localhost:8000';
function post($url, $data = [], $token = null) {
    global $baseUrl;
    $ch = curl_init($baseUrl . $url);
    curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);
    curl_setopt($ch, CURLOPT_POST, true);
    if (!empty($data)) {
        curl_setopt($ch, CURLOPT_POSTFIELDS, json_encode($data));
    }
    $headers = ['Content-Type: application/json', 'Accept: application/json'];
    if ($token) {
        $headers[] = 'Authorization: Bearer ' . $token;
    }
    curl_setopt($ch, CURLOPT_HTTPHEADER, $headers);
    $res = curl_exec($ch);
    $status = curl_getinfo($ch, CURLINFO_HTTP_CODE);
    curl_close($ch);
    return ['status' => $status, 'body' => json_decode($res, true)];
}
function get($url, $token = null) {
    global $baseUrl;
    $ch = curl_init($baseUrl . $url);
    curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);
    $headers = ['Accept: application/json'];
    if ($token) {
        $headers[] = 'Authorization: Bearer ' . $token;
    }
    curl_setopt($ch, CURLOPT_HTTPHEADER, $headers);
    $res = curl_exec($ch);
    $status = curl_getinfo($ch, CURLINFO_HTTP_CODE);
    curl_close($ch);
    return ['status' => $status, 'body' => json_decode($res, true)];
}

echo "1. Login...\n";
$res = post('/api/v2/auth/login', ['email' => 'test@example.com', 'password' => 'password']);
echo "Login Status: " . $res['status'] . "\n";
$token = $res['body']['data']['access_token'] ?? null;
echo "Needs 2FA: " . ($res['body']['data']['needs_2fa_setup'] ? 'Yes' : 'No') . "\n";

echo "\n2. Setup 2FA...\n";
$res = post('/api/v2/auth/2fa/setup', [], $token);
echo "Setup Status: " . $res['status'] . "\n";
$secret = $res['body']['data']['secret'] ?? null;
echo "Secret: " . $secret . "\n";

if ($secret) {
    // Generate TOTP manually
    require 'vendor/autoload.php';
    $app = require_once 'bootstrap/app.php';
    $app->make('Illuminate\Contracts\Console\Kernel')->bootstrap();
    $service = app(\App\Services\TwoFactorAuthService::class);
    $user = \App\Models\User::where('email', 'test@example.com')->first();
    $code = ""; // We need to generate it. Or we can just read from the service.
    
    // We'll generate it directly:
    $method = new \ReflectionMethod($service, 'generateTOTP');
    $method->setAccessible(true);
    $timeSlot = floor(time() / 30);
    $code = $method->invoke($service, $secret, $timeSlot);
    echo "Generated Code: " . $code . "\n";
    
    echo "\n3. Enable 2FA...\n";
    $res = post('/api/v2/auth/2fa/enable', ['code' => $code], $token);
    echo "Enable Status: " . $res['status'] . "\n";
    echo json_encode($res['body']) . "\n";
}

echo "\n4. Dashboard Stats...\n";
$res = get('/api/v1/dashboard/stats', $token);
echo "Dashboard Status: " . $res['status'] . "\n";
echo json_encode($res['body']) . "\n";

