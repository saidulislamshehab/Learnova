<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration {
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        Schema::table('users', function (Blueprint $table) {
            $table->string('picture')->nullable();
            $table->text('bio')->nullable();
            $table->string('gender')->nullable();
            $table->string('country')->nullable();
            $table->string('number')->nullable();
            $table->string('city')->nullable();
            $table->string('designation')->nullable();
            $table->integer('experience')->nullable();
            $table->string('company_name')->nullable();
            $table->text('qualifications')->nullable();
            $table->string('institution')->nullable();
            $table->string('github_link')->nullable();
            $table->string('linkedin_link')->nullable();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('users', function (Blueprint $table) {
            $table->dropColumn([
                'picture',
                'bio',
                'gender',
                'country',
                'number',
                'city',
                'designation',
                'experience',
                'company_name',
                'qualifications',
                'institution',
                'github_link',
                'linkedin_link',
            ]);
        });
    }
};
