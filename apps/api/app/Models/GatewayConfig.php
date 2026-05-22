<?php

namespace App\Models;

use App\Casts\AsTenantEncrypted;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class GatewayConfig extends Model
{
    protected $fillable = [
        'gateway_id',
        'company_id',
        'key',
        'value',
    ];

    protected function casts(): array
    {
        return [
            'value' => AsTenantEncrypted::class . ':company_id',
        ];
    }

    public function gateway(): BelongsTo
    {
        return $this->belongsTo(Gateway::class);
    }
}
