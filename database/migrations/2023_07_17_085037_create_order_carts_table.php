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
        Schema::create('order_carts', function (Blueprint $table) {
            $table->integer('cart_id')->unsigned();

            $table->integer('order_id')->unsigned();

            $table->foreign('cart_id')->references('id')->on('carts')

                ->onDelete('cascade');

            $table->foreign('order_id')->references('id')->on('orders')

                ->onDelete('cascade');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('order_carts');
    }
};
