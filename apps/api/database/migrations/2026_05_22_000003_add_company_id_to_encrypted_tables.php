<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        if (Schema::hasTable('gateway_credentials')) {
            Schema::table('gateway_credentials', function (Blueprint $table) {
                if (!Schema::hasColumn('gateway_credentials', 'company_id')) {
                    $table->unsignedBigInteger('company_id')->nullable()->after('gateway_account_id');

                    $table->foreign('company_id')
                        ->references('id')
                        ->on('companies')
                        ->onDelete('set null');
                }
            });
        }

        if (Schema::hasTable('gateway_configs')) {
            Schema::table('gateway_configs', function (Blueprint $table) {
                if (!Schema::hasColumn('gateway_configs', 'company_id')) {
                    $table->unsignedBigInteger('company_id')->nullable()->after('gateway_id');

                    $table->foreign('company_id')
                        ->references('id')
                        ->on('companies')
                        ->onDelete('set null');
                }
            });
        }
    }

    public function down(): void
    {
        if (Schema::hasTable('gateway_credentials') && Schema::hasColumn('gateway_credentials', 'company_id')) {
            Schema::table('gateway_credentials', function (Blueprint $table) {
                $table->dropForeign(['company_id']);
                $table->dropColumn('company_id');
            });
        }

        if (Schema::hasTable('gateway_configs') && Schema::hasColumn('gateway_configs', 'company_id')) {
            Schema::table('gateway_configs', function (Blueprint $table) {
                $table->dropForeign(['company_id']);
                $table->dropColumn('company_id');
            });
        }
    }
};
