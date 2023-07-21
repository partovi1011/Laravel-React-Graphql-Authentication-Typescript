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
        Schema::create('products_tags', function (Blueprint $table) {
            $table->integer('product_id')->unsigned();

            $table->integer('tag_id')->unsigned();

            $table->foreign('product_id')->references('id')->on('products')

                ->onDelete('cascade');

            $table->foreign('tag_id')->references('id')->on('tags')

                ->onDelete('cascade');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('products_tags');
    }
};
