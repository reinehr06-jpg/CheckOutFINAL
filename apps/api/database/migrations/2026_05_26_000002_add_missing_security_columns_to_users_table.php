<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::table('users', function (Blueprint $table) {
            if (!Schema::hasColumn('users', 'email_verified_at')) {
                $table->timestamp('email_verified_at')->nullable();
            }
            if (!Schema::hasColumn('users', 'two_factor_enabled')) {
                $table->boolean('two_factor_enabled')->default(false);
            }
            if (!Schema::hasColumn('users', 'two_factor_secret')) {
                $table->string('two_factor_secret')->nullable();
            }
            if (!Schema::hasColumn('users', 'two_factor_confirmed_at')) {
                $table->timestamp('two_factor_confirmed_at')->nullable();
            }
            if (!Schema::hasColumn('users', 'must_change_password')) {
                $table->boolean('must_change_password')->default(false);
            }
            if (!Schema::hasColumn('users', 'password_changed_at')) {
                $table->timestamp('password_changed_at')->nullable();
            }
            if (!Schema::hasColumn('users', 'failed_attempts')) {
                $table->integer('failed_attempts')->default(0);
            }
            if (!Schema::hasColumn('users', 'locked_at')) {
                $table->timestamp('locked_at')->nullable();
            }
            if (!Schema::hasColumn('users', 'last_login_at')) {
                $table->timestamp('last_login_at')->nullable();
            }
        });
    }

    public function down(): void
    {
        Schema::table('users', function (Blueprint $table) {
            $columnsToDrop = [];
            
            if (Schema::hasColumn('users', 'email_verified_at')) $columnsToDrop[] = 'email_verified_at';
            if (Schema::hasColumn('users', 'two_factor_enabled')) $columnsToDrop[] = 'two_factor_enabled';
            if (Schema::hasColumn('users', 'two_factor_secret')) $columnsToDrop[] = 'two_factor_secret';
            if (Schema::hasColumn('users', 'two_factor_confirmed_at')) $columnsToDrop[] = 'two_factor_confirmed_at';
            if (Schema::hasColumn('users', 'must_change_password')) $columnsToDrop[] = 'must_change_password';
            if (Schema::hasColumn('users', 'password_changed_at')) $columnsToDrop[] = 'password_changed_at';
            if (Schema::hasColumn('users', 'failed_attempts')) $columnsToDrop[] = 'failed_attempts';
            if (Schema::hasColumn('users', 'locked_at')) $columnsToDrop[] = 'locked_at';
            if (Schema::hasColumn('users', 'last_login_at')) $columnsToDrop[] = 'last_login_at';

            if (!empty($columnsToDrop)) {
                $table->dropColumn($columnsToDrop);
            }
        });
    }
};
