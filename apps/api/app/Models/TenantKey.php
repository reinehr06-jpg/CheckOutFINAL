<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class TenantKey extends Model
{
    protected $fillable = [
        'company_id',
        'encrypted_dek',
        'kek_version',
        'rotated_at',
    ];

    protected $casts = [
        'rotated_at' => 'datetime',
    ];

    public $timestamps = true;

    public function company(): BelongsTo
    {
        return $this->belongsTo(Company::class);
    }
}
