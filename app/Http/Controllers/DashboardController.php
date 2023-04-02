<?php

namespace App\Http\Controllers;

use App\Models\Asset;
use App\Models\Note;
use Inertia\Inertia;
use App\Models\Omzet;
use App\Models\Product;
use Illuminate\Http\Request;

class DashboardController extends Controller {
    
    public function index() {
        
        $assets = Asset::all();
        $omzet = Omzet::all();
        // $products = Product::all();
        $notes = Note::with('product')
                ->where('is_finished', 'Y')
                ->orderBy('id', 'asc')
                ->get();

        return Inertia::render('Admin/Dashboard', [
            'notes' => $notes,
            'modal' => $assets,
            // 'products' => $products,
            'omzet' => $omzet,
        ]);
    }
}
