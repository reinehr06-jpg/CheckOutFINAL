<?php

return [
    'checkout_url'  => env('CHECKOUT_URL', 'https://checkout.basileia.global'),
    'callback_url'  => env('CALLBACK_URL', env('APP_URL', 'https://api.basileia.global') . '/api/v1/webhooks/gateways/asaas'),
];