export const TEAM_PERMISSIONS = {
  UPDATE_TEAM: 'update team',
  DELETE_TEAM: 'delete team',
  INVITE_USERS: 'invite users to team',
  REMOVE_USERS: 'remove users from team',
  TRANSFER_OWNERSHIP: 'transfer team ownership',
  LEAVE_TEAM: 'leave team',
} as const

export type TeamPermission = typeof TEAM_PERMISSIONS[keyof typeof TEAM_PERMISSIONS]

// Helper to get permission key
export type PermissionKey = keyof typeof TEAM_PERMISSIONS