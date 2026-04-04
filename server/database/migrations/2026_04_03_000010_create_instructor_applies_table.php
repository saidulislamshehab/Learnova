<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration {
    public function up(): void
    {
        // Instructor application — mirrors ExpertApply but for Instructor role
        Schema::create('instructor_applies', function (Blueprint $table) {
            $table->id('In_Ap_ID');
            $table->unsignedBigInteger('UserID');
            $table->string('Expertise')->nullable();
            $table->text('About')->nullable();
            $table->string('Status', 20)->default('pending'); // pending | approved | rejected
            $table->timestamps();

            $table->foreign('UserID')->references('id')->on('users');
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('instructor_applies');
    }
};
