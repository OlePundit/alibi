<?php

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;
use App\Http\Controllers\API\V1\ProductController;
use App\Http\Controllers\API\V1\AuthController;
use App\Http\Resources\V1\UserResource;


/*
|--------------------------------------------------------------------------
| API Routes
|--------------------------------------------------------------------------
|
| Here is where you can register API routes for your application. These
| routes are loaded by the RouteServiceProvider and all of them will
| be assigned to the "api" middleware group. Make something great!
|
*/

Route::middleware('auth:sanctum')->group(function() {

    Route::get('/user', function (Request $request) {
        return new UserResource($request->user());
    });
    Route::post('/logout', [AuthController::class, 'logout']);
    Route::apiResource('/products', ProductController::class);
    Route::post('/admin/users', [AuthController::class, 'createUser']);
    Route::put('/admin/users/{user}', [AuthController::class, 'updateUser']);


});
Route::post('/signup', [AuthController::class, 'signup']);
Route::post('/login', [AuthController::class, 'login']);    
Route::apiResource('/users', AuthController::class);
