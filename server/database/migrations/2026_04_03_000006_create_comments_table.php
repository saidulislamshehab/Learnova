<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration {
    public function up(): void
    {
        Schema::create('comments', function (Blueprint $table) {
            $table->id('C_ID');
            $table->unsignedBigInteger('UserID');
            $table->unsignedBigInteger('Article_ID');
            $table->text('Content');
            $table->timestamps();

            $table->foreign('UserID')->references('id')->on('users');
            $table->foreign('Article_ID')->references('Article_ID')->on('articles');
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('comments');
    }
};
