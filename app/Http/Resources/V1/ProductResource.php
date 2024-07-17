<?php

namespace App\Http\Resources\V1;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class ProductResource extends JsonResource
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
            'user_id'=>$this->user_id,
            'name'=>$this->name,
            'volume'=>$this->volume,
            'stock'=>$this->stock,
            'price'=>$this->price,
            'category'=>$this->category,
            'description'=>$this->description,
            'image'=>$this->image,

        ];
    }
}
