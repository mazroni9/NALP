<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Support\Facades\Storage;

class DesignRunFile extends Model
{
    protected $appends = ['url'];

    public function designRun(): BelongsTo
    {
        return $this->belongsTo(DesignRun::class);
    }

    public function getUrlAttribute(): string
    {
        return asset('storage/'.ltrim($this->path, '/'));
    }
}
