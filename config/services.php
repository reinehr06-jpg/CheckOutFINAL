<?php

return [
    'asaas' => [
        'api_key' => env('ASAAS_API_KEY'),
        'environment' => env('ASAAS_ENVIRONMENT', 'sandbox'),
        'webhook_token' => env('ASAAS_WEBHOOK_TOKEN'),
    ],
];