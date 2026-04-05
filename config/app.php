<?php

$key = env('APP_KEY');
$cipher = 'AES-256-CBC';

if ($key) {
    $tempKey = $key;
    if (str_starts_with($tempKey, 'base64:')) {
        $tempKey = base64_decode(substr($tempKey, 7));
    }
    if (mb_strlen($tempKey, '8bit') === 16) {
        $cipher = 'AES-128-CBC';
    }
}

return [
    'key' => env('APP_KEY'),
    'cipher' => env('APP_CIPHER', $cipher),
];
