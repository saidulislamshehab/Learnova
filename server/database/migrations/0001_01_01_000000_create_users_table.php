<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        if (Schema::hasTable('users')) {
            return;
        }
        Schema::create('users', function (Blueprint $table) {
            $table->id();
            $table->string('name');
            $table->string('username')->unique()->nullable();
            $table->string('email')->unique();
            $table->string('role', 20)->default('student');
            $table->string('password');
            $table->string('picture')->default('https://res.cloudinary.com/dp1li5tkd/image/upload/v1776439457/silver-membership-icon-default-avatar-profile-icon-membership-icon-social-media-user-image-illustration-vector_xxnra2.jpg');
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
            $table->boolean('two_factor_enabled')->default(false);
            $table->boolean('email_notifications')->default(true);
            $table->boolean('platform_notifications')->default(true);
            $table->timestamp('email_verified_at')->nullable();
            $table->rememberToken();
            $table->timestamps();
        });

        Schema::create('password_reset_tokens', function (Blueprint $table) {
            $table->string('email')->primary();
            $table->string('token');
            $table->timestamp('created_at')->nullable();
        });

        Schema::create('sessions', function (Blueprint $table) {
            $table->string('id')->primary();
            $table->foreignId('user_id')->nullable()->index();
            $table->string('ip_address', 45)->nullable();
            $table->text('user_agent')->nullable();
            $table->longText('payload');
            $table->integer('last_activity')->index();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('users');
        Schema::dropIfExists('password_reset_tokens');
        Schema::dropIfExists('sessions');
    }
};
