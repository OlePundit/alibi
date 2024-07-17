<?php

namespace Database\Factories;

use Illuminate\Database\Eloquent\Factories\Factory;
use App\Models\Product;
use App\Models\User;

/**
 * @extends \Illuminate\Database\Eloquent\Factories\Factory<\App\Models\Product>
 */
class ProductFactory extends Factory
{
    protected $model = Product::class;

    /**
     * Define the model's default state.
     *
     * @return array<string, mixed>
     */
    public function definition(): array
    {

        return [
            'name' => fake()->name(),
            'description' => fake()->paragraph(),
            'image' => fake()->imageUrl(640, 480, 'cats'), // Generate a fake image URL
            'volume' => fake()->randomElement(['5ltr','1ltr','750ml','500ml','350ml','250ml','other']), // Generate a fake file path
            'price' => fake()->numberBetween(1, 100000),
            'stock' => fake()->randomElement(['available','unavailable']), // Generate a fake file path
            'category' => fake()->randomElement(['wine','whisky','brandy','spirits','liquer']),
            'user_id'=> User::factory(),
        ];
    }
}
