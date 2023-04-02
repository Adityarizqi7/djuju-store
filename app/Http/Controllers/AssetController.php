<?php

namespace App\Http\Controllers;

use Inertia\Inertia;
use App\Models\Asset;
use App\Models\Product;
use Illuminate\Http\Request;

class AssetController extends Controller {

    public function index(){

        $products = Product::all();
        $asset = Asset::with('product')->get();

        return Inertia::render('Admin/Modal/Asset', [
            'modal' => $asset,
            'products' => $products,
        ]);
    }

    public function store(Request $request) {

        if ($request->product_id == '') {
            $request->validate([    
                'product_name' => 'required',
                'asset_time' => 'required',
                'initial_price' => 'numeric|required|regex:/^(?!0+$)[0-9]+$/',
                'purchase_amount' => 'numeric|required|regex:/^(?!0+$)[0-9]+$/',
                'cost_total' => 'numeric|required|regex:/^(?!0+$)[0-9]+$/',
            ], [
                'product_name.required' => 'Kolom Nama Barang tidak boleh kosong.',
                'asset_time.required' => 'Kolom Bulan dan Tahun tidak boleh kosong.',
                'initial_price.required' => 'Kolom Harga Awal tidak boleh kosong.',
                'initial_price.numeric' => 'Kolom Harga Awal harus berupa angka.',
                'initial_price.regex' => 'Inputan Harga Awal tidak sesuai dengan validasi yang diminta.',
                'purchase_amount.required' => 'Kolom Jumlah Kulakan Barang tidak boleh kosong.',
                'purchase_amount.numeric' => 'Kolom Jumlah Kulakan Barang harus berupa angka.',
                'purchase_amount.regex' => 'Inputan Jumlah Kulakan Barang tidak sesuai dengan validasi yang diminta.',
                'cost_total.required' => 'Kolom Total Harga Kulak Barang tidak boleh kosong.',
                'cost_total.numeric' => 'Kolom Total Harga Kulak Barang harus berupa angka.',
                'cost_total.regex' => 'Inputan Total Harga Kulak Barang tidak sesuai dengan validasi yang diminta.',
            ]);
            
            Asset::create([
                'product_name' => $request->product_name,
                'initial_price' => $request->initial_price,
                'purchase_amount' => $request->purchase_amount,
                'cost_total' => $request->cost_total,
                'product_id' => null,
                'asset_time' => $request->asset_time,
            ]);
        }
        if($request->product_name == '') {
            $request->validate([    
                'product_id' => 'regex:/^[0-9]+$/|exists:products,id',
                'asset_time' => 'required',
                'initial_price' => 'numeric|required|regex:/^(?!0+$)[0-9]+$/',
                'purchase_amount' => 'numeric|required|regex:/^(?!0+$)[0-9]+$/',
                'cost_total' => 'numeric|required|regex:/^(?!0+$)[0-9]+$/',
            ], [
                'product_id.exists' => 'Barang tidak tersedia dan belum dimasukkan pada daftar barang.',
                'product_id.regex' => 'Inputan ID Barang tidak sesuai dengan validasi yang diminta.',
                'asset_time.required' => 'Kolom Bulan dan Tahun tidak boleh kosong.',
                'initial_price.required' => 'Kolom Harga Kulak tidak boleh kosong.',
                'initial_price.numeric' => 'Kolom Harga Kulak harus berupa angka.',
                'initial_price.regex' => 'Inputan Harga Kulak tidak sesuai dengan validasi yang diminta.',
                'purchase_amount.required' => 'Kolom Jumlah Kulakan Barang tidak boleh kosong.',
                'purchase_amount.numeric' => 'Kolom Jumlah Kulakan Barang harus berupa angka.',
                'purchase_amount.regex' => 'Inputan Jumlah Kulakan Barang tidak sesuai dengan validasi yang diminta.',
                'cost_total.required' => 'Kolom Total Harga Kulak Barang tidak boleh kosong.',
                'cost_total.numeric' => 'Kolom Total Harga Kulak Barang harus berupa angka.',
                'cost_total.regex' => 'Inputan Total Harga Kulak Barang tidak sesuai dengan validasi yang diminta.',
            ]);
            
            Asset::create([
                'product_id' => $request->product_id,
                'purchase_amount' => $request->purchase_amount,
                'cost_total' => $request->cost_total,
                'product_name' => null,
                'initial_price' => $request->initial_price,
                'asset_time' => $request->asset_time,
            ]);
             
        }

        return redirect()->route('asset.dashboard');
    }

    public function show($id) {

        $products = Product::all();
        $asset = Asset::findOrFail($id);

        return Inertia::render('Admin/Modal/ShowAsset', [
            'modal' => $asset,
            'products' => $products,
        ]);
    }

    public function update(Request $request, $id) {
        
        if($request->product_name == '') {
            $request->validate([    
                'product_id' => 'regex:/^[0-9]+$/|exists:products,id',
                'asset_time' => 'required',
                'initial_price' => 'numeric|required|regex:/^(?!0+$)[0-9]+$/',
                'purchase_amount' => 'numeric|required|regex:/^(?!0+$)[0-9]+$/',
                'cost_total' => 'numeric|required|regex:/^(?!0+$)[0-9]+$/',
            ], [
                'product_id.exists' => 'Barang tidak tersedia dan belum dimasukkan pada daftar barang.',
                'product_id.regex' => 'Inputan Kode Barang tidak sesuai dengan validasi yang diminta.',
                'asset_time.required' => 'Kolom Bulan dan Tahun tidak boleh kosong.',
                'initial_price.required' => 'Kolom Harga Awal tidak boleh kosong.',
                'initial_price.numeric' => 'Kolom Harga Awal harus berupa angka.',
                'initial_price.regex' => 'Inputan Harga Awal tidak sesuai dengan validasi yang diminta.',
                'purchase_amount.required' => 'Kolom Jumlah Kulakan Barang tidak boleh kosong.',
                'purchase_amount.numeric' => 'Kolom Jumlah Kulakan Barang harus berupa angka.',
                'purchase_amount.regex' => 'Inputan Jumlah Kulakan Barang tidak sesuai dengan validasi yang diminta.',
                'cost_total.required' => 'Kolom Total Harga Kulak Barang tidak boleh kosong.',
                'cost_total.numeric' => 'Kolom Total Harga Kulak Barang harus berupa angka.',
                'cost_total.regex' => 'Inputan Total Harga Kulak Barang tidak sesuai dengan validasi yang diminta.',
            ]);
            
            $asset = Asset::findOrFail($id);

            $asset_data = [
                'product_id' => $request->product_id,
                'purchase_amount' => $request->purchase_amount,
                'cost_total' => $request->cost_total,
                'product_name' => null,
                'asset_time' => $request->asset_time,
                'initial_price' => $request->initial_price,
            ];
            
            $asset->update($asset_data);
        }

        if($request->product_id == '') {
            $request->validate([    
                'product_name' => 'required',
                'asset_time' => 'required',
                'initial_price' => 'numeric|required|regex:/^(?!0+$)[0-9]+$/',
                'purchase_amount' => 'numeric|required|regex:/^(?!0+$)[0-9]+$/',
                'cost_total' => 'numeric|required|regex:/^(?!0+$)[0-9]+$/',
            ], [
                'product_name.required' => 'Kolom Nama Barang tidak boleh kosong.',
                'asset_time.required' => 'Kolom Bulan dan Tahun tidak boleh kosong.',
                'initial_price.required' => 'Kolom Harga Awal tidak boleh kosong.',
                'initial_price.numeric' => 'Kolom Harga Awal harus berupa angka.',
                'initial_price.regex' => 'Inputan Harga Awal tidak sesuai dengan validasi yang diminta.',
                'purchase_amount.required' => 'Kolom Jumlah Kulakan Barang tidak boleh kosong.',
                'purchase_amount.numeric' => 'Kolom Jumlah Kulakan Barang harus berupa angka.',
                'purchase_amount.regex' => 'Inputan Jumlah Kulakan Barang tidak sesuai dengan validasi yang diminta.',
                'cost_total.required' => 'Kolom Total Harga Kulak Barang tidak boleh kosong.',
                'cost_total.numeric' => 'Kolom Total Harga Kulak Barang harus berupa angka.',
                'cost_total.regex' => 'Inputan Total Harga Kulak Barang tidak sesuai dengan validasi yang diminta.',
            ]);
            
            $asset = Asset::findOrFail($id);

            $asset_data = [
                'product_id' => null,
                'product_name' => $request->product_name,
                'purchase_amount' => $request->purchase_amount,
                'cost_total' => $request->cost_total,
                'asset_time' => $request->asset_time,
                'initial_price' => $request->initial_price,
            ];
            
            $asset->update($asset_data);
        }

        return back();
    }

    public function delete($id) {
        Asset::destroy($id);
        return redirect()->route('asset.dashboard');
    }
}