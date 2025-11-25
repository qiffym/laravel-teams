<?php

use App\Http\Controllers;
use Illuminate\Support\Facades\Route;

Route::middleware('auth')->group(function () {
   Route::patch('teams/{team}/set-current', [Controllers\TeamController::class, 'setCurrent'])
      ->name('teams.set-current');

   Route::get('teams/{team}', [Controllers\TeamController::class, 'show'])
      ->name('teams.show');

   Route::put('teams/{team}', [Controllers\TeamController::class, 'update'])
      ->name('teams.update');

   Route::delete('teams/{team}/leave', [Controllers\TeamController::class, 'leave'])
      ->name('teams.leave');

   Route::delete('teams/{team}', [Controllers\TeamController::class, 'destroy'])
      ->name('teams.destroy');

   Route::post('teams/{team}/invites', [Controllers\TeamInviteController::class, 'store'])
      ->name('team-invites.store');

   Route::post('teams/{team}/invites/{teamInvite}/resend', [Controllers\TeamInviteController::class, 'resend'])
      ->name('team-invites.resend');

   Route::delete('teams/{team}/invites/{teamInvite}', [Controllers\TeamInviteController::class, 'destroy'])
      ->name('team-invites.destroy');

   Route::get('teams/invites/{token}/accept', [Controllers\TeamInviteController::class, 'accept'])
      ->name('team-invites.accept')
      ->middleware('signed');

   Route::delete('teams/{team}/member/{user}', [Controllers\TeamMemberController::class, 'destroy'])
      ->name('team-members.destroy');
});
