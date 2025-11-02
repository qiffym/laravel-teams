import { ChevronDownIcon } from "@heroicons/react/24/outline";
import { Button } from "./ui/button";
import {
  Menu,
  MenuContent,
  MenuItem,
  MenuLabel,
  MenuSeparator,
} from "./ui/menu";
import { usePage } from "@inertiajs/react";
import type { SharedData } from "@/types/shared";

export function UserTeams() {
  const { auth } = usePage<SharedData>().props;
  return (
    <Menu>
      <Button size="sm" intent="plain" className="group">
        <span className="text-sm font-semibold">
            {auth.user.current_team?.name || 'Select Team'}
        </span>
        <ChevronDownIcon className="duration-200 group-pressed:rotate-180" />
      </Button>
      <MenuContent>
        {auth.user.teams.map((team) => (
          <MenuItem key={team.id}>
            <MenuLabel>{team.name}</MenuLabel>
          </MenuItem>
        ))}
        <MenuSeparator />
        <MenuItem>
          <MenuLabel>New Team</MenuLabel>
        </MenuItem>
      </MenuContent>
    </Menu>
  );
}
