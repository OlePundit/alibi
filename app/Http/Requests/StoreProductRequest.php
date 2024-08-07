<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Validation\Rule;

class StoreProductRequest extends FormRequest
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
            'name' => 'required',
            'volume' => 'required',   
            'stock'=>'required',
            'price'=>'required',
            'category'=>'required',
            'sub_category'=>'',
            'description'=>'required',
            'discount'=>'',
            'alcohol'=>'required',
            'image'=>['required','file'],
            'user_id'=>''
        ];
    }
}
