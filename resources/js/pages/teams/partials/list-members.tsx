import {
  Card,
  CardAction,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import type { Team, TeamMember } from "@/types/team"
import { usePage } from "@inertiajs/react"
import { InviteMember } from "./invite-member"
import {
  Table,
  TableBody,
  TableHeader,
  TableCell,
  TableColumn,
  TableRow,
} from "@/components/ui/table"
import { Menu, MenuContent, MenuItem, MenuTrigger } from "@/components/ui/menu"
import { EllipsisVerticalIcon } from "@heroicons/react/24/outline"
import { Badge } from "@/components/ui/badge"

const getStatusIntent = (status: TeamMember["status"]) => {
  const statusIntentMap = {
    owner: "primary",
    member: "success",
    pending: "warning",
  } as const

  return statusIntentMap[status] || "warning"
}

const getActionLabel = (status: TeamMember["status"]) => {
  const actionLabelMap = {
    owner: "Transfer ownership",
    member: "Remove member",
    pending: "Cancel invite",
  } as const

  return actionLabelMap[status] || "Delete"
}

const MemberActions = ({ member }: { member: TeamMember }) => {
  const handleAction = () => {
    // TODO: Implement action logic based on member.status
    console.log(`Action for ${member.status}: ${member.email}`)
  }

  return (
    <div className="text-end last:pr-2.5">
      <Menu>
        <MenuTrigger aria-label="Open Action" className="size-6 cursor-pointer">
          <EllipsisVerticalIcon />
        </MenuTrigger>
        <MenuContent aria-label="Actions" placement="left top">
          <MenuItem intent="danger" onAction={handleAction}>
            {getActionLabel(member.status)}
          </MenuItem>
        </MenuContent>
      </Menu>
    </div>
  )
}

type PageProps = {
  team: Team
  members: TeamMember[]
}

export function ListMembers() {
  const { team, members } = usePage<PageProps>().props
  return (
    <Card className="[--card-spacing:var(--gutter)]">
      <CardHeader>
        <CardTitle>Team Members</CardTitle>
        <CardDescription>List of all members in the team</CardDescription>
        <CardAction>
          <InviteMember team={team} />
        </CardAction>
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
            {(item) => (
              <TableRow id={item.email}>
                <TableCell>{item.name}</TableCell>
                <TableCell>{item.email}</TableCell>
                <TableCell>
                  <Badge intent={getStatusIntent(item.status)}>{item.status}</Badge>
                </TableCell>
                <TableCell>
                  <MemberActions member={item} />
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  )
}
