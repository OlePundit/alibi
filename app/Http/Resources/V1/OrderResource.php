<?php

namespace App\Http\Resources\V1;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class OrderResource extends JsonResource
{

    Public static $wrap = false;

    /**
     * Transform the resource into an array.
     *
     * @return array<string, mixed>
     */
    public function toArray(Request $request): array
    {
        return [
            'id'=>$this->id,
            'created_at'=>$this->created_at,

            'product_id'=>$this->product_id,
            'user_id'=>$this->user_id,
            'status'=>$this->status,
            'phone'=>$this->phone,
            'name'=>$this->name,
            'location'=>$this->location,
            'landmark'=>$this->landmark,
            'sub_category'=>$this->sub_category,
            'cash'=>$this->cash,
            'airtel'=>$this->airtel,
            'momo'=>$this->momo,
            'credit'=>$this->credit,
            'instructions'=>$this->instructions,
            // Include products if they are loaded
            'products' => $this->products->map(function ($product) {
                return [
                    'id' => $product->id,
                    'name' => $product->name,
                    'volume' => $product->volume,
                ];
            }),
        ];
    }
}
