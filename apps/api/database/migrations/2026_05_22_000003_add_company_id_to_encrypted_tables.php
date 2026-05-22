<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::table('gateway_credentials', function (Blueprint $table) {
            $table->unsignedBigInteger('company_id')->nullable()->after('gateway_account_id');

            $table->foreign('company_id')
                ->references('id')
                ->on('companies')
                ->onDelete('set null');
        });

        Schema::table('gateway_configs', function (Blueprint $table) {
            $table->unsignedBigInteger('company_id')->nullable()->after('gateway_id');

            $table->foreign('company_id')
                ->references('id')
                ->on('companies')
                ->onDelete('set null');
        });
    }

    public function down(): void
    {
        Schema::table('gateway_credentials', function (Blueprint $table) {
            $table->dropForeign(['company_id']);
            $table->dropColumn('company_id');
        });

        Schema::table('gateway_configs', function (Blueprint $table) {
            $table->dropForeign(['company_id']);
            $table->dropColumn('company_id');
        });
    }
};
