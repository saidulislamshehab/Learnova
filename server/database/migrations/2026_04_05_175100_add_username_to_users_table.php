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
        // 1. Add the column without the unique constraint first
        // We use hasColumn in case the previous run partially succeeded 
        // by adding the column but failing on the index.
        if (!Schema::hasColumn('users', 'username')) {
            Schema::table('users', function (Blueprint $table) {
                $table->string('username')->nullable()->after('name');
            });
        }

        // 2. Populate usernames for all existing users using the same logic
        $users = \App\Models\User::all();
        foreach ($users as $user) {
            if (!$user->username) {
                // This will trigger the 'saving' event I added to User.php
                $user->save();
            }
        }

        // 3. Now that everyone has a unique username, add the unique index
        Schema::table('users', function (Blueprint $table) {
            $table->unique('username');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('users', function (Blueprint $table) {
            $table->dropColumn('username');
        });
    }
};
