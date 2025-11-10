<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations;

class Team extends Model
{
    public function owner(): Relations\BelongsTo
    {
        return $this->belongsTo(User::class, 'owner_id');
    }

    public function members(): Relations\BelongsToMany
    {
        return $this->belongsToMany(User::class, 'team_user');
    }

    public function invites(): Relations\HasMany
    {
        return $this->hasMany(TeamInvite::class);
    }
}
