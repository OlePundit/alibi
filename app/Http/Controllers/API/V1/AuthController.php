<?php

namespace App\Http\Controllers\API;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use App\Http\Requests\LoginRequest;
use App\Http\Requests\V1\UpdateUserRequest;
use App\Http\Resources\V1\UserResource;
use Illuminate\Support\Str;
use Illuminate\Support\Facades\Storage;
use Illuminate\Support\Facades\File;
use App\Http\Requests\SignupRequest;
use App\Models\User;
use Illuminate\Support\Facades\Auth;

class AuthController extends Controller
{
    public function show($userId)
    {
        $user = User::find($userId);

        // Check if the user exists
        if (!$user) {
            return response()->json(['message' => 'User not found'], 404);
        }

        return new UserResource($user);
    }
    public function signup(SignupRequest $request)
    {
        $data = $request->validated();
        $user = User::create([
            'name'=>$data['name'],
            'shop_name'=>$data['shop_name'],
            'email'=>$data['email'],
            'password'=>bcrypt($data['password']),
        ]);

       $token = $user->createToken('main')->plainTextToken;

       return response(compact('user','token'));
    }
    public function login(LoginRequest $request)
    {
        $credentials = $request->validated();
        if(!Auth::attempt($credentials)){
            return response([
                'message'=>'provided email address or password is incorrect'
            ], 422);
        }

        $user = Auth::user();
        $token= $user->createToken('main')->plainTextToken;
        return response(compact('user','token'));

    }

    public function logout(Request $request)
    {
        $user = $request->user();
        $user->currentAccessToken()->delete();
        return response('', 204);
    }
    public function update(UpdateUserRequest $request, User $user)
    {
        \Log::info('Request data:', $request->validated());
    
        try {
            $data = $request->validated(); // Ensure that the data is validated and not null
            \Log::info('Validated data:', $data);
    
            $user->update($data);
            \Log::info('Updated data:', $data);
    
            return new UserResource($user);
        } catch (\Exception $e) {
            \Log::error('Update error:', ['message' => $e->getMessage()]);
            return response()->json(['error' => $e->getMessage()], 500);
        }
    }
}