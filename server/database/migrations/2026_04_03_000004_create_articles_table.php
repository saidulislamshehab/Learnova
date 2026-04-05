<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration {
    public function up(): void
    {
        if (Schema::hasTable('articles')) {
            return;
        }
        Schema::create('articles', function (Blueprint $table) {
            $table->id('Article_ID'); // PK article
            $table->unsignedBigInteger('UserID');  // user ID (author)
            $table->string('Title');
            $table->text('Content')->nullable();
            $table->text('Excerpt')->nullable();
            $table->string('Category')->nullable();
            $table->string('Read_Time', 30)->nullable();
            $table->string('Thumbnail')->nullable(); // image URL
            $table->integer('Reaction')->default(0);
            $table->unsignedInteger('Views')->default(0);
            $table->timestamps();

            $table->foreign('UserID')->references('id')->on('users')->onDelete('cascade');
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('articles');
    }
};
