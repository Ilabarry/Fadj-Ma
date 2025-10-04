<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Medicament;
use App\Models\User;

class DashboardController extends Controller
{
    public function stats()
    {
        try {
            return response()->json([
                'medicaments_total' => Medicament::count(),
                'groupes_total' => Medicament::distinct('groupe')->count('groupe'),
                'medicaments_disponibles' => Medicament::where('stock', '>', 0)->count(),
                'utilisateurs_total' => User::count(),
            ]);
        } catch (\Exception $e) {
            return response()->json([
                'medicaments_total' => 0,
                'groupes_total' => 0,
                'medicaments_disponibles' => 0,
                'utilisateurs_total' => 0,
            ]);
        }
    }
}