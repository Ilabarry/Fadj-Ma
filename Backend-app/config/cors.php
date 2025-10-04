<?php

return [
    'paths' => ['api/*', 'sanctum/csrf-cookie', 'login', 'logout', 'register', 'dashboard-stats'],

    'allowed_methods' => ['*'],

    'allowed_origins' => [
        'https://fadj-ma.vercel.app',
        'http://localhost:5173',
        'http://localhost:3000'
    ],

    'allowed_origins_patterns' => [],

    'allowed_headers' => ['*'],

    'exposed_headers' => [],

    'max_age' => 0,

    'supports_credentials' => true,
];