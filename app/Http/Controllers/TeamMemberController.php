<?php

namespace App\Http\Controllers;

use App\Models\Team;
use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Gate;

class TeamMemberController extends Controller
{
    public function destroy(Request $request, Team $team, User $user)
    {
        Gate::authorize('remove users from team');

        if($request->user()->is($user)) {
            flash("You cannot remove yourself from the team via this action. Please use the 'Leave Team' option instead.");
            return back();
        }

        $team->members()->detach($user);
        
        $user->currentTeam()->associate($user->latestOwnedTeam)->save();

        $user->roles()->detach();

        flash("You have removed $user->name from the team.");

        return back();
    }
}
