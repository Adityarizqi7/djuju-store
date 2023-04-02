<?php

namespace App\Http\Controllers;

use Carbon\Carbon;
use App\Models\Note;
use Inertia\Inertia;
use App\Models\Omzet;
use App\Models\Product;
use Illuminate\Http\Request;

class OmzetController extends Controller {
    
    public function index(){

        $omzet = Omzet::all();
        $products = Product::all();

        $now = Carbon::now();
        $lastMonth = $now->subMonth(1);

        $notes = Note::where('is_finished', 'Y')
            ->whereBetween('created_at', [$lastMonth->startOfMonth(), $lastMonth->endOfMonth()])
            ->get();
        $totalCostSubtotal_lastMonth = $notes->sum('cost_subtotal');

        return Inertia::render('Admin/Omzet/Omzet', [
            'omzet' => $omzet,
            'products' => $products,
            'totalCostSubtotal_lastMonth' => $totalCostSubtotal_lastMonth,
        ]);
    }

    public function predict(){
        $omzet = Omzet::all();
        $latest = Omzet::latest()->first();

        return Inertia::render('Admin/Omzet/PredictOmzet', [
            'omzet' => $omzet,
            'latest' => $latest,
        ]);
    }

    public function store(Request $request) {

        $request->validate([    
            'omzet_time' => 'required|unique:omzets,omzet_time',
            'omzet_amount' => 'numeric|required|regex:/^(?!0+$)[0-9]+$/',
        ], [
            'omzet_time.required' => 'Kolom Bulan dan Tahun tidak boleh kosong.',
            'omzet_time.unique' => 'Kolom Bulan dan Tahun sudah terdapat pada daftar',
            'omzet_amount.required' => 'Kolom Harga Kulak tidak boleh kosong.',
            'omzet_amount.numeric' => 'Kolom Harga Kulak harus berupa angka.',
            'omzet_amount.regex' => 'Inputan Harga Kulak tidak sesuai dengan validasi yang diminta.',
        ]);
        
        Omzet::create([
            'omzet_time' => $request->omzet_time,
            'omzet_amount' => $request->omzet_amount,
        ]);

        return redirect()->route('omzet.dashboard');
    }

    public function show($id) {

        $omzet = Omzet::findOrFail($id);

        return Inertia::render('Admin/Omzet/ShowOmzet', [
            'omzet' => $omzet,
        ]);
    }

    public function update(Request $request, $id) {
        $request->validate([    
            'omzet_time' => 'required',
            'omzet_amount' => 'numeric|required|regex:/^(?!0+$)[0-9]+$/',
        ], [
            'omzet_time.required' => 'Kolom Bulan dan Tahun tidak boleh kosong.',
            'omzet_amount.required' => 'Kolom Harga Kulak tidak boleh kosong.',
            'omzet_amount.numeric' => 'Kolom Harga Kulak harus berupa angka.',
            'omzet_amount.regex' => 'Inputan Harga Kulak tidak sesuai dengan validasi yang diminta.',
        ]);

        $omzet = Omzet::findOrFail($id);

        $omzet_data = [
            'omzet_time' => $request->omzet_time,
            'omzet_amount' => $request->omzet_amount,
        ];
        
        $omzet->update($omzet_data);
    }

    public function delete($id) {
        Omzet::destroy($id);
        return redirect()->route('omzet.dashboard');
    }
}
