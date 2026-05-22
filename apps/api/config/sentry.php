<?php

return [
    /*
    |--------------------------------------------------------------------------
    | Sentry Configuration
    |--------------------------------------------------------------------------
    |
    | Sentry for error tracking and performance monitoring.
    | Requires SENTRY_LARAVEL_DSN in .env.
    |
    | Generate DSN: https://sentry.io/settings/projects/new/dsn/
    |
    */
    'dsn' => env('SENTRY_LARAVEL_DSN'),
    'release' => env('SENTRY_RELEASE', 'unknown'),

    // Sample rate for performance tracing (0.0 to 1.0)
    'traces_sample_rate' => (float) env('SENTRY_TRACES_SAMPLE_RATE', 0.1),

    // Sample rate for profiling
    'profiles_sample_rate' => (float) env('SENTRY_PROFILES_SAMPLE_RATE', 0.1),

    // Send errors and transactions to Sentry
    'send_default_pii' => false, // Never send PII

    'breadcrumbs' => [
        'sql_queries' => env('SENTRY_BREADCRUMBS_SQL', false),
        'sql_bindings' => false,
        'queue_info' => true,
        'command_info' => true,
        'http_client_requests' => true,
    ],

    // Capture failed jobs
    'capture_silenced_fails' => env('SENTRY_CAPTURE_SILENCED_FAILS', true),
];
