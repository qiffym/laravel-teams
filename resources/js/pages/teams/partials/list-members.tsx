import { type JSX, useState, useMemo, useCallback } from "react"
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

type MemberAction = "cancelInvite" | "remove" | "transfer"

type ModalState = {
  open: boolean
  member: TeamMember | null
  action: MemberAction | null
}

type StatusConfig = {
  intent: "primary" | "success" | "warning"
  label: string
  isDisabled: boolean
  icon: JSX.Element
}

type ModalContentType = {
  title: string
  description: string
}

// Constants
const STATUS_CONFIG: Record<
  TeamMember["status"],
  (canRemove: boolean, canInvite: boolean) => StatusConfig
> = {
  owner: () => ({
    intent: "primary",
    label: "Transfer Ownership",
    isDisabled: true,
    icon: <ShieldCheckIcon />,
  }),
  member: (canRemove) => ({
    intent: "success",
    label: "Remove member",
    isDisabled: !canRemove,
    icon: <TrashIcon />,
  }),
  pending: (_, canInvite) => ({
    intent: "warning",
    label: "Cancel invite",
    isDisabled: !canInvite,
    icon: <UserMinusIcon />,
  }),
}

const ACTION_MAP: Record<TeamMember["status"], MemberAction> = {
  owner: "transfer",
  member: "remove",
  pending: "cancelInvite",
}

// Helper functions
function getModalContent(action: MemberAction | null, member: TeamMember | null): ModalContentType {
  if (!member || !action) return { title: "", description: "" }

  const contentMap: Record<MemberAction, ModalContentType> = {
    remove: {
      title: "Remove Member",
      description: `Are you sure you want to remove ${member.name} from the team?`,
    },
    transfer: {
      title: "Transfer Ownership",
      description: `Are you sure you want to transfer ownership to ${member.name}?`,
    },
    cancelInvite: {
      title: "Cancel Invitation",
      description: `Are you sure you want to cancel the invitation for ${member.email}?`,
    },
  }

  return contentMap[action]
}

function getRouteForAction(action: MemberAction, team: Team, member: TeamMember): string {
  const routeMap: Record<MemberAction, string> = {
    cancelInvite: route("team-invites.destroy", [team, member]),
    remove: route("team-members.destroy", [team, member]),
    transfer: "",
  }

  return routeMap[action]
}

export function ListMembers() {
  const { team, members, auth } = usePage<PageProps>().props
  const { can } = usePermissions(auth.user.permissions)
  const [modalState, setModalState] = useState<ModalState>({
    open: false,
    member: null,
    action: null,
  })
  const { delete: destroy, processing } = useForm()

  const openModal = useCallback((member: TeamMember, action: MemberAction) => {
    setModalState({ open: true, member, action })
  }, [])

  const closeModal = useCallback(() => {
    setModalState({ open: false, member: null, action: null })
  }, [])

  const handleAction = useCallback(() => {
    if (!modalState.member || !modalState.action) return

    const actionRoute = getRouteForAction(modalState.action, team, modalState.member)

    destroy(actionRoute, {
      preserveScroll: true,
      onSuccess: closeModal,
    })
  }, [modalState.member, modalState.action, team, destroy, closeModal])

  const getStatusConfig = useCallback(
    (status: TeamMember["status"]): StatusConfig => {
      const canRemove = can("REMOVE_USERS")
      const canInvite = can("INVITE_USERS")
      return STATUS_CONFIG[status](canRemove, canInvite)
    },
    [can],
  )

  const modalContent = useMemo(
    () => getModalContent(modalState.action, modalState.member),
    [modalState.action, modalState.member],
  )

  const canInvite = can("INVITE_USERS")

  return (
    <>
      <Card className="[--card-spacing:var(--gutter)]">
        <CardHeader>
          <CardTitle>Team Members</CardTitle>
          <CardDescription>List of all members in the team</CardDescription>
          <CardAction>{canInvite && <InviteMember team={team} />}</CardAction>
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

      <ModalContent isOpen={modalState.open} onOpenChange={closeModal} role="alertdialog">
        <ModalHeader>
          <ModalTitle>{modalContent.title}</ModalTitle>
          <ModalDescription>{modalContent.description}</ModalDescription>
        </ModalHeader>
        <ModalFooter>
          <ModalClose>Cancel</ModalClose>
          <Button intent="danger" isPending={processing} onPress={handleAction}>
            {processing ? <Loader /> : modalContent.title}
          </Button>
        </ModalFooter>
      </ModalContent>
    </>
  )
}

type MemberActionsProps = {
  member: TeamMember
  onAction: (member: TeamMember, action: MemberAction) => void
  getStatusConfig: (status: TeamMember["status"]) => StatusConfig
}

function MemberActions({ member, onAction, getStatusConfig }: MemberActionsProps) {
  const { label, icon, isDisabled } = getStatusConfig(member.status)
  const action = ACTION_MAP[member.status]

  const handleAction = useCallback(() => {
    onAction(member, action)
  }, [member, action, onAction])

  if (isDisabled) return null

  return (
    <div className="text-end last:pr-2.5">
      <Menu>
        <Button size="sm" intent="plain" className="w-1 cursor-pointer">
          <EllipsisVerticalIcon />
        </Button>
        <MenuContent aria-label="Actions" placement="left top">
          <MenuItem intent="danger" onAction={handleAction}>
            {icon}
            <span className="ml-1">{label}</span>
          </MenuItem>
        </MenuContent>
      </Menu>
    </div>
  )
}
