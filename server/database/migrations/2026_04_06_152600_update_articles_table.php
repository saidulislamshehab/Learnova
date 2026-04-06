<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration {
    public function up(): void
    {
        Schema::table('articles', function (Blueprint $table) {
            if (!Schema::hasColumn('articles', 'Status')) {
                $table->string('Status', 20)->default('draft')->after('Reaction');
            }
            if (!Schema::hasColumn('articles', 'Tags')) {
                $table->string('Tags')->nullable()->after('Content');
            }
        });
    }

    public function down(): void
    {
        Schema::table('articles', function (Blueprint $table) {
            $table->dropColumn(['Status', 'Tags']);
        });
    }
};
