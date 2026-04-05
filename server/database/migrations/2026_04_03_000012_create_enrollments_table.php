<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration {
    public function up(): void
    {
        if (Schema::hasTable('enrollments')) {
            return;
        }
        Schema::create('enrollments', function (Blueprint $table) {
            $table->id('EnrollmentID');
            $table->unsignedBigInteger('UserID');
            $table->unsignedBigInteger('CourseID');
            $table->decimal('Amount_Paid', 8, 2);
            $table->unsignedTinyInteger('Progress_Percent')->default(0);
            $table->unsignedInteger('Completed_Lessons')->default(0);
            $table->timestamp('Last_Accessed_At')->nullable();
            $table->timestamps();

            $table->foreign('UserID')->references('id')->on('users')->onDelete('cascade');
            $table->index('CourseID');
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('enrollments');
    }
};
