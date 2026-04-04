<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class SourceConfig extends Model
{
    protected $fillable = [
        'source_name',
        'description',
        'callback_url',
        'webhook_secret',
        'product_types',
        'active',
    ];

    protected $casts = [
        'active' => 'boolean',
        'product_types' => 'array',
    ];

    public function isActive(): bool
    {
        return $this->active;
    }

    public function getProductTypesOptions(): array
    {
        return [
            'saas' => 'SaaS (Software)',
            'evento' => 'Evento/Ingressos',
            'curso' => 'Curso',
            'lancamento' => 'Lançamento',
            'outro' => 'Outro',
        ];
    }
}