<?php

namespace App\Models;

use App\Casts\AsTenantEncrypted;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class GatewayCredential extends Model
{
    use HasFactory;

    protected $fillable = [
        'gateway_account_id',
        'company_id',
        'key',
        'encrypted_value',
    ];

    protected function casts(): array
    {
        return [
            'encrypted_value' => AsTenantEncrypted::class . ':company_id',
        ];
    }

    public function gatewayAccount(): BelongsTo
    {
        return $this->belongsTo(GatewayAccount::class);
    }
}
