import { Card, CardAction, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import type { Team } from "@/types/team"
import { usePage } from "@inertiajs/react"
import { InviteMember } from "./invite-member"

type PageProps = {
  team: Team
}

export function ListMembers() {
  const { team } = usePage<PageProps>().props
  return (
    <Card>
      <CardHeader>
        <CardTitle>Team Members</CardTitle>
        <CardDescription>List of all members in the team</CardDescription>
        <CardAction>
          <InviteMember team={team} />
        </CardAction>
      </CardHeader>
    </Card>
  )
}
