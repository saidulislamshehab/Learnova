<?php


use App\Http\Controllers\AuthController;
use App\Http\Controllers\AdminUserController;
use App\Http\Controllers\CourseController;
use App\Http\Controllers\ExpertApplicationController;
use App\Http\Controllers\InstructorApplicationController;
use Illuminate\Support\Facades\Route;

Route::post('/register', [AuthController::class, 'register']);
Route::post('/login', [AuthController::class, 'login']);

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

    Route::get('/courses/my', [CourseController::class, 'indexMyCourses']);
    Route::get('/courses/{id}', [CourseController::class, 'show']);
    Route::post('/courses', [CourseController::class, 'store']);
    Route::put('/courses/{id}', [CourseController::class, 'update']);
    
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
    });
});


Route::get('/health', function () {
    return response()->json([
        'status' => 'success',
        'message' => 'Server is running successfully!',
        'timestamp' => now()->toIso8601String(),
    ]);
});
