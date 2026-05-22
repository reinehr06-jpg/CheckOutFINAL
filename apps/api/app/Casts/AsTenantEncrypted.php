<?php

namespace App\Casts;

use App\Services\Crypto\TenantEncryption;
use Illuminate\Contracts\Database\Eloquent\CastsAttributes;
use Illuminate\Database\Eloquent\Model;

class AsTenantEncrypted implements CastsAttributes
{
    private string $companyIdColumn;

    public function __construct(string $companyIdColumn = 'company_id')
    {
        $this->companyIdColumn = $companyIdColumn;
    }

    public function get(Model $model, string $key, mixed $value, array $attributes): ?string
    {
        if ($value === null || $value === '') {
            return null;
        }

        $companyId = $this->resolveCompanyId($model);

        if ($companyId === null) {
            throw new \RuntimeException('Cannot decrypt: no company_id resolved for ' . get_class($model));
        }

        return app(TenantEncryption::class)->decrypt($value, $companyId);
    }

    public function set(Model $model, string $key, mixed $value, array $attributes): ?string
    {
        if ($value === null || $value === '') {
            return null;
        }

        $companyId = $this->resolveCompanyId($model);

        if ($companyId === null) {
            throw new \RuntimeException('Cannot encrypt: no company_id resolved for ' . get_class($model));
        }

        return app(TenantEncryption::class)->encrypt($value, $companyId);
    }

    private function resolveCompanyId(Model $model): ?int
    {
        if (!empty($model->{$this->companyIdColumn})) {
            return (int) $model->{$this->companyIdColumn};
        }

        if (method_exists($model, 'companyIdFromRelation')) {
            return $model->companyIdFromRelation();
        }

        return \App\Services\TenantContext::companyId()
            ?? auth()->user()?->company_id;
    }
}
