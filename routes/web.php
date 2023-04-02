<?php

use Inertia\Inertia;
use Illuminate\Support\Facades\Route;

use App\Http\Controllers\UserController;
use App\Http\Controllers\AssetController;
use App\Http\Controllers\NotesController;
use App\Http\Controllers\OmzetController;
use App\Http\Controllers\ProfitController;
use App\Http\Controllers\ReportController;
use App\Http\Controllers\ProductsController;
use App\Http\Controllers\DashboardController;
use SebastianBergmann\CodeCoverage\Report\Html\Dashboard;

/*
|--------------------------------------------------------------------------
| Web Routes
|--------------------------------------------------------------------------
|
| Here is where you can register web routes for your application. These
| routes are loaded by the RouteServiceProvider within a group which
| contains the "web" middleware group. Now create something great!
|
*/

// Dashboard Route
Route::middleware(['auth'])->group(function () {
    Route::get('/dashboard', [DashboardController::class, 'index'])->name('dashboard.index');
});

// User Route
Route::middleware(['auth', 'role:owner'])->group(function () {
    Route::get('/user', [UserController::class, 'index'])->name('user.dashboard');
    Route::get('/user/create', [UserController::class, 'create'])->name('user.create');
    Route::post('/user/store', [UserController::class, 'store'])->name('user.store');
    Route::get('/user/{id}', [UserController::class, 'show'])->name('user.edit');
    Route::put('/user/{id}/update', [UserController::class, 'update'])->name('user.update');
    Route::delete('/user/{id}/delete', [UserController::class, 'delete'])->name('user.delete');
});

// Product Route
Route::middleware('auth')->group(function () {
    Route::get('/product', [ProductsController::class, 'index'])->name('product.dashboard');
    Route::get('/product/create', [ProductsController::class, 'create'])->name('product.create');
    Route::post('/product/store', [ProductsController::class, 'store'])->name('product.store');
    Route::get('/product/{id}', [ProductsController::class, 'show'])->name('product.edit');
    Route::put('/product/{id}/update', [ProductsController::class, 'update'])->name('product.update');
    Route::delete('/product/{id}/delete', [ProductsController::class, 'delete'])->name('product.delete');
});

// Sales Note and Transaction Route
Route::middleware('auth')->group(function () {
    Route::get('/sales-note', function () {
        return redirect('/sales-note/transaction');
    });
    Route::get('/sales-note/transaction', [NotesController::class, 'index'])->name('note.dashboard');
    Route::get('/sales-note/daily-report', [ReportController::class, 'index'])->name('report.dashboard');
    Route::post('/note/store', [NotesController::class, 'store'])->name('note.store');
    Route::put('/note/{id}/update', [NotesController::class, 'update_purchase_amount'])->name('note.update');
    Route::put('/note/{id}/saved', [NotesController::class, 'saved'])->name('note.saved');
    Route::put('/note/finish', [NotesController::class, 'finished'])->name('note.finished');
    Route::delete('/note/{id}/delete', [NotesController::class, 'delete'])->name('note.delete');
    Route::post('/transaction/store', [TransactionsController::class, 'store'])->name('transaction.store');
});

// Report Route
Route::middleware(['auth', 'role:owner'])->group(function () {
    Route::delete('/sales-note/daily-report/{id}', [ReportController::class, 'delete'])->name('report.delete');
    Route::get('/sales-note/report-period', [ReportController::class, 'period'])->name('report.period.dashboard');
    Route::get('/sales-note/report-period/week', [ReportController::class, 'week_period'])->name('report.period.week');
    Route::get('/sales-note/report-period/month', [ReportController::class, 'month_period'])->name('report.period.month');
    Route::get('/sales-note/report-period/year', [ReportController::class, 'year_period'])->name('report.period.year');
    Route::get('/sales-note/report-period/range', [ReportController::class, 'range_period'])->name('report.period.range');
});

// Modal Route
Route::middleware('auth')->group(function () {
    Route::get('/asset', [AssetController::class, 'index'])->name('asset.dashboard');
    Route::post('/asset/store', [AssetController::class, 'store'])->name('asset.store');
    Route::get('/asset/{id}', [AssetController::class, 'show'])->name('asset.edit');
    Route::put('/asset/{id}/update', [AssetController::class, 'update'])->name('asset.update');
    Route::delete('/asset/{id}', [AssetController::class, 'delete'])->name('asset.delete');
});

// Omzet Route
Route::middleware(['auth', 'role:owner'])->group(function () {
    Route::get('/omzet', [OmzetController::class, 'index'])->name('omzet.dashboard');
    Route::get('/omzet/predict', [OmzetController::class, 'predict'])->name('omzet.predict');
    Route::post('/omzet/store', [OmzetController::class, 'store'])->name('omzet.store');
    Route::get('/omzet/{id}', [OmzetController::class, 'show'])->name('omzet.edit');
    Route::put('/omzet/{id}/update', [OmzetController::class, 'update'])->name('omzet.update');
    Route::delete('/omzet/{id}', [OmzetController::class, 'delete'])->name('omzet.delete');
});

// Profit Route
Route::middleware(['auth', 'role:owner'])->group(function () {
    Route::get('/profit', [ProfitController::class, 'index'])->name('profit.dashboard');
    Route::get('/profit/predict', [ProfitController::class, 'predict'])->name('profit.predict');
    Route::post('/profit/store', [ProfitController::class, 'store'])->name('profit.store');
    Route::get('/profit/{id}', [ProfitController::class, 'show'])->name('profit.edit');
    Route::put('/profit/{id}/update', [ProfitController::class, 'update'])->name('profit.update');
    Route::delete('/profit/{id}', [ProfitController::class, 'delete'])->name('profit.delete');
});

// User Profile Route
// Route::middleware('auth')->group(function () {
//     Route::get('/profile', [ProfileController::class, 'edit'])->name('profile.edit');
//     Route::patch('/profile', [ProfileController::class, 'update'])->name('profile.update');
//     Route::delete('/profile', [ProfileController::class, 'destroy'])->name('profile.destroy');
// });

require __DIR__.'/auth.php';
