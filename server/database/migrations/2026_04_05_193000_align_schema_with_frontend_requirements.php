<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration {
    public function up(): void
    {
        // Users: frontend settings and security toggles
        if (Schema::hasTable('users')) {
            Schema::table('users', function (Blueprint $table) {
                if (!Schema::hasColumn('users', 'two_factor_enabled')) {
                    $table->boolean('two_factor_enabled')->default(false)->after('linkedin_link');
                }
                if (!Schema::hasColumn('users', 'email_notifications')) {
                    $table->boolean('email_notifications')->default(true)->after('two_factor_enabled');
                }
                if (!Schema::hasColumn('users', 'platform_notifications')) {
                    $table->boolean('platform_notifications')->default(true)->after('email_notifications');
                }
            });
        }

        // Articles: listing/detail metadata used by frontend
        if (Schema::hasTable('articles')) {
            Schema::table('articles', function (Blueprint $table) {
                if (!Schema::hasColumn('articles', 'Excerpt')) {
                    $table->text('Excerpt')->nullable()->after('Content');
                }
                if (!Schema::hasColumn('articles', 'Category')) {
                    $table->string('Category')->nullable()->after('Excerpt');
                }
                if (!Schema::hasColumn('articles', 'Read_Time')) {
                    $table->string('Read_Time', 30)->nullable()->after('Category');
                }
                if (!Schema::hasColumn('articles', 'Views')) {
                    $table->unsignedInteger('Views')->default(0)->after('Reaction');
                }
            });
        }

        // Courses: details/stats/instructor metadata used by frontend pages
        if (Schema::hasTable('courses')) {
            Schema::table('courses', function (Blueprint $table) {
                if (!Schema::hasColumn('courses', 'Course_Code')) {
                    $table->string('Course_Code', 50)->nullable()->after('CourseID');
                }
                if (!Schema::hasColumn('courses', 'Original_Price')) {
                    $table->decimal('Original_Price', 8, 2)->nullable()->after('Price');
                }
                if (!Schema::hasColumn('courses', 'Rating')) {
                    $table->decimal('Rating', 3, 2)->default(0.00)->after('Original_Price');
                }
                if (!Schema::hasColumn('courses', 'Total_Ratings')) {
                    $table->unsignedInteger('Total_Ratings')->default(0)->after('Rating');
                }
                if (!Schema::hasColumn('courses', 'Students_Count')) {
                    $table->unsignedInteger('Students_Count')->default(0)->after('Total_Ratings');
                }
                if (!Schema::hasColumn('courses', 'Instructor_Name')) {
                    $table->string('Instructor_Name')->nullable()->after('Students_Count');
                }
                if (!Schema::hasColumn('courses', 'Instructor_Title')) {
                    $table->string('Instructor_Title')->nullable()->after('Instructor_Name');
                }
                if (!Schema::hasColumn('courses', 'Instructor_Bio')) {
                    $table->text('Instructor_Bio')->nullable()->after('Instructor_Title');
                }
                if (!Schema::hasColumn('courses', 'Instructor_Image')) {
                    $table->string('Instructor_Image')->nullable()->after('Instructor_Bio');
                }
                if (!Schema::hasColumn('courses', 'Learning_Outcomes')) {
                    $table->json('Learning_Outcomes')->nullable()->after('Instructor_Image');
                }
            });
        }

        // Course lessons: supports module grouping + duration labels from frontend
        if (Schema::hasTable('course_lessons')) {
            Schema::table('course_lessons', function (Blueprint $table) {
                if (!Schema::hasColumn('course_lessons', 'Module_Title')) {
                    $table->string('Module_Title')->nullable()->after('CourseID');
                }
                if (!Schema::hasColumn('course_lessons', 'Duration_Label')) {
                    $table->string('Duration_Label', 20)->nullable()->after('YouTube_URL');
                }
            });
        }

        // Enrollments: progress summary used by My Courses
        if (Schema::hasTable('enrollments')) {
            Schema::table('enrollments', function (Blueprint $table) {
                if (!Schema::hasColumn('enrollments', 'Progress_Percent')) {
                    $table->unsignedTinyInteger('Progress_Percent')->default(0)->after('Amount_Paid');
                }
                if (!Schema::hasColumn('enrollments', 'Completed_Lessons')) {
                    $table->unsignedInteger('Completed_Lessons')->default(0)->after('Progress_Percent');
                }
                if (!Schema::hasColumn('enrollments', 'Last_Accessed_At')) {
                    $table->timestamp('Last_Accessed_At')->nullable()->after('Completed_Lessons');
                }
            });
        }

        // Bookmarks page support
        if (!Schema::hasTable('article_bookmarks')) {
            Schema::create('article_bookmarks', function (Blueprint $table) {
                $table->id('Bookmark_ID');
                $table->unsignedBigInteger('UserID');
                $table->unsignedBigInteger('Article_ID');
                $table->timestamps();

                $table->foreign('UserID')->references('id')->on('users')->onDelete('cascade');
                $table->foreign('Article_ID')->references('Article_ID')->on('articles')->onDelete('cascade');
                $table->unique(['UserID', 'Article_ID']);
            });
        }

        // Lesson-level completion tracking for course content pages
        if (!Schema::hasTable('lesson_progress')) {
            Schema::create('lesson_progress', function (Blueprint $table) {
                $table->id('Progress_ID');
                $table->unsignedBigInteger('UserID');
                $table->unsignedBigInteger('Course_Lesson_ID');
                $table->boolean('Is_Completed')->default(false);
                $table->timestamp('Completed_At')->nullable();
                $table->timestamps();

                $table->foreign('UserID')->references('id')->on('users')->onDelete('cascade');
                $table->foreign('Course_Lesson_ID')->references('id')->on('course_lessons')->onDelete('cascade');
                $table->unique(['UserID', 'Course_Lesson_ID']);
            });
        }
    }

    public function down(): void
    {
        if (Schema::hasTable('lesson_progress')) {
            Schema::dropIfExists('lesson_progress');
        }

        if (Schema::hasTable('article_bookmarks')) {
            Schema::dropIfExists('article_bookmarks');
        }

        if (Schema::hasTable('enrollments')) {
            Schema::table('enrollments', function (Blueprint $table) {
                $dropColumns = [];
                if (Schema::hasColumn('enrollments', 'Last_Accessed_At')) {
                    $dropColumns[] = 'Last_Accessed_At';
                }
                if (Schema::hasColumn('enrollments', 'Completed_Lessons')) {
                    $dropColumns[] = 'Completed_Lessons';
                }
                if (Schema::hasColumn('enrollments', 'Progress_Percent')) {
                    $dropColumns[] = 'Progress_Percent';
                }
                if (!empty($dropColumns)) {
                    $table->dropColumn($dropColumns);
                }
            });
        }

        if (Schema::hasTable('course_lessons')) {
            Schema::table('course_lessons', function (Blueprint $table) {
                $dropColumns = [];
                if (Schema::hasColumn('course_lessons', 'Duration_Label')) {
                    $dropColumns[] = 'Duration_Label';
                }
                if (Schema::hasColumn('course_lessons', 'Module_Title')) {
                    $dropColumns[] = 'Module_Title';
                }
                if (!empty($dropColumns)) {
                    $table->dropColumn($dropColumns);
                }
            });
        }

        if (Schema::hasTable('courses')) {
            Schema::table('courses', function (Blueprint $table) {
                $dropColumns = [];
                foreach ([
                    'Learning_Outcomes',
                    'Instructor_Image',
                    'Instructor_Bio',
                    'Instructor_Title',
                    'Instructor_Name',
                    'Students_Count',
                    'Total_Ratings',
                    'Rating',
                    'Original_Price',
                    'Course_Code',
                ] as $column) {
                    if (Schema::hasColumn('courses', $column)) {
                        $dropColumns[] = $column;
                    }
                }
                if (!empty($dropColumns)) {
                    $table->dropColumn($dropColumns);
                }
            });
        }

        if (Schema::hasTable('articles')) {
            Schema::table('articles', function (Blueprint $table) {
                $dropColumns = [];
                foreach (['Views', 'Read_Time', 'Category', 'Excerpt'] as $column) {
                    if (Schema::hasColumn('articles', $column)) {
                        $dropColumns[] = $column;
                    }
                }
                if (!empty($dropColumns)) {
                    $table->dropColumn($dropColumns);
                }
            });
        }

        if (Schema::hasTable('users')) {
            Schema::table('users', function (Blueprint $table) {
                $dropColumns = [];
                foreach (['platform_notifications', 'email_notifications', 'two_factor_enabled'] as $column) {
                    if (Schema::hasColumn('users', $column)) {
                        $dropColumns[] = $column;
                    }
                }
                if (!empty($dropColumns)) {
                    $table->dropColumn($dropColumns);
                }
            });
        }
    }
};
