<?php

namespace App\Http\Resources;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class TeamMemberResource extends JsonResource
{
    protected $team;

    /**
     * Create a new resource instance.
     *
     * @param  mixed  $resource
     * @param  \App\Models\Team|null  $team
     * @return void
     */
    public function __construct($resource, $team = null)
    {
        parent::__construct($resource);
        $this->team = $team;
    }

    public function toArray(Request $request): array
    {
        $status = match (true) {
            $this->team && $this->resource instanceof \App\Models\User && $this->team->owner_id === $this->id => 'owner',
            $this->resource instanceof \App\Models\User => 'member',
            $this->resource instanceof \App\Models\TeamInvite => 'pending',
            default => 'pending'
        };

        return [
            'id' => $this->id,
            'name' => $this->name ?? $this->email,
            'email' => $this->email,
            'status' => $status,
        ];
    }
}
