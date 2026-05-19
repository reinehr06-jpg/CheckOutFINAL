<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class ImpersonationSession extends Model
{
    protected $fillable = [
        'super_admin_id',
        'target_company_id',
        'target_user_id',
        'ip_address',
        'user_agent',
        'reason',
        'started_at',
        'ended_at',
    ];

    protected $casts = [
        'started_at' => 'datetime',
        'ended_at' => 'datetime',
    ];

    public function superAdmin(): BelongsTo
    {
        return $this->belongsTo(User::class, 'super_admin_id');
    }

    public function targetCompany(): BelongsTo
    {
        return $this->belongsTo(Company::class, 'target_company_id');
    }

    public function targetUser(): BelongsTo
    {
        return $this->belongsTo(User::class, 'target_user_id');
    }

    public function isActive(): bool
    {
        return $this->ended_at === null;
    }

    public function end(): void
    {
        $this->update(['ended_at' => now()]);
    }
}
