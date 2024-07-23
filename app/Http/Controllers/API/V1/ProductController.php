<?php

namespace App\Http\Controllers\API\V1;

use App\Http\Controllers\Controller;
use App\Http\Requests\StoreProductRequest;
use App\Http\Requests\UpdateProductRequest;
use App\Models\Product;
use App\Filters\V1\ProductFilter;
use Illuminate\Http\Request;
use App\Http\Resources\V1\ProductResource;
use App\Http\Resources\V1\ProductCollection;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Str;
use Illuminate\Support\Facades\Storage;

class ProductController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function __construct(Product $product)
    {
        $this->product = $product;
        $this->authorizeResource(Product::class, 'product');
    }

    public function index(Request $request)
    {
        $query = Product::query();
    
        // Filter by price range
        $minPrice = $request->query('minPrice');
        $maxPrice = $request->query('maxPrice');
        if ($minPrice !== null && $maxPrice !== null) {
            $query->whereBetween('price', [(int)$minPrice, (int)$maxPrice]);
        }
    
        // Filter by volume
        $volume = $request->query('volume');
        if ($volume !== null) {
            $query->where('volume', $volume);
        }
    
        // Filter by stock
        $stock = $request->query('stock');
        if ($stock !== null) {
            $query->where('stock', $stock);
        }
    
        // Include users if requested
        $includeUsers = $request->query('includeUsers');
        if ($includeUsers) {
            $query->with('user');
        }
    
        // Paginate the results
        $products = $query->paginate();
        \Log::info('Request data:', $request->query());
        \Log::info('SQL Query:', ['query' => $query->toSql(), 'bindings' => $query->getBindings()]);

        return new ProductCollection($products->appends($request->query()));
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
        // Check if the request is authenticated
        if (!Auth::check()) {
            return response()->json(['message' => 'Unauthenticated'], 401);
        }
        $user = Auth::user();
        $file = $request->file('image');
        $randomName = Str::random(10); // Adjust the length as needed
    
        // Get the current time to append to the filename
        $currentTime = now()->format('YmdHis');
    
        // Get the file extension
        $extension = 'png';
        $imageName = $randomName . '_' . $currentTime . '.' . $extension;
        $storedPath = $file->storeAs('uploads', $imageName, 'public');
        $productData = $request->all();
        $productData['user_id'] = $user->id;
        $productData['image'] = $storedPath;
        $product = Product::create($productData);


        return new ProductResource($product);
    }

    /**
     * Display the specified resource.
     */
    public function show(Product $product)
    {
        $product->load('user'); // Eager load the 'user' relationship

        $productCategory = $product->category;

        // Retrieve similar jobs based on the category of the current job
        $similarProducts = Product::where('category', $productCategory)
        ->where('id', '!=', $product->id) // Exclude the current job
        ->limit(6)
        ->get();

        return response()->json([
            'currentProduct' => new ProductResource($product),
            'similarProducts' => ProductResource::collection($similarProducts)
        ]);
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
        try {
            $data = $request->validated();
            
            // Handle image upload
            if ($request->hasFile('image')) {
                $image = $request->file('image');
                $imageName = $image->getClientOriginalName(); // You may adjust this according to your naming convention
                $imagePath = $image->storeAs('uploads', $imageName, 'public');
                $data['image'] = $imagePath;

                if($job->image){
                    $absolutePath = public_path($job->image);
                    File::delete($absolutePath);
                }
            }
            
            $product->update($data);
            
            return new ProductResource($product);
        } catch (\Exception $e) {
            // Log the error or return it as a response
            return response()->json(['error' => $e->getMessage()], 500);
        }
    }    

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(Product $product)
    {
        $product->delete();

        return response("", 204);

    }
    public function images($productId)
    {
        $product = Product::where('id', $productId)->first();

        \Log::info('Attempting to retrieve product:', ['product' => $product]);


        $imagePath = $product->image;

        \Log::info('Attempting to retrieve image:', ['image' => $imagePath]);

        if (!Storage::disk('public')->exists($imagePath)) {
            \Log::error('File not found:', ['image' => $imagePath]);
            abort(404, 'File not found'); // Or return a suitable error response
        }

        $fileContents = Storage::disk('public')->get($imagePath);
        // Return the file as a response with the appropriate headers
        return response($fileContents, 200)
            ->header('Content-Type', 'image/png')
            ->header('Content-Disposition', 'attachment; filename="' . basename($imagePath) . '"');
    }
}
