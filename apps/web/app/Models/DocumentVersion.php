<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Support\Facades\Storage;

class DocumentVersion extends Model
{
    public function document(): BelongsTo
    {
        return $this->belongsTo(Document::class);
    }

    public function getUrlAttribute(): string
    {
        return Storage::disk('local')->url($this->file_path);
    }
}
