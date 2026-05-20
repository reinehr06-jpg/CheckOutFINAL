<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration {
    public function up(): void {
        Schema::table("users", function (Blueprint $table) {
            if (!Schema::hasColumn("users", "two_factor_codes")) $table->text("two_factor_codes")->nullable()->after("two_factor_secret");
            if (!Schema::hasColumn("users", "last_auth_at")) $table->timestamp("last_auth_at")->nullable()->after("two_factor_confirmed_at");
        });
    }
    public function down(): void {
        Schema::table("users", function (Blueprint $table) { $table->dropColumn(["two_factor_codes", "last_auth_at"]); });
    }
};
