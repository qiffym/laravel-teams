import { type JSX, useState } from "react"
import {
  Card,
  CardAction,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import type { Team, TeamMember } from "@/types/team"
import { useForm, usePage } from "@inertiajs/react"
import { InviteMember } from "./invite-member"
import {
  Table,
  TableBody,
  TableHeader,
  TableCell,
  TableColumn,
  TableRow,
} from "@/components/ui/table"
import { Menu, MenuContent, MenuItem } from "@/components/ui/menu"
import {
  EllipsisVerticalIcon,
  ShieldCheckIcon,
  TrashIcon,
  UserMinusIcon,
} from "@heroicons/react/24/outline"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import {
  ModalClose,
  ModalContent,
  ModalDescription,
  ModalFooter,
  ModalHeader,
  ModalTitle,
} from "@/components/ui/modal"
import type { Auth } from "@/types/auth"
import { Loader } from "@/components/ui/loader"
import { usePermissions } from "@/hooks/use-permissions"

type PageProps = {
  team: Team
  members: TeamMember[]
  auth: Auth
}

type ModalState = {
  open: boolean
  member: TeamMember | null
  action: "cancel-invite" | "remove" | "transfer" | null
}

export function ListMembers() {
  const { team, members, auth } = usePage<PageProps>().props
  const can = usePermissions(auth?.user?.permissions!)
  const [modalState, setModalState] = useState<ModalState>({
    open: false,
    member: null,
    action: null,
  })
  const { delete: destroy, processing } = useForm()

  function openModal(member: TeamMember, action: ModalState["action"]) {
    setModalState({ open: true, member, action })
  }

  function closeModal() {
    setModalState({ open: false, member: null, action: null })
  }

  function handleAction() {
    if (!modalState.member || !modalState.action) return

    const routes = {
      "cancel-invite": route("team-invites.destroy", [team, modalState.member]),
      remove: route("team-members.destroy", [team, modalState.member]),
      transfer: "",
    }

    destroy(routes[modalState.action], {
      preserveScroll: true,
      onSuccess: () => closeModal(),
    })
  }

  const getStatusConfig = (status: TeamMember["status"]) => {
    const configMap = {
      owner: {
        intent: "primary",
        label: "Transfer Ownership",
        isDisabled: false,
        icon: <ShieldCheckIcon />,
      },
      member: {
        intent: "success",
        label: "Remove member",
        isDisabled: !can("remove users from team"),
        icon: <TrashIcon />,
      },
      pending: {
        intent: "warning",
        label: "Cancel invite",
        isDisabled: !can("invite users to team"),
        icon: <UserMinusIcon />,
      },
    } as const

    return configMap[status]
  }

  const getModalContent = () => {
    if (!modalState.member || !modalState.action) return { title: "", description: "" }

    const contentMap = {
      remove: {
        title: "Remove Member",
        description: `Are you sure you want to remove ${modalState.member.name} from the team?`,
      },
      transfer: {
        title: "Transfer Ownership",
        description: `Are you sure you want to transfer ownership to ${modalState.member.name}?`,
      },
      "cancel-invite": {
        title: "Cancel Invitation",
        description: `Are you sure you want to cancel the invitation for ${modalState.member.email}?`,
      },
    }

    return contentMap[modalState.action]
  }

  return (
    <>
      <Card className="[--card-spacing:var(--gutter)]">
        <CardHeader>
          <CardTitle>Team Members</CardTitle>
          <CardDescription>List of all members in the team</CardDescription>
          <CardAction>{can("invite users to team") && <InviteMember team={team} />}</CardAction>
        </CardHeader>
        <CardContent>
          <Table
            bleed
            className="[--gutter:var(--card-spacing)] sm:[--gutter:var(--card-spacing)]"
            aria-label="Team Members"
          >
            <TableHeader>
              <TableColumn isRowHeader>Name</TableColumn>
              <TableColumn>Email</TableColumn>
              <TableColumn>Status</TableColumn>
              <TableColumn />
            </TableHeader>
            <TableBody items={members}>
              {(member) => (
                <TableRow id={member.email}>
                  <TableCell>{member.name}</TableCell>
                  <TableCell>{member.email}</TableCell>
                  <TableCell>
                    <Badge intent={getStatusConfig(member.status).intent}>{member.status}</Badge>
                  </TableCell>
                  <TableCell>
                    {member.email !== auth.user.email && (
                      <MemberActions
                        member={member}
                        onAction={openModal}
                        getStatusConfig={getStatusConfig}
                      />
                    )}
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      <ModalContent isOpen={modalState.open} onOpenChange={closeModal}>
        <ModalHeader>
          <ModalTitle>{getModalContent().title}</ModalTitle>
          <ModalDescription>{getModalContent().description}</ModalDescription>
        </ModalHeader>
        <ModalFooter>
          <ModalClose>Cancel</ModalClose>
          <Button intent="danger" isPending={processing} onPress={handleAction}>
            {processing ? <Loader /> : getModalContent().title}
          </Button>
        </ModalFooter>
      </ModalContent>
    </>
  )
}

function MemberActions({
  member,
  onAction,
  getStatusConfig,
}: {
  member: TeamMember
  onAction: (member: TeamMember, action: "cancel-invite" | "remove" | "transfer") => void
  getStatusConfig: (status: TeamMember["status"]) => {
    intent: string
    label: string
    isDisabled: boolean
    icon: JSX.Element
  }
}) {
  const { label, icon, isDisabled } = getStatusConfig(member.status)
  console.log(onAction)

  const getActionType = (status: TeamMember["status"]): "cancel-invite" | "remove" | "transfer" => {
    const actionMap = {
      owner: "transfer",
      member: "remove",
      pending: "cancel-invite",
    } as const

    return actionMap[status]
  }
  console.log(getActionType(member.status))

  return (
    <div className="text-end last:pr-2.5">
      <Menu>
        <Button size="sm" intent="plain" className="w-1 cursor-pointer">
          <EllipsisVerticalIcon />
        </Button>
        <MenuContent aria-label="Actions" placement="left top">
          <MenuItem
            intent="danger"
            isDisabled={isDisabled}
            onAction={() => onAction(member, getActionType(member.status))}
          >
            {icon}
            <span className="ml-1">{label}</span>
          </MenuItem>
        </MenuContent>
      </Menu>
    </div>
  )
}
