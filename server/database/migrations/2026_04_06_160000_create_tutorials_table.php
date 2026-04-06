<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration {
    public function up(): void
    {
        Schema::create('tutorials', function (Blueprint $table) {
            $table->id('T_ID');
            $table->string('Title');
            $table->string('Category');
            $table->text('Description')->nullable();
            $table->string('Status', 20)->default('draft'); // draft, published
            $table->timestamps();
        });

        Schema::create('tutorial_articles', function (Blueprint $table) {
            $table->id();
            $table->unsignedBigInteger('tutorial_id');
            $table->unsignedBigInteger('article_id');
            $table->integer('order')->default(0);
            $table->timestamps();

            $table->foreign('tutorial_id')->references('T_ID')->on('tutorials')->onDelete('cascade');
            $table->foreign('article_id')->references('Article_ID')->on('articles')->onDelete('cascade');
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('tutorial_articles');
        Schema::dropIfExists('tutorials');
    }
};
