<?php

use App\Http\Controllers\Api\DataRoomController;
use App\Http\Controllers\Api\StudioController;
use Illuminate\Support\Facades\Route;

Route::middleware('auth:sanctum')->group(function () {
    Route::prefix('studio')->group(function () {
        Route::post('generate', [StudioController::class, 'generate']);
        Route::get('runs', [StudioController::class, 'runs']);
        Route::get('runs/{run}', [StudioController::class, 'show']);
    });

    Route::prefix('data-room')->group(function () {
        Route::get('documents', [DataRoomController::class, 'index']);
        Route::get('documents/{document}/download', [DataRoomController::class, 'download']);
    });
});
