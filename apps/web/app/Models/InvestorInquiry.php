<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class InvestorInquiry extends Model
{
    protected $fillable = ['name', 'email', 'company', 'message', 'type', 'status', 'request_nda', 'request_type'];
}
