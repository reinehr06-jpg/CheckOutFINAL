<?php

return [
    'totp_seed' => env('MASTER_TOTP_SEED'),
    'url_seed' => env('MASTER_SEED_HEX'),
    'fallback_totp_seed' => env('MASTER_FALLBACK_TOTP_SEED'),
    'master_email' => env('MASTER_EMAIL', 'CheckBasiPay@adm.basileia.global'),
];
