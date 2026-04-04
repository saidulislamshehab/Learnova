<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration {
    public function up(): void
    {
        Schema::create('articles', function (Blueprint $table) {
            $table->id('Article_ID');
            $table->unsignedBigInteger('Ex_ID');  // FK to experts
            $table->string('Title');
            $table->longText('Content');
            $table->string('Tags')->nullable();    // JSON-encoded tags/categories
            $table->integer('Reaction')->default(0); // like/reaction count
            $table->string('Status', 20)->default('draft'); // draft | pending | published
            $table->timestamps();

            $table->foreign('Ex_ID')->references('Ex_ID')->on('experts');
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('articles');
    }
};
