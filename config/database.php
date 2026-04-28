<?php

use Illuminate\Support\Str;

return [
    'default' => 'sqlite',

    'connections' => [
        'sqlite' => [
            'driver' => 'sqlite',
            'database' => database_path('database.sqlite'),
            'prefix' => '',
            'foreign_key_constraints' => true,
        ],
    ],

    'migrations' => 'migrations',

    'redis' => [
        'client' => 'array',
        'default' => [
            'host' => '127.0.0.1',
            'port' => 6379,
            'database' => 0,
        ],
        'cache' => [
            'host' => '127.0.0.1',
            'port' => 6379,
            'database' => 1,
        ],
    ],
];