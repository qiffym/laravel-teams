import { Button } from "@/components/ui/button"
import { FieldError, Label } from "@/components/ui/field"
import { Input } from "@/components/ui/input"
import { Loader } from "@/components/ui/loader"
import {
  ModalBody,
  ModalClose,
  ModalContent,
  ModalDescription,
  ModalFooter,
  ModalHeader,
  ModalTitle,
} from "@/components/ui/modal"
import { TextField } from "@/components/ui/text-field"
import type { Team } from "@/types/team"
import { UserPlusIcon } from "@heroicons/react/24/outline"
import { useForm } from "@inertiajs/react"
import { useState } from "react"
import { Form } from "react-aria-components"

interface Props {
  team: Team
}

export function InviteMember({ team }: Props) {
  const [open, setOpen] = useState(false)
  const { data, setData, post, processing, errors, reset } = useForm({
    email: "",
  })

  const submit = (e: React.FormEvent) => {
    e.preventDefault()
    post(route("team-invites.store", [team]), {
      onSuccess: () => {
        reset()
        setOpen(false)
      },
    })
  }
  return (
    <>
      <Button size="sm" onPress={() => setOpen(true)} intent="outline">
        <UserPlusIcon /> Invite Member
      </Button>
      <ModalContent isOpen={open} onOpenChange={setOpen}>
        <ModalHeader>
          <ModalTitle>Invite Member to {team.name}</ModalTitle>
          <ModalDescription>
            We need the email address of the person you would like to invite.
          </ModalDescription>
        </ModalHeader>
        <Form onSubmit={submit} validationErrors={errors}>
          <ModalBody>
            <TextField
              name="email"
              value={data.email}
              onChange={(value) => setData("email", value)}
              autoFocus
              isRequired
            >
              <Label>Email Address</Label>
              <Input type="email" placeholder="Enter email member to invite" />
              <FieldError />
            </TextField>
          </ModalBody>
          <ModalFooter>
            <ModalClose>Cancel</ModalClose>
            <Button type="submit" isPending={processing}>
              {processing ? <Loader /> : <UserPlusIcon />}
              {processing ? "Inviting..." : "Invite Member"}
            </Button>
          </ModalFooter>
        </Form>
      </ModalContent>
    </>
  )
}
