<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Support\Facades\Storage;

class DocumentVersion extends Model
{
    protected $fillable = ['document_id', 'version_number', 'file_path', 'file_name', 'file_size', 'mime_type'];

    public function document(): BelongsTo
    {
        return $this->belongsTo(Document::class);
    }

    public function getUrlAttribute(): string
    {
        return Storage::disk('data-room')->url($this->file_path);
    }
}
