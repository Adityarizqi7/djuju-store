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
        Schema::create('notes', function (Blueprint $table) {
            $table->id();
            $table->string('code_record');
            $table->integer('purchase_amount');
            $table->char('is_saved', 1)->nullable();
            $table->char('is_session', 1)->nullable();
            $table->char('is_finished', 1)->nullable();
            $table->integer('cost_total')->nullable()->default(0);
            $table->integer('cost_subtotal')->nullable()->default(0);
            $table->string('transaction_order')->nullable()->default(0);
            $table->dateTime('created_transaction_at')->nullable();
            $table->unsignedBigInteger('product_id');
            $table->foreign('product_id')->references('id')->on('products');
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('notes');
    }
};
