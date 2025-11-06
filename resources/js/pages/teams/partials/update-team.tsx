import type React from "react"
import { useForm, usePage } from "@inertiajs/react"
import type { Team } from "@/types/team"
import { Card, CardContent, CardHeader } from "@/components/ui/card"
import { TextField } from "@/components/ui/text-field"
import { FieldError, Label } from "@/components/ui/field"
import { Input } from "@/components/ui/input"
import { Form } from "react-aria-components"
import { Button } from "@/components/ui/button"

type UpdateTeamProps = {
  team: Team;
  can_update_team: boolean;
}

export function UpdateTeam() {
  const { team, can_update_team } = usePage<UpdateTeamProps>().props
  const { data, setData, put, processing, errors } = useForm({
    name: team.name,
  })

  function submit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault()

    put(route("teams.update", [team]))
  }

  return (
    <Card>
      <CardHeader title="Update Team" description="Update the details of your team." />
      <CardContent>
        <Form onSubmit={submit} validationErrors={errors} className="max-w-lg">
          <TextField
            name="name"
            value={data.name}
            onChange={(value) => setData("name", value)}
            isRequired
            isReadOnly={!can_update_team}
          >
            <Label>Team Name</Label>
            <Input />
            <FieldError />
          </TextField>

          <Button type="submit" isPending={processing} isDisabled={!can_update_team} className="mt-4">
            {processing ? "Updating..." : "Update Team"}
          </Button>
        </Form>
      </CardContent>
    </Card>
  )
}
