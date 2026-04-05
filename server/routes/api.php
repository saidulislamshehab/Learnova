<?php


use App\Models\User;
use App\Http\Controllers\AuthController;
use App\Http\Controllers\ExpertApplicationController;
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
    
    Route::middleware('role:admin')->group(function () {
        Route::get('/users', function () {
            return User::all();
        });

        Route::get('/admin/expert-applications', [ExpertApplicationController::class, 'index']);
        Route::put('/admin/expert-applications/{id}', [ExpertApplicationController::class, 'updateStatus']);
    });
});


Route::get('/health', function () {
    return response()->json([
        'status' => 'success',
        'message' => 'Server is running successfully!',
        'timestamp' => now()->toIso8601String(),
    ]);
});
