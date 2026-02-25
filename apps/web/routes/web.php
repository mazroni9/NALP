<?php

use App\Http\Controllers\Admin\DataRoomUploadController;
use App\Http\Controllers\ContactController;
use App\Http\Controllers\DesignStudioController;
use App\Http\Controllers\PortalController;
use App\Http\Controllers\ProfileController;
use Illuminate\Foundation\Application;
use Illuminate\Support\Facades\Route;
use Inertia\Inertia;

Route::get('/', function () {
    return Inertia::render('Public/Home', [
        'keyNumbers' => [],
    ]);
})->name('home');

Route::get('/asset/zones', fn () => Inertia::render('Public/AssetZonesOverview'))->name('zones');
Route::get('/asset/zone-a', fn () => Inertia::render('Public/ZoneAWorkforceHousing'))->name('zone-a');
Route::get('/asset/zone-b', fn () => Inertia::render('Public/ZoneBAutoServices'))->name('zone-b');
Route::get('/financials', fn () => Inertia::render('Public/Financials'))->name('financials');
Route::get('/location', fn () => Inertia::render('Public/Location'))->name('location');

Route::get('/contact', [ContactController::class, 'index'])->name('contact');
Route::post('/contact', [ContactController::class, 'submit'])->name('contact.submit');

Route::get('/dashboard', fn () => Inertia::render('Dashboard'))->middleware(['auth', 'verified'])->name('dashboard');

Route::middleware('auth')->group(function () {
    Route::get('/profile', [ProfileController::class, 'edit'])->name('profile.edit');
    Route::patch('/profile', [ProfileController::class, 'update'])->name('profile.update');
    Route::delete('/profile', [ProfileController::class, 'destroy'])->name('profile.destroy');

    Route::prefix('portal')->name('portal.')->group(function () {
        Route::redirect('/', '/portal/dashboard', 302);
        Route::get('/dashboard', [PortalController::class, 'dashboard'])->name('dashboard');
        Route::get('/data-room', [PortalController::class, 'dataRoom'])->name('data-room');
        Route::get('/scenarios', [PortalController::class, 'scenarios'])->name('scenarios');
        Route::get('/scenarios/compare', [PortalController::class, 'compareScenarios'])->name('scenarios.compare');
        Route::post('/scenarios', [PortalController::class, 'storeScenario'])->name('scenarios.store');
    });

    Route::get('/studio', [DesignStudioController::class, 'index'])->name('studio');

    Route::middleware('admin')->prefix('admin')->name('admin.')->group(function () {
        Route::get('/data-room', [DataRoomUploadController::class, 'index'])->name('data-room');
        Route::post('/data-room/upload', [DataRoomUploadController::class, 'upload'])->name('data-room.upload');
    });
});

require __DIR__.'/auth.php';
