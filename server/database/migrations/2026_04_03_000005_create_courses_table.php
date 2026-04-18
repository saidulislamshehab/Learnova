<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration {
    public function up(): void
    {
        if (Schema::hasTable('courses')) {
            return;
        }
        Schema::create('courses', function (Blueprint $table) {
            // General Course Info
            $table->id('CourseID');
            $table->unsignedBigInteger('UserID'); // Instructor link
            $table->unsignedBigInteger('category_id')->nullable();
            $table->string('category_name')->nullable();
            
            $table->string('Title');
            $table->string('Category'); // legacy or string-based category
            $table->string('Course_Code', 50)->nullable();
            
            $table->text('Description')->nullable(); // primary description
            $table->longText('Overview')->nullable(); // primary overview
            $table->string('Thumbnail')->nullable(); // primary thumbnail
            
            $table->enum('Status', ['draft', 'pending', 'published', 'rejected'])->default('draft');
            
            // Pricing & Stats
            $table->decimal('Price', 10, 2)->default(0.00); // combined price
            $table->decimal('Old_Price', 10, 2)->nullable();
            $table->decimal('Rating', 3, 2)->default(0.00);
            $table->unsignedInteger('Total_Ratings')->default(0);
            $table->unsignedInteger('Students_Count')->default(0);
            
            // Duration
            $table->decimal('Total_Hours', 8, 2)->nullable(); // combined duration
            
            // Instructor metadata used by frontend listing
            $table->string('Instructor_Name')->nullable();
            $table->string('Instructor_Title')->nullable();
            $table->text('Instructor_Bio')->nullable();
            $table->string('Instructor_Image')->nullable();
            
            // Rich content
            $table->json('Learning_Outcomes')->nullable();
            
            $table->timestamps();

            $table->foreign('UserID')->references('id')->on('users')->onDelete('cascade');
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('courses');
    }
};
