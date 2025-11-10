<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations;

class TeamInvite extends Model
{
    public function team(): Relations\BelongsTo
    {
        return $this->belongsTo(Team::class, 'team_id');
    }
}
