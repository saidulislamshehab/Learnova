<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration {
    public function up(): void
    {
        if (Schema::hasTable('lesson_progress')) {
            return;
        }
        Schema::create('lesson_progress', function (Blueprint $table) {
            $table->id('Progress_ID');
            $table->unsignedBigInteger('UserID');
            $table->unsignedBigInteger('Course_Content_ID'); // Fixed reference
            $table->boolean('Is_Completed')->default(false);
            $table->timestamp('Completed_At')->nullable();
            $table->timestamps();

            $table->foreign('UserID')->references('id')->on('users')->onDelete('cascade');
            $table->foreign('Course_Content_ID')->references('id')->on('course_contents')->onDelete('cascade');
            $table->unique(['UserID', 'Course_Content_ID']);
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('lesson_progress');
    }
};
