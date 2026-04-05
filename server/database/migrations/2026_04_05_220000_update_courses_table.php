<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration {
    public function up(): void
    {
        if (!Schema::hasTable('courses')) {
            return;
        }

        Schema::table('courses', function (Blueprint $table) {
            if (!Schema::hasColumn('courses', 'category_id')) {
                $table->unsignedBigInteger('category_id')->nullable()->after('Title');
            }

            if (!Schema::hasColumn('courses', 'short_description')) {
                $table->text('short_description')->nullable()->after('category_id');
            }

            if (!Schema::hasColumn('courses', 'overview')) {
                $table->longText('overview')->nullable()->after('short_description');
            }

            if (!Schema::hasColumn('courses', 'duration')) {
                $table->float('duration')->nullable()->after('overview');
            }

            if (!Schema::hasColumn('courses', 'price')) {
                $table->decimal('price', 10, 2)->nullable()->after('duration');
            }

            if (!Schema::hasColumn('courses', 'thumbnail')) {
                $table->string('thumbnail')->nullable()->after('price');
            }

            if (!Schema::hasColumn('courses', 'status')) {
                $table->enum('status', ['draft', 'published'])->default('draft')->after('thumbnail');
            }
        });
    }

    public function down(): void
    {
        if (!Schema::hasTable('courses')) {
            return;
        }

        Schema::table('courses', function (Blueprint $table) {
            $dropColumns = [];

            foreach (['status', 'thumbnail', 'price', 'duration', 'overview', 'short_description', 'category_id'] as $column) {
                if (Schema::hasColumn('courses', $column)) {
                    $dropColumns[] = $column;
                }
            }

            if (!empty($dropColumns)) {
                $table->dropColumn($dropColumns);
            }
        });
    }
};
