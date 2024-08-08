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
        if (is_numeric($minPrice) && is_numeric($maxPrice)) {
            $minPrice = (int)$minPrice;
            $maxPrice = (int)$maxPrice;
            $query->whereBetween('price', [$minPrice, $maxPrice]);
        }
    
        // Filter by volume range
        $minVolume = $request->query('minVolume');
        $maxVolume = $request->query('maxVolume');
        if (is_numeric($minVolume) && is_numeric($maxVolume)) {
            $minVolume = (int)$minVolume;
            $maxVolume = (int)$maxVolume;
            $query->whereBetween('volume', [$minVolume, $maxVolume]);
        }
    
        // Filter by specific volume
        $volume = $request->query('volume');
        if ($volume !== null) {
            $query->where('volume', $volume);
        }
    
        // Filter by stock
        $stock = $request->query('stock');
        if ($stock !== null) {
            $query->where('stock', $stock);
        }
    
        // Filter by name
        $name = $request->query('name');
        if ($name !== null) {
            $query->where('name', 'like', '%' . $name . '%'); // Partial match
        }
    
        // Include users if requested
        $includeUsers = $request->query('includeUsers');
        if ($includeUsers) {
            $query->with('user');
        }
    
        // Handle trending products or regular products
        $includeTrending = $request->query('includeTrending');
        $includeWine = $request->query('includeWine');
        $includeVodka = $request->query('includeVodka');
        $includeWhisky = $request->query('includeWhisky');
        $includeAllWine = $request->query('includeAllWine');
        $includeWhiteWine = $request->query('includeWhiteWine');
        $includeSpirit = $request->query('includeSpirit');
        $includeSingleMalt = $request->query('includeSingleMalt');
        $includeScotch = $request->query('includeScotch');
        $includeRum = $request->query('includeRum');
        $includeRedWine = $request->query('includeRedWine');
        $includeMixers = $request->query('includeMixers');
        $includeLiqeur = $request->query('includeLiqeur');
        $includeGin = $request->query('includeGin');
        $includeCognac = $request->query('includeCognac');
        $includeBrandy = $request->query('includeBrandy');
        $includeBourbon = $request->query('includeBourbon');
        $includeBeer = $request->query('includeBeer');

        // Check if the user is an admin
        $isAdmin = $request->query('isAdmin');
    
        if ($isAdmin) {
            $query->orderBy('id', 'asc');
            $products = $query->paginate(); // Directly get the results with pagination
        } else {
            if ($includeTrending) {
                $query->inRandomOrder()->limit(5);
                $products = $query->get(); // Directly get the results without pagination
            } elseif ($includeWine) {
                $query->where('category', 'wine')->inRandomOrder()->limit(5); // Adjust according to your column name for wine category
                $products = $query->get(); // Directly get the results without pagination
            }elseif($includeVodka){
                $query->where('category', 'vodka')->inRandomOrder(); // Adjust according to your column name for wine category
                $products = $query->get(); // Directly get the results without pagination
            }elseif($includeWhisky){
                $query->where('category', 'whisky')->inRandomOrder(); // Adjust according to your column name for wine category
                $products = $query->get(); // Directly get the results without pagination
            }elseif($includeAllwine){
                $query->where('category', 'wine')->inRandomOrder(); // Adjust according to your column name for wine category
                $products = $query->get(); // Directly get the results without pagination
            }elseif($includewWhiteWine){
                $query->where('sub_category', 'white_wine')->inRandomOrder(); // Adjust according to your column name for wine category
                $products = $query->get(); // Directly get the results without pagination
            }elseif($includespirit){
                $query->where('category', 'spirit')->inRandomOrder(); // Adjust according to your column name for wine category
                $products = $query->get(); // Directly get the results without pagination
            }elseif($includeSingleMalt){
                $query->where('sub_category', 'single_malt')->inRandomOrder(); // Adjust according to your column name for wine category
                $products = $query->get(); // Directly get the results without pagination
            }elseif($includeScotch){
                $query->where('sub_category', 'scotch')->inRandomOrder(); // Adjust according to your column name for wine category
                $products = $query->get(); // Directly get the results without pagination
            }elseif($includeRum){
                $query->where('category', 'rum')->inRandomOrder(); // Adjust according to your column name for wine category
                $products = $query->get(); // Directly get the results without pagination
            }elseif($includeRedWine){
                $query->where('sub_category', 'red_whine')->inRandomOrder(); // Adjust according to your column name for wine category
                $products = $query->get(); // Directly get the results without pagination
            }elseif($includeMixers){
                $query->where('category', 'mixers')->inRandomOrder(); // Adjust according to your column name for wine category
                $products = $query->get(); // Directly get the results without pagination
            }elseif($includeLiquer){
                $query->where('category', 'liqeur')->inRandomOrder(); // Adjust according to your column name for wine category
                $products = $query->get(); // Directly get the results without pagination
            }elseif($includeGin){
                $query->where('category', 'gin')->inRandomOrder(); // Adjust according to your column name for wine category
                $products = $query->get(); // Directly get the results without pagination
            }elseif($includeCognac){
                $query->where('category', 'cognac')->inRandomOrder(); // Adjust according to your column name for wine category
                $products = $query->get(); // Directly get the results without pagination
            }elseif($includeBrandy){
                $query->where('category', 'whisky')->inRandomOrder(); // Adjust according to your column name for wine category
                $products = $query->get(); //brandyDirectly get the results without pagination
            }elseif($includeBourbon){
                $query->where('category', 'bourbon')->inRandomOrder(); // Adjust according to your column name for wine category
                $products = $query->get(); // Directly get the results without pagination
            }elseif($includeBeer){
                $query->where('category', 'beer')->inRandomOrder(); // Adjust according to your column name for wine category
                $products = $query->get(); // Directly get the results without pagination
            }
             else {
                $query->inRandomOrder();
                $products = $query->paginate();
                $products->appends($request->query()); // Add query parameters to the pagination links
            }
        }
    
        \Log::info('Request data:', $request->query());
        \Log::info('SQL Query:', ['query' => $query->toSql(), 'bindings' => $query->getBindings()]);
    
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
    public function images(Request $request)
    {
        \Log::info('Request payload:', $request->all());

        $productIds = $request->input('product_ids', []);
        \Log::info('These are the ProductIds:', $productIds );

        if (!is_array($productIds)) {
            return response()->json(['message' => 'Invalid product IDs'], 400);
        }
    
        $images = [];
    
        foreach ($productIds as $productId) {
            $product = Product::find($productId); // Use find to return null if not found
    
            if ($product) {
                $imagePath = $product->image;
    
                if (Storage::disk('public')->exists($imagePath)) {
                    $fileContents = Storage::disk('public')->get($imagePath);
                    $base64Image = base64_encode($fileContents);
                    $images[$productId] = 'data:image/png;base64,' . $base64Image;
                } else {
                    $images[$productId] = null;
                }
            } else {
                $images[$productId] = null;
            }
        }
    
        return response()->json($images);
    }
    

}
