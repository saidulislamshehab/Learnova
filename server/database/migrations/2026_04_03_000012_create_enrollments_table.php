<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration {
    public function up(): void
    {
        Schema::dropIfExists('enrollments');
        
        Schema::create('enrollments', function (Blueprint $table) {
            $table->id();
            $table->unsignedBigInteger('UserID');
            $table->unsignedBigInteger('CourseID');
            $table->string('Payment_Method', 20)->nullable();
            $table->decimal('Amount_Paid', 8, 2);
            $table->dateTime('Enrolled_At')->useCurrent();
            $table->unsignedTinyInteger('Progress_Percent')->default(0);
            $table->integer('Completed_Lessons')->default(0);
            $table->dateTime('Last_Accessed_At')->nullable();
            $table->timestamps();

            $table->foreign('UserID')->references('id')->on('users')->onDelete('cascade');
            $table->foreign('CourseID')->references('CourseID')->on('courses')->onDelete('no action');
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('enrollments');
    }
};
