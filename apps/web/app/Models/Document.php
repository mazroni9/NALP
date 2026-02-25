<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasMany;

class Document extends Model
{
    protected $fillable = ['name', 'description', 'category_id'];

    public function category(): BelongsTo
    {
        return $this->belongsTo(DataRoomCategory::class, 'category_id');
    }

    public function versions(): HasMany
    {
        return $this->hasMany(DocumentVersion::class)->orderByDesc('version_number');
    }

    public function latestVersion(): HasMany
    {
        return $this->hasMany(DocumentVersion::class)->orderByDesc('version_number')->limit(1);
    }
}
