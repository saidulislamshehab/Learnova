<?php


use App\Models\User;
use App\Http\Controllers\AuthController;

Route::post('/register', [AuthController::class, 'register']);
Route::post('/login', [AuthController::class, 'login']);

Route::get('/users', function () {
    return User::all();
});


Route::get('/health', function () {
    return response()->json([
        'status' => 'success',
        'message' => 'Server is running successfully!',
        'timestamp' => now()->toIso8601String(),
    ]);
});
