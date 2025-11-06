<?php

namespace App\Observers;

use App\Models\Team;
use App\Models\User;

class UserObserver
{
    /**
     * Handle the User "created" event.
     */
    public function created(User $user): void
    {
        $user->teams()->attach(
            $team = Team::query()->create([
                'owner_id' => $user->id,
                'name' => strtok($user->name, " ") . "'s Team",
            ])
        );

        $user->currentTeam()->associate($team)->save();

        setPermissionsTeamId($team->id);
        $user->assignRole('team admin');
    }

    /**
     * Handle the User "updated" event.
     */
    public function updated(User $user): void
    {
        //
    }

    /**
     * Handle the User "deleted" event.
     */
    public function deleted(User $user): void
    {
        //
    }

    /**
     * Handle the User "restored" event.
     */
    public function restored(User $user): void
    {
        //
    }

    /**
     * Handle the User "force deleted" event.
     */
    public function forceDeleted(User $user): void
    {
        //
    }
}
