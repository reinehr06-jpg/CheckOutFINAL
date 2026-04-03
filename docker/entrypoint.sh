#!/bin/bash
set -e

echo "Waiting for database..."
for i in $(seq 1 30); do
    php artisan db:show --tries=1 2>/dev/null && break
    echo "Database not ready, waiting... ($i/30)"
    sleep 2
done

echo "Running migrations..."
php artisan migrate --force --no-interaction 2>&1 || echo "Migration warning: some migrations may have failed"

echo "Starting application..."
exec "$@"
