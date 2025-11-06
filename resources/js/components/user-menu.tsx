import type { SharedData } from "@/types/shared"
import { usePage } from "@inertiajs/react"
import {
  Menu,
  MenuContent,
  MenuHeader,
  MenuItem,
  MenuLabel,
  MenuSection,
  MenuSeparator,
} from "./ui/menu"
import { Button } from "./ui/button"
import { Avatar } from "./ui/avatar"
import { ArrowRightEndOnRectangleIcon } from "@heroicons/react/24/outline"

export function UserMenu() {
  const { auth } = usePage<SharedData>().props
  return (
    <Menu>
      <Button size="sq-md" intent="plain" isCircle aria-label="Open menu">
        <Avatar src={auth.user.gravatar} size="sm" />
      </Button>
      <MenuContent placement="bottom end" className="sm:min-w-56">
        <MenuSection>
          <MenuHeader separator className="relative">
            <div>{auth.user.name}</div>
            <div className="truncate whitespace-nowrap pr-6 font-normal text-muted-fg text-sm">
              {auth.user.email}
            </div>
          </MenuHeader>
        </MenuSection>
        <MenuItem href="/dashboard">
          <MenuLabel>Dashboard</MenuLabel>
        </MenuItem>
        <MenuItem href="/settings/profile" className="justify-between">
          <MenuLabel>Update profile</MenuLabel>
        </MenuItem>
        <MenuItem href="/settings/password" className="justify-between">
          <MenuLabel>Change password</MenuLabel>
        </MenuItem>
        <MenuItem href="/settings/appearance" className="justify-between">
          <MenuLabel>Appearance</MenuLabel>
        </MenuItem>
        <MenuSeparator />
        <MenuItem routerOptions={{ method: "post" }} href="/logout">
          <MenuLabel>Logout</MenuLabel>
          <ArrowRightEndOnRectangleIcon />
        </MenuItem>
      </MenuContent>
    </Menu>
  )
}
