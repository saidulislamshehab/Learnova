<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration {
    public function up(): void
    {
        Schema::create('courses', function (Blueprint $table) {
            $table->id('CourseID');
            $table->unsignedBigInteger('I_ID');   // FK to instructors
            $table->unsignedBigInteger('UserID'); // FK to users (course owner)
            $table->string('Title');
            $table->string('Category');
            $table->text('Description')->nullable();
            $table->text('Overview')->nullable();  // what students will learn
            $table->string('Thumbnail')->nullable(); // image URL
            $table->decimal('Total_Hours', 5, 1)->nullable();
            $table->decimal('Price', 8, 2)->default(0.00);
            $table->string('Status', 20)->default('draft'); // draft | pending | published
            $table->timestamps();

            $table->foreign('I_ID')->references('I_ID')->on('instructors');
            $table->foreign('UserID')->references('id')->on('users');
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('courses');
    }
};
