<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasMany;

class DesignRun extends Model
{
    protected $casts = [
        'inputs' => 'array',
        'outputs' => 'array',
    ];

    public function user(): BelongsTo
    {
        return $this->belongsTo(User::class);
    }

    public function files(): HasMany
    {
        return $this->hasMany(DesignRunFile::class);
    }

    public function getGlbFileAttribute(): ?DesignRunFile
    {
        return $this->files()->where('type', 'glb')->first();
    }

    public function getPngFilesAttribute()
    {
        return $this->files()->where('type', 'png')->get();
    }
}
