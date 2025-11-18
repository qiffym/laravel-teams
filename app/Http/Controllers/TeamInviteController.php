<?php

namespace App\Http\Controllers;

use App\Mail\TeamInvitation;
use App\Models\Team;
use App\Models\TeamInvite;
use Illuminate\Http\Request;
use Illuminate\Support\Str;
use App\Rules\NotSelfEmail;
use App\TeamRoleEnum;
use Illuminate\Support\Facades\Gate;
use Illuminate\Support\Facades\Mail;
use Illuminate\Validation\Rule;

class TeamInviteController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index()
    {
        //
    }

    /**
     * Show the form for creating a new resource.
     */
    public function create()
    {
        //
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(Request $request, Team $team)
    {
        Gate::authorize('invite users to team');

        $validatedEmail = $request->validate(
            [
                'email' => [
                    'required',
                    'email',
                    'exists:users,email',
                    Rule::unique(TeamInvite::class, 'email')->where('team_id', $team->id),
                    new NotSelfEmail($request->user()?->email),
                ],
            ],
            [
                'email.exists' => 'This email does not belong to any user.',
                'email.unique' => 'This user has already been invited to the team.',
            ]
        );

        $invite = $team->invites()->create([
            ...$validatedEmail,
            'token' => Str::uuid(),
        ]);

        Mail::to($request->email)->send(new TeamInvitation($invite));

        flash('Your invitation has been sent!');

        return back();
    }

    public function accept(Request $request, string $token)
    {
        $invite = TeamInvite::where('token', $token)->firstOrFail();

        $team = $invite->team;
        $user = $request->user();

        // Check if the user is already a member of the team
        if ($team->members->contains($user)) {
            flash('You are already a member of this team.');

            return to_route('teams.show', $team);
        }

        $user->teams()->attach($team);

        setPermissionsTeamId($team->id);

        $user->assignRole(TeamRoleEnum::MEMBER->value);

        $user->currentTeam()->associate($team)->save();

        $invite->delete();

        flash('You have joined the team "' . $team->name . '"!');

        return to_route('teams.show', $team);
    }

    /**
     * Display the specified resource.
     */
    public function show(TeamInvite $teamInvite)
    {
        //
    }

    /**
     * Show the form for editing the specified resource.
     */
    public function edit(TeamInvite $teamInvite)
    {
        //
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(Request $request, TeamInvite $teamInvite)
    {
        //
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(Team $team, TeamInvite $teamInvite)
    {
        Gate::authorize('invite users to team');

        $teamInvite->delete();

        flash('You have canceled the invitation.');

        return back();
    }
}
