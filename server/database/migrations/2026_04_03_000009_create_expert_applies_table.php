<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration {
    public function up(): void
    {
        Schema::create('expert_applies', function (Blueprint $table) {
            $table->id('Ex_Ap_ID');
            $table->unsignedBigInteger('UserID');
            $table->string('Expertise')->nullable();
            $table->text('About')->nullable();         // applicant's bio/motivation
            $table->string('Status', 20)->default('pending'); // pending | approved | rejected
            $table->timestamps();

            $table->foreign('UserID')->references('id')->on('users');
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('expert_applies');
    }
};
