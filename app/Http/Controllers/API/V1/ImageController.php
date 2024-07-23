<?php

namespace App\Http\Controllers\API\V1;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Storage;
use Illuminate\Http\Response;

class ImageController extends Controller
{
    public function show($image)
    {
        $imagePath = 'uploads/'.$image;

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
