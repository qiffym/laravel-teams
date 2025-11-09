import type { Team } from "@/types/team"
import { Card, CardFooter, CardHeader } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { useForm } from "@inertiajs/react"
import type React from "react"
import { useState } from "react"
import {
  ModalBody,
  ModalContent,
  ModalDescription,
  ModalFooter,
  ModalHeader,
  ModalTitle,
} from "@/components/ui/modal"
import { Form } from "react-aria-components"
import { TextField } from "@/components/ui/text-field"
import { FieldError, Label } from "@/components/ui/field"
import { Input } from "@/components/ui/input"

interface Props {
  team: Team
}

export function DeleteTeam({ team }: Props) {
  const [open, setOpen] = useState(false)
  const {
    data,
    setData,
    delete: destroy,
    processing,
    errors,
  } = useForm({
    password: "",
  })
  function destroyTeam(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault()

    destroy(route("teams.destroy", [team]), {
      onSuccess: () => setOpen(false),
    })
  }
  return (
    <Card>
      <CardHeader
        title="Delete Team"
        description="You're about to delete team, this action can not be undone"
      />
      <CardFooter>
        <Button intent="danger" isPending={processing} onPress={() => setOpen(true)}>
          Delete Team
        </Button>
        <ModalContent role="alertdialog" isOpen={open} onOpenChange={setOpen}>
          <ModalHeader>
            <ModalTitle>Delete Team</ModalTitle>
            <ModalDescription>
              Are you sure you want to delete this team? Once a team is deleted, all of its resources
              and data will be permanently deleted. Please enter your password to confirm you would
              like to permanently delete this team.
            </ModalDescription>
          </ModalHeader>
          <Form onSubmit={destroyTeam} validationErrors={errors}>
            <ModalBody>
              <TextField
                type="password"
                name="password"
                value={data.password}
                onChange={(value) => setData("password", value)}
                isRequired
              >
                <Label>Password</Label>
                <Input />
                <FieldError />
              </TextField>
            </ModalBody>
            <ModalFooter>
              <Button intent="secondary" onPress={() => setOpen(false)}>
                Cancel
              </Button>
              <Button intent="danger" type="submit" isPending={processing}>
                {processing ? "Deleting..." : "Delete Team"}
              </Button>
            </ModalFooter>
          </Form>
        </ModalContent>
      </CardFooter>
    </Card>
  )
}
