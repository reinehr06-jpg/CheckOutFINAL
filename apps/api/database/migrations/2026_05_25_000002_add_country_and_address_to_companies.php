<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::table('companies', function (Blueprint $table) {
            if (!Schema::hasColumn('companies', 'phone')) {
                $table->string('phone')->nullable()->after('email');
            }
            if (!Schema::hasColumn('companies', 'country')) {
                $table->string('country', 2)->default('BR')->after('phone');
            }
            if (!Schema::hasColumn('companies', 'document_type')) {
                $table->string('document_type', 10)->nullable()->after('document');
            }
            if (!Schema::hasColumn('companies', 'address_line1')) {
                $table->string('address_line1')->nullable()->after('country');
            }
            if (!Schema::hasColumn('companies', 'address_line2')) {
                $table->string('address_line2')->nullable()->after('address_line1');
            }
            if (!Schema::hasColumn('companies', 'city')) {
                $table->string('city')->nullable()->after('address_line2');
            }
            if (!Schema::hasColumn('companies', 'state')) {
                $table->string('state', 100)->nullable()->after('city');
            }
            if (!Schema::hasColumn('companies', 'zip_code')) {
                $table->string('zip_code', 20)->nullable()->after('state');
            }
            if (!Schema::hasColumn('companies', 'timezone')) {
                $table->string('timezone', 50)->nullable()->after('zip_code');
            }
        });
    }

    public function down(): void
    {
        Schema::table('companies', function (Blueprint $table) {
            $columns = [
                'phone', 'country', 'document_type',
                'address_line1', 'address_line2', 'city',
                'state', 'zip_code', 'timezone',
            ];
            foreach ($columns as $column) {
                if (Schema::hasColumn('companies', $column)) {
                    $table->dropColumn($column);
                }
            }
        });
    }
};
