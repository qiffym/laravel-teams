import Layout from "@/layouts/app-layout"
import { Head } from "@inertiajs/react"
import { Header } from "@/components/header"
import type { Team } from "@/types/team"
import { Container } from "@/components/ui/container"
import { UpdateTeam } from "@/pages/teams/partials/update-team"
import { LeaveTeam } from "@/pages/teams/partials/leave-team"
import { DeleteTeam } from "@/pages/teams/partials/delete-team"
import type { Auth } from "@/types/auth"
import { usePermissions } from "@/hooks/use-permissions"
import { ListMembers } from "./partials/list-members"

interface Props {
  team: Team
  auth: Auth
}

export default function Show({ team, auth }: Props) {
  const can = usePermissions(auth?.user?.permissions!)
  return (
    <>
      <Head title={team.name} />
      <Header title={team.name} />
      <Container>
        <div className="flex flex-col gap-y-6">
          {can("update_team") && <UpdateTeam team={team} />}
          {can("leave_team") && <LeaveTeam team={team} />}
          {can("delete_team") && <DeleteTeam team={team} />}
          {can("delete_team") && <DeleteTeam team={team} />}

          <ListMembers />
        </div>
      </Container>
    </>
  )
}

Show.layout = (page: any) => <Layout children={page} />
