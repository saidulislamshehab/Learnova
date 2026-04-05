<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Schema;

return new class extends Migration {
    public function up(): void
    {
        if (!Schema::hasTable('courses')) {
            return;
        }

        $driver = Schema::getConnection()->getDriverName();

        if ($driver === 'mysql' || $driver === 'mariadb') {
            DB::statement("ALTER TABLE courses MODIFY status VARCHAR(20) NOT NULL DEFAULT 'draft'");
            if (Schema::hasColumn('courses', 'Status')) {
                DB::statement("ALTER TABLE courses MODIFY Status VARCHAR(20) NOT NULL DEFAULT 'draft'");
            }
            return;
        }

        if ($driver === 'sqlsrv') {
            DB::statement('ALTER TABLE courses ALTER COLUMN status NVARCHAR(20) NOT NULL');
            if (Schema::hasColumn('courses', 'Status')) {
                DB::statement('ALTER TABLE courses ALTER COLUMN Status NVARCHAR(20) NOT NULL');
            }
            return;
        }

        if (Schema::hasColumn('courses', 'status')) {
            Schema::table('courses', function (Blueprint $table) {
                $table->string('status', 20)->default('draft')->change();
            });
        }

        if (Schema::hasColumn('courses', 'Status')) {
            Schema::table('courses', function (Blueprint $table) {
                $table->string('Status', 20)->default('draft')->change();
            });
        }
    }

    public function down(): void
    {
        if (!Schema::hasTable('courses')) {
            return;
        }

        $driver = Schema::getConnection()->getDriverName();

        if ($driver === 'mysql' || $driver === 'mariadb') {
            DB::statement("ALTER TABLE courses MODIFY status ENUM('draft', 'published') NOT NULL DEFAULT 'draft'");
            if (Schema::hasColumn('courses', 'Status')) {
                DB::statement("ALTER TABLE courses MODIFY Status ENUM('draft', 'published') NOT NULL DEFAULT 'draft'");
            }
            return;
        }

        if ($driver === 'sqlsrv') {
            DB::statement('ALTER TABLE courses ALTER COLUMN status NVARCHAR(20) NOT NULL');
            if (Schema::hasColumn('courses', 'Status')) {
                DB::statement('ALTER TABLE courses ALTER COLUMN Status NVARCHAR(20) NOT NULL');
            }
            return;
        }

        if (Schema::hasColumn('courses', 'status')) {
            Schema::table('courses', function (Blueprint $table) {
                $table->string('status', 20)->default('draft')->change();
            });
        }

        if (Schema::hasColumn('courses', 'Status')) {
            Schema::table('courses', function (Blueprint $table) {
                $table->string('Status', 20)->default('draft')->change();
            });
        }
    }
};
