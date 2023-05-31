<?php

namespace App\Http\Controllers;

use Carbon\Carbon;
use App\Models\Note;
use Inertia\Inertia;
use App\Models\Asset;
use App\Models\Omzet;
use App\Models\Profit;
use App\Models\Product;
use Illuminate\Http\Request;

class ProfitController extends Controller {
    
    public function index(){

        $asset = Asset::all();
        $products = Product::all();
        $omzet = Omzet::orderBy('omzet_time', 'asc')->get();
        // $profit = Profit::orderBy('omzet_time', 'asc')->get();

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
            'modal' => $asset,
            'omzet' => $omzet,
            // 'profit' => $profit,
            'products' => $products,
            'totalProfit_lastMonth' => $totalProfit_lastMonth,
        ]);
    }

    public function predict(){

        $omzet = Omzet::whereBetween('omzet_time', ['2022-01', '2022-12'])->get();
        $asset = Asset::whereBetween('asset_time', ['2022-01', '2022-12'])->get();

        $latest = Omzet::where('omzet_time', 'LIKE', '2022-12%')->get();

        return Inertia::render('Admin/Profit/PredictProfit', [
            'modal' => $asset,
            'omzet' => $omzet,
            'latest' => $latest,
        ]);
    }
}
