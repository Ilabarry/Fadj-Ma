<?php

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;
use Illuminate\Support\Facades\Storage;
use App\Http\Controllers\AuthController;
use App\Http\Controllers\PasswordResetController;
use App\Http\Controllers\Api\MedicamentController;
use App\Http\Controllers\Api\DashboardController;

// Auth
Route::post('/register', [AuthController::class, 'register']);
Route::post('/login', [AuthController::class, 'login']);
Route::post('/reset-password-direct', [PasswordResetController::class, 'resetDirect']);

// Route pour servir les images (n’importe quel chemin sous storage/app/public)
Route::get('/media/{path}', function ($path) {
    // Vérifie si le fichier existe
    if (!Storage::disk('public')->exists($path)) {
        abort(404, "File not found: " . $path);
    }

    // Récupère le contenu et le type MIME
    $file = Storage::disk('public')->get($path);
    $type = Storage::disk('public')->mimeType($path);

    // Retourne la réponse avec CORS autorisé
    return response($file, 200)
        ->header('Content-Type', $type)
        ->header('Access-Control-Allow-Origin', '*');
})->where('path', '.*');

// Routes protégées
Route::middleware('auth:sanctum')->group(function () {
    Route::get('/user', [AuthController::class, 'user']);
    Route::post('/logout', [AuthController::class, 'logout']);
    Route::apiResource('medicaments', MedicamentController::class);
    Route::get('/dashboard-stats', [DashboardController::class, 'stats']);
});
