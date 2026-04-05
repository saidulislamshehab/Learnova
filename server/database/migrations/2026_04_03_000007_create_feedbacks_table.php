<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration {
    public function up(): void
    {
        Schema::create('feedbacks', function (Blueprint $table) {
            $table->id('F_ID');
            $table->unsignedBigInteger('UserID');
            $table->string('Subject');
            $table->string('Type', 30); // suggestion | bug | general
            $table->text('Description');  // the feedback message/body
            $table->string('Status', 20)->default('new'); // new | in_progress | resolved
            $table->timestamps();

            $table->foreign('UserID')->references('id')->on('users');
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('feedbacks');
    }
};
