<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class WebAuthnCredential extends Model
{
    protected $fillable = [
        'credential_id',
        'public_key',
    ];

    protected $casts = [
        'public_key' => 'array',
    ];

    public $timestamps = false;
}
