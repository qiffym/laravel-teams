<?php

namespace App\Http\Controllers;

use App\Models\Team;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Gate;

class TeamController extends Controller
{
    public function setCurrent(Request $request, Team $team)
    {
        Gate::authorize('set-current', $team);

        $user = $request->user();
        $user->currentTeam()->associate($team)->save();

        $anotherTeam = $user->fresh()->currentTeam;

        return to_route('teams.show', $anotherTeam);
    }

    public function show(Request $request, Team $team)
    {
        Gate::authorize('view', $team);
        return inertia('teams/show', [
            'team' => fn () => $team,
            'can_update_team' => fn () => $request->user()->can('update', $team),
            'can_leave_team' => fn () => $request->user()->can('leave', $team),
        ]);
    }

    public function update(Request $request, Team $team)
    {
        Gate::authorize('update', $team);

        $team->update($request->only('name'));

        flash('Team updated successfully.');

        return back();
    }

    public function leave(Request $request, Team $team)
    {
        Gate::authorize('leave', $team);

        $user = $request->user();

        $user->teams()->detach($team);
        if ($user->currentTeam->is($team)) {
            $user->currentTeam()->associate($user->ownedTeam)->save();
        }

        flash('You have left the team.');

        return to_route('teams.show', $user->currentTeam);
    }
}
