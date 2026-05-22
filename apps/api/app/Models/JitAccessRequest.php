<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class JitAccessRequest extends Model
{
    protected $fillable = [
        'uuid',
        'requested_by',
        'approved_by',
        'target_role',
        'reason',
        'status',
        'expires_at',
        'approved_at',
        'denied_at',
        'denied_reason',
    ];

    protected $casts = [
        'expires_at' => 'datetime',
        'approved_at' => 'datetime',
        'denied_at' => 'datetime',
    ];

    public function requester(): BelongsTo
    {
        return $this->belongsTo(User::class, 'requested_by');
    }

    public function approver(): BelongsTo
    {
        return $this->belongsTo(User::class, 'approved_by');
    }

    public function isActive(): bool
    {
        return $this->status === 'approved'
            && $this->expires_at
            && now()->lessThan($this->expires_at);
    }

    public function scopeActive($query)
    {
        return $query->where('status', 'approved')
            ->where('expires_at', '>', now());
    }
}
