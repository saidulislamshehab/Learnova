<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration {
    public function up(): void
    {
        Schema::create('reports', function (Blueprint $table) {
            $table->id('R_ID');
            $table->unsignedBigInteger('UserID');      // who filed the report
            $table->unsignedBigInteger('Article_ID');  // which article is reported
            $table->string('Report_Type', 50);         // Inappropriate | Plagiarism | Technical Inaccuracy | Spam | etc.
            $table->text('Description')->nullable();
            $table->string('Status', 20)->default('pending'); // pending | under_review | resolved
            $table->timestamps();

            $table->foreign('UserID')->references('id')->on('users');
            $table->foreign('Article_ID')->references('Article_ID')->on('articles');
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('reports');
    }
};
