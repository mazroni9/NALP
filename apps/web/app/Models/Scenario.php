<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class Scenario extends Model
{
    protected $fillable = [
        'name', 'occupancy', 'bed_rate', 'opex_cap', 'land_exit_price', 'extra_params',
    ];

    protected $casts = [
        'extra_params' => 'array',
    ];

    public function user(): BelongsTo
    {
        return $this->belongsTo(User::class);
    }
}
