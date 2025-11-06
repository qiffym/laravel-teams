<?php

namespace Database\Seeders;

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
        $adminRole = Role::query()->firstOrCreate(['name' => 'team admin']);
        $memberRole = Role::query()->firstOrCreate(['name' => 'team member']);

        $permissions = [
            'update team',
            'delete team',
            'invite users to team',
            'remove users from team',
        ];

        collect($permissions)->each(fn($item) => Permission::query()->firstOrCreate(['name' => $item]));

        $adminRole->givePermissionTo($permissions);
        $memberRole->givePermissionTo('invite users to team');
    }
}
