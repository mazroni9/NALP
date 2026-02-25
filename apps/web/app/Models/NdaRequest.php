<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class NdaRequest extends Model
{
    protected $fillable = ['name', 'email', 'company', 'phone', 'purpose', 'status'];
}
