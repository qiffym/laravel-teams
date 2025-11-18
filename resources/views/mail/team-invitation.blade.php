<x-mail::message>
# Team Invitation

You have been invited to join the team "{{ $teamInvite->team->name }}".

<x-mail::button :url="$url">
Join Team
</x-mail::button>

Thanks,<br>
{{ config('app.name') }}
</x-mail::message>
