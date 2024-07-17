<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Validation\Rule;

class UpdateProductRequest extends FormRequest
{
    /**
     * Determine if the user is authorized to make this request.
     */
    public function authorize(): bool
    {
        return true;
    }

    /**
     * Get the validation rules that apply to the request.
     *
     * @return array<string, \Illuminate\Contracts\Validation\ValidationRule|array<mixed>|string>
     */
    public function rules(): array
    {
        return [
            'name' => ['sometimes','required'],
            'volume' => ['sometimes','required'],   
            'stock'=>['sometimes','required'],
            'price'=>['sometimes','required'],
            'category'=>['sometimes','required'],
            'description'=>['sometimes','required'],
            'image'=>['sometimes','required'],
            'user_id'=>'sometimes'
        ];
    }
}
