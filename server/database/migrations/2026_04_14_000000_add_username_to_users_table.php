<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;
use Illuminate\Support\Facades\DB;

return new class extends Migration
{
    public function up(): void
    {
        // The username column already exists, but may have NULL duplicates
        // causing unique constraint issues. We'll drop and recreate properly.
        if (Schema::hasTable('users')) {
            // Generate usernames for all existing users that don't have one
            $usersWithoutUsername = DB::table('users')
                ->whereNull('username')
                ->get();
            
            foreach ($usersWithoutUsername as $user) {
                $baseUsername = str_replace(' ', '.', strtolower(trim($user->name))) . '.me';
                $username = $baseUsername;
                $counter = 1;
                
                while (DB::table('users')->where('username', $username)->where('id', '!=', $user->id)->exists()) {
                    $username = str_replace('.me', '', $baseUsername) . $counter . '.me';
                    $counter++;
                }
                
                DB::table('users')->where('id', $user->id)->update(['username' => $username]);
            }
        }
    }

    public function down(): void
    {
        // No rollback needed - this is just a data fix
    }
};
