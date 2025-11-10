<?php

namespace App\Http\Controllers;

use App\Models\Team;
use App\Models\TeamInvite;
use Illuminate\Http\Request;
use Illuminate\Support\Str;
use App\Rules\NotSelfEmail;
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
        $validatedEmail = $request->validate([
            'email' => [
            'required',
            'email',
            'exists:users,email',
            Rule::unique(TeamInvite::class, 'email')->where('team_id', $team->id),
            new NotSelfEmail($request->user()?->email),
            ],
        ], [
            'email.exists' => 'This email does not belong to any user.',
            'email.unique' => 'This user has already been invited to the team.',
        ]);

        $team->invites()->create([
            ...$validatedEmail,
            'token' => Str::uuid(),
        ]);

        flash('Your invitation has been sent!');

        return back();
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
    public function destroy(TeamInvite $teamInvite)
    {
        //
    }
}
