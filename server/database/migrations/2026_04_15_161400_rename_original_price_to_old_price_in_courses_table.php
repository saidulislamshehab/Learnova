<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration {
    public function up(): void
    {
        if (Schema::hasColumn('courses', 'Original_Price')) {
            Schema::table('courses', function (Blueprint $table) {
                $table->renameColumn('Original_Price', 'Old_Price');
            });
        }
    }

    public function down(): void
    {
        if (Schema::hasColumn('courses', 'Old_Price')) {
            Schema::table('courses', function (Blueprint $table) {
                $table->renameColumn('Old_Price', 'Original_Price');
            });
        }
    }
};
