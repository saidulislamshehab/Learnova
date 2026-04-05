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
            
            $table->text('Description')->nullable();
            $table->text('short_description')->nullable();
            
            $table->longText('Overview')->nullable();
            $table->longText('overview')->nullable(); // duplicate name from later update
            
            $table->string('Thumbnail')->nullable();
            $table->string('thumbnail')->nullable(); // duplicate name from later update
            
            $table->string('Status', 20)->default('draft');
            $table->enum('status', ['draft', 'pending', 'published'])->default('draft'); // duplicate name/enum from later update
            
            // Pricing & Stats
            $table->decimal('Price', 8, 2)->default(0.00);
            $table->decimal('price', 10, 2)->nullable(); // duplicate name from later update
            $table->decimal('Original_Price', 8, 2)->nullable();
            $table->decimal('Rating', 3, 2)->default(0.00);
            $table->unsignedInteger('Total_Ratings')->default(0);
            $table->unsignedInteger('Students_Count')->default(0);
            
            // Duration
            $table->decimal('Total_Hours', 5, 1)->nullable();
            $table->float('duration')->nullable(); // duplicate name from later update
            
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
