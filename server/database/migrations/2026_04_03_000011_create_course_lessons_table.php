<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration {
    public function up(): void
    {
        // Course lessons — each course has ordered video lessons (YouTube links)
        Schema::create('course_lessons', function (Blueprint $table) {
            $table->id();
            $table->unsignedBigInteger('CourseID');
            $table->string('Title');
            $table->text('Description')->nullable();
            $table->string('YouTube_URL')->nullable();
            $table->integer('Order')->default(0); // display order within course
            $table->timestamps();

            $table->foreign('CourseID')->references('CourseID')->on('courses');
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('course_lessons');
    }
};
