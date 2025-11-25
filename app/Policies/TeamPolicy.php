<?php

namespace App\Policies;

use App\Models\Team;
use App\Models\User;
use App\TeamPermissionEnum;
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

        return $user->can(TeamPermissionEnum::UPDATE_TEAM);
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

    /**
     * Determine whether the user can delete the model.
     */
    public function delete(User $user, Team $team): bool
    {
        if (!$user->teams->contains($team)) {
            return false;
        }
        if ($user->ownedTeams->count() === 1) {
            return false;
        }
        return $user->can(TeamPermissionEnum::DELETE_TEAM);
    }
}
