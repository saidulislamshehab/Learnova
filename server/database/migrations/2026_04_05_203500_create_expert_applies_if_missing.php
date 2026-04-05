<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Schema;

return new class extends Migration {
    public function up(): void
    {
        if (!Schema::hasTable('expert_applies')) {
            Schema::create('expert_applies', function (Blueprint $table) {
                $table->id('Ex_Ap_ID');
                $table->unsignedBigInteger('UserID');
                $table->string('Expertise')->nullable();
                $table->text('About')->nullable();
                $table->string('Status', 20)->default('pending');
                $table->timestamps();

                $table->foreign('UserID')->references('id')->on('users');
            });
        }

        // Backfill any existing records from expert_applications if that table exists
        if (Schema::hasTable('expert_applications') && Schema::hasTable('expert_applies')) {
            $alreadyBackfilled = DB::table('expert_applies')->count() > 0;

            if (!$alreadyBackfilled) {
                $rows = DB::table('expert_applications')
                    ->select(['user_id', 'status', 'created_at', 'updated_at'])
                    ->orderBy('id')
                    ->get();

                foreach ($rows as $row) {
                    DB::table('expert_applies')->insert([
                        'UserID' => $row->user_id,
                        'Expertise' => null,
                        'About' => null,
                        'Status' => strtolower((string) $row->status),
                        'created_at' => $row->created_at,
                        'updated_at' => $row->updated_at,
                    ]);
                }
            }
        }
    }

    public function down(): void
    {
        // Do not drop table automatically in down to avoid data loss in production rollback.
    }
};
