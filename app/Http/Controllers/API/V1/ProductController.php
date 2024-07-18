<?php

namespace App\Http\Controllers\API\V1;

use App\Http\Controllers\Controller;
use App\Http\Requests\StoreProductRequest;
use App\Http\Requests\UpdateProductRequest;
use App\Models\Product;
use Illuminate\Http\Request;
use App\Http\Resources\V1\ProductResource;
use App\Http\Resources\V1\ProductCollection;

class ProductController extends Controller
{
    /**
     * Display a listing of the resource.
     */

    public function index(Request $request)
    {
        $query = Product::query();

        $includeUsers = $request->query('includeUsers');

        if ($includeUsers) {
            $products = $query->with(['user'])->paginate();
        } else {
            $products = $query->paginate();
        }
    
        // Filter by price range
        $minPrice = $request->query('minPrice');
        $maxPrice = $request->query('maxPrice');
    
        if ($minPrice !== null && $maxPrice !== null) {
            $products = $query->whereBetween('price', [$minPrice, $maxPrice])->paginate();
        }
        //Filter by volume
        $volume = $request->query('volume');
        if($volume !== null){
            $products = $query->where('volume',$volume)->paginate();
        }
        //Filter by stock
        $stock = $request->query('stock');
        if($stock !== null){
            $query->where('stock',$stock)->paginate();
        }
        return new ProductCollection($products);
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
    public function store(StoreProductRequest $request)
    {
        return new ProductResource(Product::create($request->all()));
    }

    /**
     * Display the specified resource.
     */
    public function show(Product $product)
    {
        return new ProductResource($product);
    }

    /**
     * Show the form for editing the specified resource.
     */
    public function edit(Product $product)
    {
        //
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(UpdateProductRequest $request, Product $product)
    {
        $product->update($request->all());
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(Product $product)
    {
        //
    }
}
