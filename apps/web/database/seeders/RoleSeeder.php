<?php

namespace Database\Seeders;

use App\Models\Role;
use App\Models\User;
use Illuminate\Database\Seeder;

class RoleSeeder extends Seeder
{
    public function run(): void
    {
        $roles = [
            ['name' => 'admin', 'display_name' => 'Administrator'],
            ['name' => 'investor', 'display_name' => 'Investor'],
            ['name' => 'engineer', 'display_name' => 'Engineer'],
        ];

        foreach ($roles as $r) {
            Role::firstOrCreate(['name' => $r['name']], $r);
        }

        $admin = Role::where('name', 'admin')->first();
        $user = User::where('email', 'admin@nalp.local')->first();
        if ($admin && $user && ! $user->roles()->where('name', 'admin')->exists()) {
            $user->roles()->attach($admin->id);
        }
    }
}
