#!/bin/bash

REAL_DB_HOST="${DB_HOST:-postgres}"
if [ "$DB_HOST" = "localhost" ] || [ "$DB_HOST" = "127.0.0.1" ]; then
    REAL_DB_HOST="postgres"
fi

printf 'APP_NAME=Basileia\nAPP_ENV=production\nAPP_KEY=\nAPP_DEBUG=true\nAPP_URL=http://localhost:8000\nDB_CONNECTION=pgsql\nDB_HOST=%s\nDB_PORT=%s\nDB_DATABASE=%s\nDB_USERNAME=%s\nDB_PASSWORD=%s\nSESSION_DRIVER=file\nCACHE_STORE=file\nQUEUE_CONNECTION=sync\nDEFAULT_GATEWAY=asaas\n' \
    "$REAL_DB_HOST" \
    "${DB_PORT:-5432}" \
    "${DB_DATABASE:-checkout}" \
    "${DB_USERNAME:-postgres}" \
    "${DB_PASSWORD:-secret}" > .env

php artisan key:generate --force 2>&1
php artisan migrate --force --no-interaction 2>&1 || true
php artisan tinker --execute='App\Models\User::firstOrCreate(["email"=>"admin@checkout.com"],["name"=>"Admin","password"=>bcrypt("Admin@123"),"role"=>"super_admin","status"=>"active","email_verified_at"=>now()]);' 2>&1 || true

exec php artisan serve --host=0.0.0.0 --port=8000
