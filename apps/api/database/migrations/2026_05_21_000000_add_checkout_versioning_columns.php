<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        // Add missing columns to checkout_experiences
        Schema::table('checkout_experiences', function (Blueprint $table) {
            if (!Schema::hasColumn('checkout_experiences', 'description')) {
                $table->string('description')->nullable()->after('name');
            }
            if (!Schema::hasColumn('checkout_experiences', 'current_version_id')) {
                $table->unsignedBigInteger('current_version_id')->nullable()->after('published_version_id');
            }
            if (!Schema::hasColumn('checkout_experiences', 'settings')) {
                $table->jsonb('settings')->nullable()->after('config');
            }
            if (!Schema::hasColumn('checkout_experiences', 'created_by')) {
                $table->foreignId('created_by')->nullable()->constrained('users')->nullOnDelete()->after('settings');
            }
        });

        // Add missing columns to checkout_experience_versions
        Schema::table('checkout_experience_versions', function (Blueprint $table) {
            if (!Schema::hasColumn('checkout_experience_versions', 'status')) {
                $table->string('status')->default('draft')->after('version_number');
            }
            if (!Schema::hasColumn('checkout_experience_versions', 'source')) {
                $table->string('source')->default('manual')->after('status');
            }
            if (!Schema::hasColumn('checkout_experience_versions', 'publication_score')) {
                $table->integer('publication_score')->nullable()->after('source');
            }
            if (!Schema::hasColumn('checkout_experience_versions', 'prompt_original')) {
                $table->text('prompt_original')->nullable()->after('publication_score');
            }
            if (!Schema::hasColumn('checkout_experience_versions', 'ai_metadata')) {
                $table->jsonb('ai_metadata')->nullable()->after('prompt_original');
            }
            if (!Schema::hasColumn('checkout_experience_versions', 'published_at')) {
                $table->timestamp('published_at')->nullable()->after('ai_metadata');
            }
            if (!Schema::hasColumn('checkout_experience_versions', 'created_by')) {
                $table->foreignId('created_by')->nullable()->constrained('users')->nullOnDelete()->after('published_at');
            }
        });

        // Create checkout_configs table (referenced by CheckoutConfig model)
        if (!Schema::hasTable('checkout_configs')) {
            Schema::create('checkout_configs', function (Blueprint $table) {
                $table->id();
                $table->foreignId('company_id')->constrained('companies')->cascadeOnDelete();
                $table->string('name');
                $table->string('slug')->nullable();
                $table->string('description')->nullable();
                $table->jsonb('config')->nullable();
                $table->jsonb('canvas_elements')->nullable();
                $table->boolean('is_active')->default(false);
                $table->timestamps();

                $table->index(['company_id', 'is_active']);
            });
        }
    }

    public function down(): void
    {
        Schema::table('checkout_experiences', function (Blueprint $table) {
            $table->dropForeignIfExists(['created_by']);
            $table->dropColumnIfExists(['description', 'current_version_id', 'settings', 'created_by']);
        });

        Schema::table('checkout_experience_versions', function (Blueprint $table) {
            $table->dropForeignIfExists(['created_by']);
            $table->dropColumnIfExists([
                'status', 'source', 'publication_score',
                'prompt_original', 'ai_metadata', 'published_at', 'created_by',
            ]);
        });

        Schema::dropIfExists('checkout_configs');
    }
};
