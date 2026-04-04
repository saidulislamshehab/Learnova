<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration {
    public function up(): void
    {
        // Enrollments — tracks which students have paid for which courses
        Schema::create('enrollments', function (Blueprint $table) {
            $table->id();
            $table->unsignedBigInteger('UserID');
            $table->unsignedBigInteger('CourseID');
            $table->string('Payment_Method', 20)->nullable(); // card | wallet
            $table->decimal('Amount_Paid', 8, 2)->default(0.00);
            $table->timestamp('Enrolled_At')->useCurrent();
            $table->timestamps();

            $table->foreign('UserID')->references('id')->on('users');
            $table->foreign('CourseID')->references('CourseID')->on('courses');
            $table->unique(['UserID', 'CourseID']); // prevent duplicate enrollments
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('enrollments');
    }
};
