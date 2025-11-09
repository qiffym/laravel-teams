
import type { Team } from "@/types/team"
import { Card, CardFooter, CardHeader } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { useForm } from "@inertiajs/react"

interface Props {
  team: Team
}

export function LeaveTeam({ team }: Props) {
  const { delete: destroy, processing } = useForm()
  function leave() {
    destroy(route("teams.leave", [team]))
  }
  return (
    <Card>
      <CardHeader title="Leave Team" description="You're about to leave team, this action can not be undone"/>
      <CardFooter>
        <Button intent="danger" onPress={leave} isPending={processing}>
          {processing ? "Leaving..." : "Leave Team"}
        </Button>
      </CardFooter>
    </Card>
  )
}
