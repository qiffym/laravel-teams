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
import { Loader } from "@/components/ui/loader"

interface Props {
  team: Team
}

export function LeaveTeam({ team }: Props) {
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
  function leave(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault()

    destroy(route("teams.leave", [team]), {
      onSuccess: () => setOpen(false),
    })
  }
  return (
    <Card>
      <CardHeader
        title="Leave Team"
        description="You're about to leave team, this action can not be undone"
      />
      <CardFooter>
        <Button intent="danger" onPress={() => setOpen(true)}>
          Leave Team
        </Button>
        <ModalContent role="alertdialog" isOpen={open} onOpenChange={setOpen}>
          <ModalHeader>
            <ModalTitle>Leave Team</ModalTitle>
            <ModalDescription>
              Are you sure you want to leave this team? Once you leave the team, you will no longer
              have access to its resources.
            </ModalDescription>
          </ModalHeader>
          <Form onSubmit={leave} validationErrors={errors}>
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
                {processing && <Loader />}
                {processing ? "Leaving..." : "Leave Team"}
              </Button>
            </ModalFooter>
          </Form>
        </ModalContent>
      </CardFooter>
    </Card>
  )
}
