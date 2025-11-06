import Layout from "@/layouts/app-layout"
import { Head } from "@inertiajs/react"
import { Header } from "@/components/header"
import type { Team } from "@/types/team"
import { Container } from "@/components/ui/container"
import { UpdateTeam } from "@/pages/teams/partials/update-team"

export default function Show({ team }: { team: Team }) {
  return (
    <>
      <Head title={team.name} />
      <Header title={team.name} />
      <Container>
        <div className="flex flex-col gap-y-6">
          <UpdateTeam />
        </div>
      </Container>
    </>
  )
}

Show.layout = (page: any) => <Layout children={page} />
