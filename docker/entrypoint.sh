#!/bin/bash
set -e

echo "=== Basileia Checkout Starting ==="

# Generate .env from environment variables
cat > .env << ENVEOF
APP_NAME=Basileia
APP_ENV=production
APP_KEY=
APP_DEBUG=true
APP_URL=http://localhost:8000
DB_CONNECTION=pgsql
DB_HOST=${DB_HOST:-postgres}
DB_PORT=${DB_PORT:-5432}
DB_DATABASE=${DB_DATABASE:-checkout}
DB_USERNAME=${DB_USERNAME:-postgres}
DB_PASSWORD=${DB_PASSWORD:-secret}
SESSION_DRIVER=file
CACHE_STORE=file
QUEUE_CONNECTION=sync
DEFAULT_GATEWAY=asaas
ENVEOF

echo "Generated .env file:"
cat .env | grep -v PASSWORD | grep -v KEY

echo "Clearing caches..."
rm -rf bootstrap/cache/*.php 2>/dev/null || true
rm -rf storage/framework/cache/data 2>/dev/null || true
rm -rf storage/framework/sessions/* 2>/dev/null || true
rm -rf storage/framework/views/* 2>/dev/null || true

echo "Running migrations..."
php artisan migrate --force --no-interaction 2>&1 || {
    echo "WARNING: Migration failed"
}

echo "Starting Laravel on port 8000..."
exec "$@"
