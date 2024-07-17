<?php

namespace Database\Seeders;

use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;
use App\Models\User;
use App\Models\Product;

class ProductSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {

       // Fetch the superAdmin user created in the DatabaseSeeder
       $superAdmin = User::find(1);

       // Create products and assign them to the superAdmin user
       Product::factory()
           ->count(35)
           ->for($superAdmin) // Assuming you have a relationship setup in the Product factory
           ->create();
    }
}
