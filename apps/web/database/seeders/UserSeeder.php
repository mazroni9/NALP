<?php

namespace Database\Seeders;

use App\Models\Role;
use App\Models\User;
use Illuminate\Database\Seeder;

class UserSeeder extends Seeder
{
    public function run(): void
    {
        $user = User::firstOrCreate(
            ['email' => 'admin@nalp.local'],
            [
                'name' => 'Admin',
                'password' => bcrypt('password'),
            ]
        );

        $adminRole = Role::where('name', 'admin')->first();
        if ($adminRole && ! $user->roles()->where('role_id', $adminRole->id)->exists()) {
            $user->roles()->attach($adminRole->id);
        }
    }
}
