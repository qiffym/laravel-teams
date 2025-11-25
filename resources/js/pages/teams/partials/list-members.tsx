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
  PaperAirplaneIcon,
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

type MemberAction = "cancelInvite" | "remove" | "transfer" | "resendInvite"

type MethodAction = "POST" | "DELETE" | "PATCH" | "PUT"

type ModalState = {
  open: boolean
  member: TeamMember | null
  action: MemberAction | null
  method: MethodAction | null
}

type ModalContentType = {
  title: string
  description: string
}

type ActionConfig = {
  action: MemberAction
  label: string
  icon: JSX.Element
  method: MethodAction
  intent?: "danger" | "warning" | undefined
}

// Helper functions
function getStatusBadge(status: TeamMember["status"]): "success" | "primary" | "warning" {
  const statusMap: Record<TeamMember["status"], "success" | "primary" | "warning"> = {
    owner: "primary",
    member: "success",
    pending: "warning",
  }

  return statusMap[status] || "default"
}

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
    resendInvite: {
      title: "Resend Invitation",
      description: `Are you sure you want to resend the invitation to ${member.email}?`,
    },
  }

  return contentMap[action]
}

function getRouteForAction(action: MemberAction, team: Team, member: TeamMember): string {
  const routeMap: Record<MemberAction, string> = {
    cancelInvite: route("team-invites.destroy", [team, member]),
    resendInvite: route("team-invites.resend", [team, member]),
    remove: route("team-members.destroy", [team, member]),
    transfer: "",
  }

  return routeMap[action]
}

function getAvailableActions(
  status: TeamMember["status"],
  canRemove: boolean,
  canInvite: boolean,
): ActionConfig[] {
  const actionsMap: Record<TeamMember["status"], ActionConfig[]> = {
    owner: [
      {
        action: "transfer",
        label: "Transfer Ownership",
        icon: <ShieldCheckIcon />,
        intent: "warning",
        method: "PATCH",
      },
    ],
    member: [
      {
        action: "remove",
        label: "Remove member",
        icon: <TrashIcon />,
        intent: "danger",
        method: "DELETE",
      },
    ],
    pending: [
      {
        action: "resendInvite",
        label: "Resend invitation",
        icon: <PaperAirplaneIcon />,
        method: "POST",
      },
      {
        action: "cancelInvite",
        label: "Cancel invitation",
        icon: <UserMinusIcon />,
        intent: "danger",
        method: "DELETE",
      },
    ],
  }

  const actions = actionsMap[status] || []

  // Filter actions based on permissions
  return actions.filter((actionConfig) => {
    if (actionConfig.action === "transfer") return false
    if (actionConfig.action === "remove") return canRemove
    if (actionConfig.action === "cancelInvite" || actionConfig.action === "resendInvite")
      return canInvite
    return true
  })
}

export function ListMembers() {
  const { team, members, auth } = usePage<PageProps>().props
  const { can } = usePermissions(auth.user.permissions)
  const [modalState, setModalState] = useState<ModalState>({
    open: false,
    member: null,
    action: null,
    method: null,
  })
  const { post, processing, transform } = useForm()

  const openModal = useCallback(
    (member: TeamMember, action: MemberAction, method: MethodAction | null) => {
      setModalState({ open: true, member, action, method })
    },
    [],
  )

  const closeModal = useCallback(() => {
    setModalState({ open: false, member: null, action: null, method: null })
  }, [])

  const handleAction = useCallback(() => {
    if (!modalState.member || !modalState.action || !modalState.method) return

    const actionRoute = getRouteForAction(modalState.action, team, modalState.member)

    transform((data) => ({
      ...data,
      _method: modalState.method,
    }))

    post(actionRoute, {
      preserveScroll: true,
      onSuccess: closeModal,
    })
  }, [modalState.member, modalState.action, team, post, closeModal])

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
                    <Badge intent={getStatusBadge(member.status)}>{member.status}</Badge>
                  </TableCell>
                  <TableCell>
                    {member.email !== auth.user.email && (
                      <MemberActions
                        member={member}
                        onAction={openModal}
                        canRemove={can("REMOVE_USERS")}
                        canInvite={can("INVITE_USERS")}
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
  onAction: (member: TeamMember, action: MemberAction, method: MethodAction) => void
  canRemove: boolean
  canInvite: boolean
}

function MemberActions({ member, onAction, canRemove, canInvite }: MemberActionsProps) {
  const availableActions = useMemo(
    () => getAvailableActions(member.status, canRemove, canInvite),
    [member.status, canRemove, canInvite],
  )

  const handleAction = useCallback(
    (action: MemberAction, method: MethodAction) => {
      onAction(member, action, method)
    },
    [member, onAction],
  )

  if (availableActions.length === 0) return null

  return (
    <div className="text-end last:pr-2.5">
      <Menu>
        <Button size="sm" intent="plain" className="w-1 cursor-pointer">
          <EllipsisVerticalIcon />
        </Button>
        <MenuContent aria-label="Actions" placement="left top">
          {availableActions.map((actionConfig) => (
            <MenuItem
              key={actionConfig.action}
              intent={actionConfig.intent}
              onAction={() => handleAction(actionConfig.action, actionConfig.method)}
            >
              {actionConfig.icon}
              <span className="ml-1">{actionConfig.label}</span>
            </MenuItem>
          ))}
        </MenuContent>
      </Menu>
    </div>
  )
}
