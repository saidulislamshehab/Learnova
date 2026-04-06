<?php


use App\Http\Controllers\AuthController;
use App\Http\Controllers\AdminUserController;
use App\Http\Controllers\CourseController;
use App\Http\Controllers\ExpertApplicationController;
use App\Http\Controllers\InstructorApplicationController;
use App\Http\Controllers\ArticleController;
use App\Http\Controllers\ReportController;
use App\Http\Controllers\PublicStatsController;
use Illuminate\Support\Facades\Route;

Route::post('/register', [AuthController::class, 'register']);
Route::post('/login', [AuthController::class, 'login']);
Route::post('/forgot-password', [AuthController::class, 'forgotPassword']);
Route::post('/reset-password', [AuthController::class, 'resetPassword']);
Route::get('/stats/homepage', [PublicStatsController::class, 'homepage']);
Route::get('/courses', [CourseController::class, 'indexPublic']);
Route::get('/courses/top', [CourseController::class, 'topPublished']);
Route::get('/articles', [ArticleController::class, 'index']);
// Constrain {id} so it doesn't capture fixed routes like /articles/my
Route::get('/articles/{id}', [ArticleController::class, 'show'])->whereNumber('id');
Route::get('/articles/{id}/comments', [ArticleController::class, 'comments'])->whereNumber('id');

Route::middleware('auth:api')->group(function () {
    Route::post('/logout', [AuthController::class, 'logout']);
    Route::post('/refresh', [AuthController::class, 'refresh']);
    Route::get('/me', [AuthController::class, 'me']);
    Route::put('/profile', [AuthController::class, 'updateProfile']);
    Route::post('/profile/picture', [AuthController::class, 'updateProfilePicture']);

    Route::post('/expert-applications', [ExpertApplicationController::class, 'store']);
    Route::get('/expert-applications/my-status', [ExpertApplicationController::class, 'myStatus']);
    Route::post('/instructor-applications', [InstructorApplicationController::class, 'store']);
    Route::get('/instructor-applications/my-status', [InstructorApplicationController::class, 'myStatus']);

    // Enrollment & Purchases
    Route::post('/courses/enroll', [\App\Http\Controllers\CourseEnrollmentController::class, 'store']);
    Route::get('/courses/enrolled', [\App\Http\Controllers\CourseEnrollmentController::class, 'myEnrolledCourses']);

    Route::get('/courses/my', [CourseController::class, 'indexMyCourses']);
    Route::post('/courses', [CourseController::class, 'store']);
    Route::put('/courses/{id}', [CourseController::class, 'update']);

    // Articles
    Route::get('/articles/my', [ArticleController::class, 'myArticles']);
    Route::post('/articles', [ArticleController::class, 'store']);
    Route::put('/articles/{id}', [ArticleController::class, 'update']);
    Route::post('/articles/{id}/comments', [ArticleController::class, 'storeComment'])->whereNumber('id');
    Route::post('/articles/{id}/report', [ArticleController::class, 'storeReport'])->whereNumber('id');
    
    Route::middleware('role:admin')->group(function () {
        Route::get('/admin/courses/pending', [CourseController::class, 'indexPending']);
        Route::put('/admin/courses/{id}', [CourseController::class, 'moderate']);
        Route::get('/admin/users', [AdminUserController::class, 'index']);
        Route::post('/admin/users', [AdminUserController::class, 'store']);
        Route::delete('/admin/users/{id}', [AdminUserController::class, 'destroy']);

        Route::get('/admin/expert-applications', [ExpertApplicationController::class, 'index']);
        Route::put('/admin/expert-applications/{id}', [ExpertApplicationController::class, 'updateStatus']);
        Route::get('/admin/instructor-applications', [InstructorApplicationController::class, 'index']);
        Route::put('/admin/instructor-applications/{id}', [InstructorApplicationController::class, 'updateStatus']);

        // Article Moderation
        Route::get('/admin/articles/pending', [ArticleController::class, 'indexPending']);
        Route::put('/admin/articles/{id}', [ArticleController::class, 'moderate']);

        // Article Reports
        Route::get('/admin/reports', [ReportController::class, 'index']);
        Route::put('/admin/reports/{id}', [ReportController::class, 'update']);
    });
});

// Define parameterized routes last to avoid capturing fixed routes like /my
Route::get('/courses/{id}', [CourseController::class, 'show']);

Route::get('/health', function () {
    return response()->json([
        'status' => 'success',
        'message' => 'Server is running successfully!',
        'timestamp' => now()->toIso8601String(),
    ]);
});
