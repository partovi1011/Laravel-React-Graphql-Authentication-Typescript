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
        Schema::create('orders', function (Blueprint $table) {
            $table->id();
            $table->integer('user_id')->unsigned();
            $table->enum('status', ['WAIT_TO_PAY', 'PAID', 'PACKING', 'SENT'])->default('WAIT_TO_PAY');
            $table->integer('total');
            $table->integer('discount')->default(0);
            $table->integer('shipping_price')->default(0);
            $table->string('address');
            $table->string('name');
            $table->string('tel');
            $table->string('zip');
            $table->string('note')->nullable();
            $table->string('tracking_code')->nullable();
            $table->timestamps();

            $table->foreign('user_id')->references('id')->on('users')
            ->onDelete('cascade');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('orders');
    }
};
