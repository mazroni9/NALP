<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\DataRoomCategory;
use App\Models\Document;
use App\Models\DocumentVersion;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Storage;
use Inertia\Inertia;

class DataRoomUploadController extends Controller
{
    public function index()
    {
        $categories = DataRoomCategory::with('documents')->orderBy('order')->get();
        $documents = Document::with(['category', 'versions'])->get();

        return Inertia::render('Admin/DataRoomUpload', [
            'categories' => $categories,
            'documents' => $documents,
        ]);
    }

    public function upload(Request $request): RedirectResponse
    {
        $validated = $request->validate([
            'name' => 'required|string|max:255',
            'description' => 'nullable|string',
            'category_id' => 'nullable|exists:data_room_categories,id',
            'file' => 'required|file',
        ]);

        $file = $request->file('file');
        $disk = Storage::disk('data-room');

        $dir = 'documents';
        $filename = time() . '_' . preg_replace('/[^a-zA-Z0-9._-]/', '_', $file->getClientOriginalName());
        $path = $file->storeAs($dir, $filename, 'data-room');

        $document = Document::create([
            'name' => $validated['name'],
            'description' => $validated['description'] ?? null,
            'category_id' => $validated['category_id'] ?? null,
        ]);

        DocumentVersion::create([
            'document_id' => $document->id,
            'version_number' => 1,
            'file_path' => $path,
            'file_name' => $file->getClientOriginalName(),
            'file_size' => $file->getSize(),
            'mime_type' => $file->getMimeType(),
        ]);

        return back()->with('success', 'Document uploaded.');
    }
}
