<?php

namespace App\Services\Audit;

use App\Models\AuditLog;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Request;
use Illuminate\Support\Facades\Log;

class SnapshotAuditService
{
    private AuditService $audit;
    private array $sensitiveFields = ['password', 'secret', 'token', 'key', 'api_key', 'credentials', 'cvv', 'pan'];

    public function __construct(AuditService $audit)
    {
        $this->audit = $audit;
    }

    public function logMutation(
        string $event,
        Model $entity,
        array $before,
        array $after,
        ?string $summary = null
    ): AuditLog {
        $diff = $this->computeDiff($before, $after);

        $metadata = [
            'entity_type' => get_class($entity),
            'entity_id' => $entity->id,
            'diff' => $diff,
            'summary' => $summary ?? $this->defaultSummary($event, $entity),
            'before' => $this->maskSensitive($before),
            'after' => $this->maskSensitive($after),
        ];

        return $this->audit->log($event, $entity, $metadata);
    }

    public function logAction(
        string $event,
        array $payload,
        ?Model $entity = null
    ): AuditLog {
        $metadata = [
            'payload' => $this->maskSensitive($payload),
            'entity_type' => $entity ? get_class($entity) : null,
            'entity_id' => $entity ? $entity->id : null,
        ];

        return $this->audit->log($event, $entity, $metadata);
    }

    private function computeDiff(array $before, array $after): array
    {
        $diff = [];

        foreach ($after as $key => $value) {
            if (in_array($key, ['updated_at', 'created_at', 'timestamps'])) {
                continue;
            }

            $oldValue = $before[$key] ?? null;

            if ($oldValue !== $value) {
                $diff[$key] = [
                    'old' => $this->sanitizeValue($oldValue),
                    'new' => $this->sanitizeValue($value),
                ];
            }
        }

        return $diff;
    }

    private function sanitizeValue(mixed $value): mixed
    {
        if (is_string($value) && strlen($value) > 500) {
            return substr($value, 0, 500) . '...';
        }

        return $value;
    }

    private function maskSensitive(array $data): array
    {
        array_walk_recursive($data, function (&$value, $key) {
            foreach ($this->sensitiveFields as $field) {
                if (stripos((string) $key, $field) !== false) {
                    $value = '[MASKED]';
                    break;
                }
            }
        });

        return $data;
    }

    private function defaultSummary(string $event, Model $entity): string
    {
        $className = class_basename($entity);
        return "{$event} on {$className}#{$entity->id}";
    }
}
