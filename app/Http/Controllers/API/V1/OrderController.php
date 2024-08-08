<?php

namespace App\Http\Controllers\API\V1;

use App\Http\Controllers\Controller;

use App\Http\Requests\StoreOrderRequest;
use App\Http\Requests\UpdateOrderRequest;
use App\Models\Order;
use App\Http\Resources\V1\OrderCollection;
use Illuminate\Support\Facades\Auth;
use App\Http\Resources\V1\OrderResource;
use Illuminate\Http\Request;
use App\Models\Product;

class OrderController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function __construct(Order $order)
    {
        $this->order = $order;
        $this->authorizeResource(Order::class, 'order');
    }
    public function index(Request $request)
    {
        $query = Order::query();

        $includeProducts = $request->query('includeProducts');
        if ($includeProducts) {
            $orders = $query->get();
            foreach ($orders as $order) {
                if (is_array($order->product_id)) {
                    $products = Product::whereIn('id', $order->product_id)
                        ->select('id', 'name', 'volume')
                        ->get();
                    $order->products = $products;
                }
            }
            return new OrderCollection($orders);
        }

        return new OrderCollection($query->paginate());
    }
    

    /**
     * Show the form for creating a new resource.
     */
    public function create()
    {
        //
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(StoreOrderRequest $request)
    {
        // Check if the request is authenticated
        if (!Auth::check()) {
            return response()->json(['message' => 'Unauthenticated'], 401);
        }
    
        $user = Auth::user();  // Get the authenticated user
        $orderData = $request->except('product_id'); // Exclude product_id from the main order data
        $orderData['user_id'] = $user->id;  // Set user_id from the authenticated user
    
        // Create the order
        $order = Order::create($orderData);
    
        // Decode the JSON string back into an array
        $productIdsJson = $request->input('product_id'); // This is a JSON string
        $productIds = json_decode($productIdsJson, true); // Decode JSON to array
    
        // Attach the products to the order using a pivot table
        if (is_array($productIds)) {
            $order->products()->attach($productIds);
        }
    
        return new OrderResource($order);
    }
    

    /**
     * Display the specified resource.
     */
    public function show(Order $order)
    {
        return new OrderResource($order);
    }

    /**
     * Show the form for editing the specified resource.
     */
    public function edit(Order $order)
    {
        //
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(UpdateOrderRequest $request, Order $order)
    {
        $order->update($request->all());
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(Order $order)
    {
        $order->delete();

        return response("", 204);
    }
}
