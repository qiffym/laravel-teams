<?php

namespace App\Http\Middleware;

use Closure;
use Illuminate\Http\Request;
use Symfony\Component\HttpFoundation\Response;

class TeamsPermission
{
    /**
     * Handle an incoming request.
     */
    public function handle(Request $request, Closure $next): Response
    {
        $user = $request->user();
        if ($user) {
            abort_unless($user->teams->contains($user->currentTeam), Response::HTTP_FORBIDDEN);

            setPermissionsTeamId($user->currentTeam->id);
        }
        return $next($request);
    }
}
