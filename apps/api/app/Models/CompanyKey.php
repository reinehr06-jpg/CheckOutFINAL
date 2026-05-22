<?php

namespace App\Models;

use App\Casts\AsTenantEncrypted;
use Illuminate\Database\Eloquent\Model;

class CompanyKey extends Model
{
    protected $table = 'company_keys';

    protected $primaryKey = 'company_id';
    public $incrementing = false;

    protected $fillable = [
        'company_id',
        'key',
    ];

    protected function casts(): array
    {
        return [
            'key' => AsTenantEncrypted::class . ':company_id',
        ];
    }
}
