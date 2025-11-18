<?php

namespace Database\Seeders;

use App\TeamPermissionEnum;
use App\TeamRoleEnum;
use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;
use Spatie\Permission\Models\Permission;
use Spatie\Permission\Models\Role;

class PermissionSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        $adminRole = Role::firstOrCreate(['name' => TeamRoleEnum::ADMIN]);
        $memberRole = Role::firstOrCreate(['name' => TeamRoleEnum::MEMBER]);

        collect(TeamPermissionEnum::cases())
            ->each(fn($permission) => Permission::firstOrCreate([
                'name' => $permission->value,
            ]));

        $adminRole->syncPermissions(TeamPermissionEnum::adminPermissions());
        $memberRole->syncPermissions(TeamPermissionEnum::memberPermissions());
    }
}
