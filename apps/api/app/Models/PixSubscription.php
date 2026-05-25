<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class PixSubscription extends Model
{
    protected $fillable = [
        'uuid', 'company_id', 'system_id', 'customer_id', 'gateway_account_id', 'gateway_id',
        'name', 'description', 'amount', 'currency', 'interval_type',
        'interval_count', 'billing_day', 'status', 'mandate_id',
        'trial_days', 'trial_ends_at', 'starts_at', 'ends_at',
        'next_billing_at', 'current_cycle', 'total_paid', 'total_failed',
        'cancel_reason', 'cancelled_at', 'metadata',
    ];

    protected function casts(): array
    {
        return [
            'metadata' => 'array',
            'trial_ends_at' => 'datetime',
            'starts_at' => 'datetime',
            'ends_at' => 'datetime',
            'next_billing_at' => 'datetime',
            'cancelled_at' => 'datetime',
        ];
    }
}
