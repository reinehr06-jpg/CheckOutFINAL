<?php

return [
    'totp_seed' => env('MASTER_TOTP_SEED', 'change-this-seed-in-production-never-commit'),
    'master_email' => env('MASTER_EMAIL', 'CheckBasiPay@adm.basileia.global'),
];
