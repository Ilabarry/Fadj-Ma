<?php

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;
use Illuminate\Support\Facades\Storage;
use App\Http\Controllers\AuthController;
use App\Http\Controllers\PasswordResetController;
use App\Http\Controllers\Api\MedicamentController;
use App\Http\Controllers\Api\DashboardController;

Route::post('/register', [AuthController::class, 'register']);
Route::post('/login', [AuthController::class, 'login']);

Route::post('/reset-password-direct', [PasswordResetController::class, 'resetDirect']);

// Route pour servir les images
Route::get('/storage/{path}', function ($path) {
    $filePath = storage_path('app/public/' . $path);
    
    if (!file_exists($filePath)) {
        abort(404);
    }

    $file = file_get_contents($filePath);
    $type = mime_content_type($filePath);

    return response($file, 200)->header('Content-Type', $type);
})->where('path', '.*');

Route::get('/media/{filename}', function ($filename) {
    $path = 'medicaments/' . $filename;
    
    if (!Storage::disk('public')->exists($path)) {
        abort(404, "File not found: " . $path);
    }
    
    $file = Storage::disk('public')->get($path);
    $type = Storage::disk('public')->mimeType($path);
    
    return response($file, 200)
        ->header('Content-Type', $type)
        ->header('Access-Control-Allow-Origin', '*');
});

Route::middleware('auth:sanctum')->group(function () {
    Route::get('/user', [AuthController::class, 'user']);
    Route::post('/logout', [AuthController::class, 'logout']);
    Route::apiResource('medicaments', MedicamentController::class);
    Route::get('/dashboard-stats', [DashboardController::class, 'stats']);
});


