<?php

return [

    /*
    |--------------------------------------------------------------------------
    | Encryption Key (KEK — Key Encryption Key)
    |--------------------------------------------------------------------------
    | Must be base64-encoded 32 bytes (SODIUM_CRYPTO_SECRETBOX_KEYBYTES).
    | Generate: php -r "echo base64_encode(random_bytes(32));"
    | Store in env SECURITY_ENCRYPTION_KEY, never commit.
    */
    'encryption_key' => env('SECURITY_ENCRYPTION_KEY'),

    /*
    |--------------------------------------------------------------------------
    | Key Encryption Key Version
    |--------------------------------------------------------------------------
    | Increment when rotating KEK. Re-wrap all DEKs after change.
    */
    'kek_version' => env('SECURITY_KEK_VERSION', 1),

    /*
    |--------------------------------------------------------------------------
    | Vault Configuration
    |--------------------------------------------------------------------------
    | driver: 'env' | 'hashicorp'
    */
    'vault' => [
        'driver' => env('SECURITY_VAULT_DRIVER', 'env'),
    ],

    /*
    |--------------------------------------------------------------------------
    | IP Hashing Salt (LGPD compliance — never store raw IPs)
    |--------------------------------------------------------------------------
    */
    'ip_salt' => env('SECURITY_IP_SALT', 'change-this-salt-in-production'),

    /*
    |--------------------------------------------------------------------------
    | Password Policy
    |--------------------------------------------------------------------------
    */
    'password' => [
        'min_length' => 8,
        'max_failed_attempts' => 5,
        'lockout_minutes' => 30,
        'expiry_days' => 15,
    ],

    /*
    |--------------------------------------------------------------------------
    | Session Limits
    |--------------------------------------------------------------------------
    */
    'session' => [
        'max_active_per_user' => 5,
        'lifetime_minutes' => 480,  // 8 hours
    ],

    /*
    |--------------------------------------------------------------------------
    | Reauth Window
    |--------------------------------------------------------------------------
    */
    'reauth_window_minutes' => 10,

    /*
    |--------------------------------------------------------------------------
    | IP Allowlist (defesa em profundidade)
    |--------------------------------------------------------------------------
    | mode: 'off' | 'strict' | 'log_only'
    | ips: CIDR ou IPs exatos separados por vírgula
    */
    'ip_allowlist' => [
        'mode' => env('SECURITY_IP_ALLOWLIST_MODE', 'off'),
        'ips' => explode(',', env('SECURITY_IP_ALLOWLIST_IPS', '')),
    ],

    /*
    |--------------------------------------------------------------------------
    | Master Access
    |--------------------------------------------------------------------------
    */
    'master_access' => [
        'challenge_ttl_seconds' => 30,
        'session_ttl_hours' => 1,
        'max_challenge_attempts' => 5,
    ],

    /*
    |--------------------------------------------------------------------------
    | API Key Configuration
    |--------------------------------------------------------------------------
    */
    'api_key' => [
        'prefix_live' => 'bp_live',
        'prefix_test' => 'bp_test',
        'secret_bytes' => 32,
    ],

];
