#!/bin/bash
set -e

echo "Running migrations..."
php artisan migrate --force --no-interaction 2>&1 || echo "Migration failed or already up-to-date"

echo "Starting application..."
exec "$@"
