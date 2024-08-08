<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Order extends Model
{
    protected $guarded = [];

    protected $casts = [
        'product_id' => 'array', // Assuming 'product_id' is a JSON array
    ];

    public function products()
    {
        return $this->belongsToMany(Product::class, 'order_product', 'order_id', 'product_id');
    }

    public function user()
    {
        return $this->belongsTo(User::class);
    }
}
