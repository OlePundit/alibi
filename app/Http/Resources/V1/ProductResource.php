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
            'created_at'=>$this->created_at,
            'user_id'=>$this->user_id,
            'name'=>$this->name,
            'volume'=>$this->volume,
            'stock'=>$this->stock,
            'price'=>$this->price,
            'category'=>$this->category,
            'sub_category'=>$this->sub_category,
            'description'=>$this->description,
            'image'=>$this->image,
            'discount'=>$this->discount,
            'alcohol'=>$this->alcohol,
            'user'=> new UserResource($this->user)

        ];
    }
}
