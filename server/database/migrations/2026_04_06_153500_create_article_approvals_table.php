<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration {
    public function up(): void
    {
        Schema::create('article_approvals', function (Blueprint $table) {
            $table->id();
            $table->unsignedBigInteger('article_id');
            $table->unsignedBigInteger('admin_id')->nullable();
            $table->string('status', 20)->default('pending'); // approved, rejected, pending
            $table->text('comments')->nullable();
            $table->timestamps();

            $table->foreign('article_id')->references('Article_ID')->on('articles')->onDelete('cascade');
            $table->foreign('admin_id')->references('id')->on('users')->onDelete('set null');
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('article_approvals');
    }
};
