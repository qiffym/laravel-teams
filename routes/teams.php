<?php

use App\Http\Controllers;
use Illuminate\Support\Facades\Route;

Route::middleware('auth')->group(function () {
   Route::patch('teams/{team}/set-current', [Controllers\TeamController::class, 'setCurrent'])->name('teams.set-current');
   Route::get('teams/{team}', [Controllers\TeamController::class, 'show'])->name('teams.show');
   Route::put('teams/{team}', [Controllers\TeamController::class, 'update'])->name('teams.update');
   Route::delete('teams/{team}/leave', [Controllers\TeamController::class, 'leave'])->name('teams.leave');
});
