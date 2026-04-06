<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration {
    public function up(): void
    {
        Schema::table('tutorials', function (Blueprint $table) {
            $table->boolean('Is_Homepage_Featured')->default(false)->after('Status');
            $table->unsignedTinyInteger('Homepage_Featured_Order')->nullable()->after('Is_Homepage_Featured');
        });
    }

    public function down(): void
    {
        Schema::table('tutorials', function (Blueprint $table) {
            $table->dropColumn(['Is_Homepage_Featured', 'Homepage_Featured_Order']);
        });
    }
};
