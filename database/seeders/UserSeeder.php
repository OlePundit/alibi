<?php

namespace Database\Seeders;

use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;
use App\Models\User;
use Illuminate\Support\Facades\Hash;

class UserSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {

        $admin = User::firstOrCreate([
            'id' => 2,
            'name' => 'Glenn',
            'shop_name' => 'Alibi Liquor',
            'email' => 'admin@admin.com',
            'password' => Hash::make('password'),
            'email_verified_at' => now()
        ]);

        $admin->assignRole('admin');

        $client = User::firstOrCreate([
            'id' => 3,
            'name' => 'mimi',
            'shop_name' => 'mimi Liquor',
            'email' => 'mimi@admin.com',
            'password' => Hash::make('password'),
            'email_verified_at' => now()
        ]);

        $client->assignRole('client');
  
    }
}
