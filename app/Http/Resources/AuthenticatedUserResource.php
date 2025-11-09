<?php

namespace App\Http\Resources;

use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

/** @mixin User */
class AuthenticatedUserResource extends JsonResource
{
    /**
     * Transform the resource into an array.
     *
     * @return array<string, mixed>
     */
    public function toArray(Request $request): array
    {
        return [
            'id' => $this->id,
            'name' => $this->name,
            'email_verified_at' => $this->email_verified_at,
            'email' => $this->email,
            'gravatar' => $this->gravatar,
            'teams' => $this->teams->map(fn ($team) => [
                'id' => $team->id,
                'name' => $team->name,
                'owner_id' => $team->owner_id,
            ]),
            'current_team' => [
                'id' => $this->currentTeam->id,
                'name' => $this->currentTeam->name,
                'owner_id' => $this->currentTeam->owner_id,
            ],
            'permissions' => [
                ...($this->can('update', $this->currentTeam) ? ['update_team'] : []),
                ...($this->can('leave', $this->currentTeam) ? ['leave_team'] : []),
                ...($this->can('delete', $this->currentTeam) ? ['delete_team'] : []),
                ...collect($this->getPermissionsViaRoles()->pluck('name'))->diff(['update team', 'delete team', 'invite users to team', 'remove users from team']),
            ],
        ];
    }
}
