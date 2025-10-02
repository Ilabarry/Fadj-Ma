<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Medicament;
use Illuminate\Http\Request;

class MedicamentController extends Controller
{
    public function index()
    {
        return response()->json(Medicament::all());
    }

    public function store(Request $request)
    {
        $data = $request->validate([
            'nom' => 'required|string|max:255',
            'description' => 'required|string',
            'dosage' => 'required|string|max:255',
            'prix' => 'required|numeric',
            'groupe' => 'required|string|max:255',
            'stock' => 'required|integer',
            'images.*' => 'nullable|image|mimes:jpg,jpeg,png,webp|max:2048',
        ]);

        $images = [];
        if ($request->hasFile('images')) {
            foreach ($request->file('images') as $file) {
                if (count($images) < 6) {
                    $images[] = $file->store('medicaments', 'public');
                }
            }
        }

        $data['images'] = $images; // tableau → JSON (via cast du model)

        $medicament = Medicament::create($data);

        return response()->json($medicament, 201);
    }


    public function show($id)
    {
        return response()->json(Medicament::findOrFail($id));
    }

    public function update(Request $request, $id)
    {
        $medicament = Medicament::findOrFail($id);

        $data = $request->validate([
            'nom' => 'sometimes|string|max:255',
            'description' => 'sometimes|string',
            'dosage' => 'sometimes|string|max:255',
            'prix' => 'sometimes|numeric',
            'groupe' => 'sometimes|string|max:255',
            'stock' => 'sometimes|integer',
            'images.*' => 'nullable|image|mimes:jpg,jpeg,png|max:2048',
        ]);

        $images = $medicament->images ?? [];

        if ($request->hasFile('images')) {
            foreach ($request->file('images') as $file) {
                if (count($images) < 6) {
                    $images[] = $file->store('medicaments', 'public');
                }
            }
        }
        $data['images'] = $images;

        $medicament->update($data);

        return response()->json($medicament);
    }


    public function destroy($id)
    {
        Medicament::destroy($id);

        return response()->json(['message' => 'Médicament supprimé']);
    }
}