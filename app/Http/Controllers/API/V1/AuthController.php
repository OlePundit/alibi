<?php

namespace App\Http\Controllers\API\V1;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use App\Http\Requests\LoginRequest;
use App\Http\Requests\UpdateUserRequest;
use App\Http\Resources\V1\UserResource;
use Illuminate\Support\Str;
use Illuminate\Support\Facades\Storage;
use Illuminate\Support\Facades\File;
use App\Http\Requests\SignupRequest;
use App\Models\User;
use Illuminate\Support\Facades\Auth;
use App\Http\Resources\V1\UserCollection;
use Illuminate\Support\Facades\Hash;
use Illuminate\Validation\Rule;

class AuthController extends Controller
{
    public function index(Request $request)
    {
        $users = User::with('roles')->paginate();

        
        return UserResource::collection($users);
    }
    public function show($userId)
    {
        $user = User::with('roles')->find($userId);

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
    public function createUser(Request $request)
    {
        $validated = $request->validate([
            'name' => 'required|string|max:255',
            'email' => 'required|string|email|max:255|unique:users',
            'password' => 'required|string|confirmed',
            'shop_name' => 'nullable|string|max:255',
            'role' => 'required|string|in:super-admin,admin',
        ]);

        $user = User::create([
            'name' => $validated['name'],
            'email' => $validated['email'],
            'shop_name' => $validated['shop_name'],
            'password' => Hash::make($validated['password']),
        ]);

        if ($validated['role'] === 'super-admin') {
            $user->assignRole('super-admin');
        } else {
            $user->assignRole('admin');
        }

        return response()->json(['user' => $user], 201);
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
    public function updateUser(Request $request, User $user)
    {
        $validated = $request->validate([
            'name' => 'sometimes|required|string|max:255',
            'email' => ['sometimes', 'required', 'string', 'email', 'max:255', Rule::unique('users')->ignore($user->id)],
            'password' => 'sometimes|nullable|string|confirmed',
            'shop_name' => 'nullable|string|max:255',
            'role' => 'sometimes|required|string|in:super-admin,admin',
        ]);

        if (isset($validated['password'])) {
            $validated['password'] = Hash::make($validated['password']);
        } else {
            unset($validated['password']);
        }

        $user->update($validated);

        if (isset($validated['role'])) {
            $user->syncRoles([$validated['role']]);
        }

        return response()->json(['user' => $user], 200);
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