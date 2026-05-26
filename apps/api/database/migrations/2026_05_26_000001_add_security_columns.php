<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        Schema::table('audit_logs', function (Blueprint $table) {
            $table->string('previous_hash', 64)->nullable()->after('metadata');
            $table->string('record_hash', 64)->nullable()->after('previous_hash');
        });

        Schema::table('transactions', function (Blueprint $table) {
            $table->string('signature', 255)->nullable()->after('status');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('audit_logs', function (Blueprint $table) {
            $table->dropColumn(['previous_hash', 'record_hash']);
        });

        Schema::table('transactions', function (Blueprint $table) {
            $table->dropColumn('signature');
        });
    }
};
