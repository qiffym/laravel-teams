import {useMemo} from "react";
import { TEAM_PERMISSIONS, type PermissionKey, type TeamPermission } from "@/types/permissions";

/**
 * Hook to check user permissions
 * 
 * @example
 * const can = usePermissions(auth.user.permissions)
 * can('UPDATE_TEAM') // true/false
 * can('update team') // true/false - also works with raw string
 */
export function usePermissions(permissions: string[]) {
  const permissionSet = useMemo(() => new Set(permissions), [permissions]);

  function can(permission: TeamPermission | PermissionKey | string): boolean {
    // If it's a permission key (e.g., 'UPDATE_TEAM'), convert to value
    if (permission in TEAM_PERMISSIONS) {
      const permissionValue = TEAM_PERMISSIONS[permission as PermissionKey]
      return permissionSet.has(permissionValue)
    }

    // Otherwise, check the raw permission string
    return permissionSet.has(permission)
  }

  function canAny(...permissions: (PermissionKey | TeamPermission | string)[]): boolean {
    return permissions.some((permission) => can(permission))
  }

  function canAll(...permissions: (PermissionKey | TeamPermission | string)[]): boolean {
    return permissions.every((permission) => can(permission))
  }

  return { can, canAny, canAll }
}
