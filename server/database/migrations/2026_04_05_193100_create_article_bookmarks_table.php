<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration {
    public function up(): void
    {
        if (Schema::hasTable('article_bookmarks')) {
            return;
        }
        Schema::create('article_bookmarks', function (Blueprint $table) {
            $table->id('Bookmark_ID');
            $table->unsignedBigInteger('UserID');
            $table->unsignedBigInteger('Article_ID');
            $table->timestamps();

            $table->foreign('UserID')->references('id')->on('users')->onDelete('cascade');
            $table->foreign('Article_ID')->references('Article_ID')->on('articles')->onDelete('no action');
            $table->unique(['UserID', 'Article_ID']);
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('article_bookmarks');
    }
};
