<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Medicament extends Model
{
    use HasFactory;

    protected $fillable = [
        'nom',
        'description',
        'dosage',
        'prix',
        'groupe',
        'stock',
        'images'
    ];

    protected $casts = [
        'images' => 'array', 
    ];
}