<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Document;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Storage;

class DataRoomController extends Controller
{
    public function __construct()
    {
        $this->middleware('auth:sanctum');
    }

    public function index(Request $request)
    {
        $documents = Document::with(['category', 'versions'])
            ->whereHas('versions')
            ->get();

        return response()->json(['documents' => $documents]);
    }

    public function download(Request $request, Document $document)
    {
        $doc = $document;
        $version = $doc->versions()->orderByDesc('version_number')->first();

        if (! $version) {
            abort(404);
        }

        $path = $version->file_path;
        if (! Storage::disk('local')->exists($path)) {
            abort(404);
        }

        return Storage::disk('local')->download(
            $path,
            $version->file_name
        );
    }
}
