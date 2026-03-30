<?php


use App\Models\User;
use App\Http\Controllers\AuthController;

Route::post('/register', [AuthController::class, 'register']);
Route::post('/login', [AuthController::class, 'login']);

Route::middleware('auth:api')->group(function () {
    Route::post('/logout', [AuthController::class, 'logout']);
    Route::post('/refresh', [AuthController::class, 'refresh']);
    Route::get('/me', [AuthController::class, 'me']);
    Route::put('/profile', [AuthController::class, 'updateProfile']);
    Route::post('/profile/picture', [AuthController::class, 'updateProfilePicture']);
    
    Route::middleware('role:admin')->group(function () {
        Route::get('/users', function () {
            return User::all();
        });
    });
});


Route::get('/health', function () {
    return response()->json([
        'status' => 'success',
        'message' => 'Server is running successfully!',
        'timestamp' => now()->toIso8601String(),
    ]);
});
