<?php

namespace App\Policies;

use App\Models\Team;
use App\Models\User;
use Illuminate\Auth\Access\Response;

class TeamPolicy
{
    /**
     * Determine whether the user can set the model as current.
     */
    public function setCurrent(User $user, Team $team): bool
    {
        return $user->teams->contains($team);
    }

    /**
     * Determine whether the user can view the model.
     */
    public function view(User $user, Team $team): bool
    {
        return $user->teams->contains($team);
    }

    /**
     * Determine whether the user can create models.
     */
    public function create(User $user): bool
    {
        return false;
    }

    /**
     * Determine whether the user can update the model.
     */
    public function update(User $user, Team $team): bool
    {
        if (!$user->teams->contains($team)) {
            return false;
        }

        return $user->can('update team');
    }

    /**
     * Determine whether the user can leave the model.
     */
    public function leave(User $user, Team $team): bool
    {
        if (!$user->teams->contains($team)) {
            return false;
        }

        if ($team->owner->id === $user->ownedTeam->id) {
            return false;
        }
        return true;
    }
}
