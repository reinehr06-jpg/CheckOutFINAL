<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        // 1. gateways
        Schema::create('gateways', function (Blueprint $table) {
            $table->id();
            $table->foreignId('company_id')->constrained('companies')->cascadeOnDelete();
            $table->string('name');
            $table->string('slug')->unique();
            $table->string('type');
            $table->string('status')->default('active');
            $table->boolean('is_default')->default(false);
            $table->timestamps();
        });

        // 2. gateway_configs
        if (!Schema::hasTable('gateway_configs')) {
            Schema::create('gateway_configs', function (Blueprint $table) {
                $table->id();
                $table->foreignId('gateway_id')->constrained('gateways')->cascadeOnDelete();
                $table->foreignId('company_id')->nullable()->constrained('companies')->nullOnDelete();
                $table->string('key');
                $table->text('value');
                $table->timestamps();
                $table->unique(['gateway_id', 'key']);
            });
        }

        // 3. integrations
        Schema::create('integrations', function (Blueprint $table) {
            $table->id();
            $table->uuid('uuid')->unique();
            $table->foreignId('company_id')->constrained('companies')->cascadeOnDelete();
            $table->foreignId('gateway_id')->nullable()->constrained('gateways')->nullOnDelete();
            $table->string('name');
            $table->string('slug');
            $table->string('base_url')->nullable();
            $table->string('api_key_hash')->unique();
            $table->string('api_key_prefix')->index();
            $table->json('permissions')->nullable();
            $table->string('webhook_url', 500)->nullable();
            $table->string('webhook_secret', 64)->nullable();
            $table->string('status')->default('active');
            $table->timestamp('last_used_at')->nullable();
            $table->timestamps();
        });

        // 4. login_attempts
        Schema::create('login_attempts', function (Blueprint $table) {
            $table->id();
            $table->foreignId('user_id')->nullable()->constrained('users')->nullOnDelete();
            $table->string('email');
            $table->string('ip_address');
            $table->string('user_agent')->nullable();
            $table->boolean('success');
            $table->string('failure_reason')->nullable();
            $table->timestamp('created_at')->useCurrent();
        });

        // 5. company_keys
        Schema::create('company_keys', function (Blueprint $table) {
            $table->foreignId('company_id')->primary()->constrained('companies')->cascadeOnDelete();
            $table->binary('key'); // 32 bytes
            $table->timestamps();
        });

        // 6. transactions
        Schema::create('transactions', function (Blueprint $table) {
            $table->id();
            $table->uuid('uuid')->unique();
            $table->foreignId('company_id')->constrained('companies')->cascadeOnDelete();
            $table->foreignId('integration_id')->nullable()->constrained('integrations')->nullOnDelete();
            $table->foreignId('gateway_id')->nullable()->constrained('gateways')->nullOnDelete();
            $table->foreignId('customer_id')->nullable()->constrained('customers')->nullOnDelete();
            $table->string('external_id')->nullable();
            $table->string('reference')->nullable();
            $table->text('description')->nullable();
            $table->decimal('amount', 12, 2);
            $table->decimal('net_amount', 12, 2)->nullable();
            $table->string('currency', 3)->default('BRL');
            $table->string('payment_method')->default('credit_card');
            $table->string('status')->default('pending');
            $table->tinyInteger('installments')->unsigned()->default(1);
            $table->string('gateway_transaction_id')->nullable();
            $table->json('gateway_response')->nullable();
            $table->json('metadata')->nullable();
            $table->string('customer_name')->nullable();
            $table->string('customer_email')->nullable();
            $table->string('customer_document')->nullable();
            $table->string('customer_phone')->nullable();
            $table->json('customer_address')->nullable();
            $table->decimal('fraud_score', 5, 2)->nullable();
            $table->string('fraud_risk_level')->nullable();
            $table->json('fraud_flags')->nullable();
            $table->string('fraud_recommendation')->nullable();
            $table->string('ip_address')->nullable();
            $table->text('user_agent')->nullable();
            $table->decimal('refunded_amount', 12, 2)->nullable();
            $table->timestamp('status_changed_at')->nullable();
            $table->string('asaas_payment_id')->nullable();
            $table->string('source')->nullable();
            $table->string('callback_url')->nullable();
            $table->string('asaas_customer_id')->nullable();
            $table->timestamp('paid_at')->nullable();
            $table->timestamp('cancelled_at')->nullable();
            $table->timestamp('refunded_at')->nullable();
            $table->timestamps();

            $table->index(['company_id', 'status']);
            $table->index(['company_id', 'created_at']);
            $table->index('gateway_transaction_id');
        });

        // 7. subscriptions
        Schema::create('subscriptions', function (Blueprint $table) {
            $table->id();
            $table->uuid('uuid')->unique();
            $table->foreignId('company_id')->constrained('companies')->cascadeOnDelete();
            $table->foreignId('customer_id')->constrained('customers')->cascadeOnDelete();
            $table->foreignId('gateway_id')->nullable()->constrained('gateways')->nullOnDelete();
            $table->foreignId('integration_id')->nullable()->constrained('integrations')->nullOnDelete();
            $table->string('gateway_subscription_id')->nullable();
            $table->string('plan_name');
            $table->decimal('amount', 12, 2);
            $table->string('currency', 3)->default('BRL');
            $table->string('billing_cycle')->default('monthly');
            $table->tinyInteger('interval')->unsigned()->default(1);
            $table->string('status')->default('active');
            $table->string('callback_url')->nullable();
            $table->integer('retry_count')->default(0);
            $table->date('current_period_start')->nullable();
            $table->date('current_period_end')->nullable();
            $table->date('next_billing_date')->nullable();
            $table->json('metadata')->nullable();
            $table->timestamp('cancelled_at')->nullable();
            $table->timestamps();
        });

        // 8. events
        Schema::create('events', function (Blueprint $table) {
            $table->id();
            $table->foreignId('company_id')->constrained('companies')->cascadeOnDelete();
            $table->string('slug')->unique();
            $table->string('titulo');
            $table->text('descricao')->nullable();
            $table->decimal('valor', 12, 2);
            $table->string('moeda', 3)->default('BRL');
            $table->unsignedInteger('vagas_total');
            $table->unsignedInteger('vagas_ocupadas')->default(0);
            $table->string('whatsapp_vendedor')->nullable();
            $table->string('metodo_pagamento')->default('all');
            $table->string('gateway_transaction_id')->nullable();
            $table->timestamp('data_inicio')->nullable();
            $table->timestamp('data_fim')->nullable();
            $table->string('status')->default('ativo');
            $table->timestamps();
        });

        // 9. checkout_recovery
        Schema::create('checkout_recovery', function (Blueprint $table) {
            $table->id();
            $table->uuid('uuid')->unique();
            $table->foreignId('checkout_session_id')->constrained('checkout_sessions')->cascadeOnDelete();
            $table->foreignId('company_id')->constrained('companies')->cascadeOnDelete();
            $table->string('recovery_token')->unique();
            $table->timestamp('abandoned_at');
            $table->timestamp('email_sent_at')->nullable();
            $table->timestamp('opened_at')->nullable();
            $table->timestamp('converted_at')->nullable();
            $table->unsignedBigInteger('converted_payment_id')->nullable();
            $table->timestamp('expires_at');
            $table->timestamps();
        });

        // 10. checkout_ab_tests
        Schema::create('checkout_ab_tests', function (Blueprint $table) {
            $table->id();
            $table->foreignId('company_id')->constrained('companies')->cascadeOnDelete();
            $table->foreignId('config_a_id')->constrained('checkout_configs')->cascadeOnDelete();
            $table->foreignId('config_b_id')->constrained('checkout_configs')->cascadeOnDelete();
            $table->tinyInteger('split_percent')->unsigned()->default(50);
            $table->boolean('is_active')->default(false);
            $table->unsignedInteger('visits_a')->default(0);
            $table->unsignedInteger('visits_b')->default(0);
            $table->unsignedInteger('conversions_a')->default(0);
            $table->unsignedInteger('conversions_b')->default(0);
            $table->timestamps();
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('checkout_ab_tests');
        Schema::dropIfExists('checkout_recovery');
        Schema::dropIfExists('events');
        Schema::dropIfExists('subscriptions');
        Schema::dropIfExists('transactions');
        Schema::dropIfExists('company_keys');
        Schema::dropIfExists('login_attempts');
        Schema::dropIfExists('integrations');
        Schema::dropIfExists('gateway_configs');
        Schema::dropIfExists('gateways');
    }
};
