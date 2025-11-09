import Layout from "@/layouts/app-layout"
import { Head } from "@inertiajs/react"
import { Header } from "@/components/header"
import type { Team } from "@/types/team"
import { Container } from "@/components/ui/container"
import { UpdateTeam } from "@/pages/teams/partials/update-team"
import {LeaveTeam} from "@/pages/teams/partials/leave-team";

interface Props {
  team: Team;
  can_update_team: boolean;
  can_leave_team: boolean;
}

export default function Show({ team, can_update_team, can_leave_team }: Props) {
  return (
    <>
      <Head title={team.name} />
      <Header title={team.name} />
      <Container>
        <div className="flex flex-col gap-y-6">
          {can_update_team && <UpdateTeam team={team} /> }
          {can_leave_team && <LeaveTeam team={team} />}
        </div>
      </Container>
    </>
  )
}

Show.layout = (page: any) => <Layout children={page} />
