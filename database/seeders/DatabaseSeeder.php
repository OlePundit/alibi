<?php

namespace Database\Seeders;

// use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;
use App\Models\User;
use Illuminate\Support\Facades\Hash;

class DatabaseSeeder extends Seeder
{
    /**
     * Seed the application's database.
     */
    public function run(): void
    {
        $this->call(RoleSeeder::class);

        $superAdmin = User::firstOrCreate([
            'id' => 1,
            'name' => 'Omosh',
            'shop_name' => 'TheAlibi',
            'email' => 'superadmin@admin.com',
            'password' => Hash::make('password'),
            'email_verified_at' => now()
        ]);

        $superAdmin->assignRole('super-admin');


        $this->call([
            PermissionSeeder::class,
            UserSeeder::class,
        ]);
    }
}
