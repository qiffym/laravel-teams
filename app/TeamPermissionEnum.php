<?php

namespace App;

enum TeamPermissionEnum: string
{
    case UPDATE_TEAM = 'update team';
    case DELETE_TEAM = 'delete team';
    case INVITE_USERS = 'invite users to team';
    case TRANSFER_OWNERSHIP = 'transfer team ownership';
    case REMOVE_USERS = 'remove users from team';

    /**
     * Get all permission values as array
     */
    public static function values(): array
    {
        return array_column(self::cases(), 'value');
    }

    /**
     * Get all permissions except specific ones
     */
    public static function except(self ...$excludes): array
    {
        return collect(self::cases())
            ->filter(fn($permission) => !in_array($permission, $excludes))
            ->map(fn($permission) => $permission->value)
            ->toArray();
    }

    /**
     * Get admin permissions (all except transfer ownership)
     */
    public static function adminPermissions(): array
    {
        return self::except(self::TRANSFER_OWNERSHIP);
    }

    /**
     * Get member permissions
     */
    public static function memberPermissions(): array
    {
        return [self::INVITE_USERS->value];
    }
}
