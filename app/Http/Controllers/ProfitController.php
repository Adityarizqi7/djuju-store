<?php

namespace App\Http\Controllers;

use Carbon\Carbon;
use App\Models\Note;
use Inertia\Inertia;
use App\Models\Asset;
use App\Models\Profit;
use App\Models\Product;
use Illuminate\Http\Request;

class ProfitController extends Controller {
    
    public function index(){

        $profit = Profit::all();
        $products = Product::all();

        $now = Carbon::now();
        $lastMonth = $now->subMonth(1);

        $notes = Note::where('is_finished', 'Y')
            ->whereBetween('created_at', [$lastMonth->startOfMonth(), $lastMonth->endOfMonth()])
            ->get();
        $modal = Asset::whereBetween('created_at', [$lastMonth->startOfMonth(), $lastMonth->endOfMonth()])
            ->get();

        $totalOmzet_lastMonth = $notes->sum('initial_price');
        $totalModal_lastMonth = $modal->sum('initial_price');
        $totalProfit_lastMonth = $totalOmzet_lastMonth - $totalModal_lastMonth;

        return Inertia::render('Admin/Profit/Profit', [
            'profit' => $profit,
            'products' => $products,
            'totalProfit_lastMonth' => $totalProfit_lastMonth,
        ]);
    }

    public function predict(){
        $profit = Profit::all();
        $latest = Profit::latest()->first();

        return Inertia::render('Admin/Profit/PredictProfit', [
            'profit' => $profit,
            'latest' => $latest,
        ]);
    }

    public function store(Request $request) {

        $request->validate([    
            'profit_time' => 'required|unique:profits,profit_time',
            'profit_amount' => 'numeric|required|regex:/^(?!0+$)[0-9]+$/',
        ], [
            'profit_time.required' => 'Kolom Bulan dan Tahun tidak boleh kosong.',
            'profit_time.unique' => 'Kolom Bulan dan Tahun sudah terdapat pada daftar',
            'profit_amount.required' => 'Kolom Harga Kulak tidak boleh kosong.',
            'profit_amount.numeric' => 'Kolom Harga Kulak harus berupa angka.',
            'profit_amount.regex' => 'Inputan Harga Kulak tidak sesuai dengan validasi yang diminta.',
        ]);
        
        Profit::create([
            'profit_time' => $request->profit_time,
            'profit_amount' => $request->profit_amount,
        ]);

        return redirect()->route('profit.dashboard');
    }

    public function show($id) {

        $profit = Profit::findOrFail($id);

        return Inertia::render('Admin/Profit/ShowProfit', [
            'profit' => $profit,
        ]);
    }

    public function update(Request $request, $id) {
        $request->validate([    
            'profit_time' => 'required',
            'profit_amount' => 'numeric|required|regex:/^(?!0+$)[0-9]+$/',
        ], [
            'profit_time.required' => 'Kolom Bulan dan Tahun tidak boleh kosong.',
            'profit_amount.required' => 'Kolom Harga Kulak tidak boleh kosong.',
            'profit_amount.numeric' => 'Kolom Harga Kulak harus berupa angka.',
            'profit_amount.regex' => 'Inputan Harga Kulak tidak sesuai dengan validasi yang diminta.',
        ]);

        $profit = Profit::findOrFail($id);

        $profit_data = [
            'profit_time' => $request->profit_time,
            'profit_amount' => $request->profit_amount,
        ];
        
        $profit->update($profit_data);
    }

    public function delete($id) {
        Profit::destroy($id);
        return redirect()->route('profit.dashboard');
    }
}
