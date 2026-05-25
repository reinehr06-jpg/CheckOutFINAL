<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('pix_subscriptions', function (Blueprint $table) {
            $table->id();
            $table->uuid('uuid')->unique();
            $table->unsignedBigInteger('company_id');
            $table->unsignedBigInteger('system_id')->nullable();
            $table->unsignedBigInteger('customer_id')->nullable();
            $table->unsignedBigInteger('gateway_account_id')->nullable();
            $table->string('name');
            $table->string('description')->nullable();
            $table->bigInteger('amount');
            $table->string('currency')->default('BRL');
            $table->string('interval_type')->default('monthly');
            $table->integer('interval_count')->default(1);
            $table->integer('billing_day')->nullable();
            $table->string('status')->default('active');
            $table->unsignedBigInteger('mandate_id')->nullable();
            $table->integer('trial_days')->default(0);
            $table->timestamp('trial_ends_at')->nullable();
            $table->timestamp('starts_at');
            $table->timestamp('ends_at')->nullable();
            $table->timestamp('next_billing_at')->nullable();
            $table->integer('current_cycle')->default(0);
            $table->bigInteger('total_paid')->default(0);
            $table->integer('total_failed')->default(0);
            $table->string('cancel_reason')->nullable();
            $table->timestamp('cancelled_at')->nullable();
            $table->json('metadata')->nullable();
            $table->timestamps();
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('pix_subscriptions');
    }
};
