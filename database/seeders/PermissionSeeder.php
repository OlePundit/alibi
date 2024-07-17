<?php

namespace Database\Seeders;

use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;
use Spatie\Permission\Models\Permission; // Import the Permission class
use Spatie\Permission\Models\Role;

class PermissionSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        Permission::firstOrCreate([
            'name' => 'create product'
        ]);
        Permission::firstOrCreate([
            'name' => 'read product'
        ]);
        Permission::firstOrCreate([
            'name' => 'update product'
        ]);
        Permission::firstOrCreate([
            'name' => 'destroy product'
        ]);


        Permission::firstOrCreate([
            'name' => 'create user'
        ]);
        Permission::firstOrCreate([
            'name' => 'read user'
        ]);
        Permission::firstOrCreate([
            'name' => 'update user'
        ]);
        Permission::firstOrCreate([
            'name' => 'destroy user'
        ]);


        Permission::firstOrCreate([
            'name' => 'create order'
        ]);
        Permission::firstOrCreate([
            'name' => 'read order'
        ]);
        Permission::firstOrCreate([
            'name' => 'update order'
        ]);
        Permission::firstOrCreate([
            'name' => 'destroy order'
        ]);

        $admin = Role::where('name','admin')->first();
        $admin->givePermissionTo([
            'create product',
            'read product',
            'update product',
            'destroy product',  
            'read order',
            'update order',  
            'read user',
        ]);

        $client = Role::where('name','client')->first();
        $client->givePermissionTo([
            'read product',
            'read user',
            'create order',
            'read order',
            'update order',
            'destroy order'
        ]);
        
    }
}
