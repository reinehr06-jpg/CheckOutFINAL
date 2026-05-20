#!/bin/bash

echo "=== Starting Basileia Checkout ==="
echo "DB_HOST=$DB_HOST"

# Ensure .env exists
if [ ! -f .env ]; then
    touch .env
    echo "Empty .env created"
fi

# Function to safely update .env values
update_env() {
    local key=$1
    local value=$2
    if [ -n "$value" ]; then
        grep -v "^${key}=" .env > .env.tmp 2>/dev/null || true
        echo "${key}='${value}'" >> .env.tmp
        mv .env.tmp .env
    fi
}

# Respect APP_KEY from environment
if [ -z "$APP_KEY" ] && ! grep -q "^APP_KEY=." .env; then
    export APP_KEY="base64:7x/rsIo0EgeWpySgaruzspY+loHN0EaKPUBOBZY1+9Y="
fi

# Update .env with environment variables
update_env "APP_NAME" "${APP_NAME:-Basileia}"
update_env "APP_ENV" "${APP_ENV:-production}"
update_env "APP_KEY" "$APP_KEY"
update_env "APP_DEBUG" "true"
update_env "APP_URL" "${APP_URL:-http://localhost:8000}"
update_env "DB_CONNECTION" "pgsql"
update_env "DB_HOST" "$DB_HOST"
update_env "DB_PORT" "${DB_PORT:-5432}"
update_env "DB_DATABASE" "${DB_DATABASE:-basileia}"
update_env "DB_USERNAME" "${DB_USERNAME:-postgres}"
update_env "DB_PASSWORD" "${DB_PASSWORD:-secret}"
update_env "SESSION_DRIVER" "database"
update_env "CACHE_STORE" "database"
update_env "QUEUE_CONNECTION" "sync"

# Clear config cache and set permissions
find storage -type d -exec chmod 755 {} + 2>/dev/null || true
find storage -type f -exec chmod 644 {} + 2>/dev/null || true
mkdir -p storage/framework/sessions storage/framework/cache/data storage/framework/views storage/logs 2>/dev/null || true
chmod -R 755 storage bootstrap/cache 2>/dev/null || true
rm -rf bootstrap/cache/*.php 2>/dev/null || true

# Wait for DB and run migrations
echo "Running migrations..."
for i in $(seq 1 30); do
    if php artisan migrate --force --no-interaction 2>&1; then
        echo "Migrations OK!"
        break
    fi
    echo "DB not ready, waiting... ($i/30)"
    sleep 2
done

# Create super admin user safely
echo "Creating super admin user..."
php artisan tinker --execute="
    \$email = 'admin@basileia.global';
    \$user = \App\Models\User::where('email', \$email)->first();
    if (!\$user) {
        \$user = new \App\Models\User();
        \$user->uuid = \Illuminate\Support\Str::uuid();
        \$user->name = 'Super Admin';
        \$user->email = \$email;
        \$user->password = password_hash('Basileia@2026!', PASSWORD_BCRYPT);
        \$user->role = 'super_admin';
        \$user->company_id = null;
        \$user->status = 'active';
        \$user->email_verified_at = now();
        \$user->two_factor_enabled = false;
        \$user->failed_attempts = 0;
        \$user->save();
        echo 'Super admin created: ' . \$email . PHP_EOL;
    } else {
        echo 'Super admin already exists.' . PHP_EOL;
    }
" 2>&1 || echo "WARNING: Could not create admin user"

# Start server
echo ""
echo "=== SINAL DE VIDA ATIVADO - Servidor na porta 8000 ==="
echo ""
exec php -S 0.0.0.0:8000 -t public
