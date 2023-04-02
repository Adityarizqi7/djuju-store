<?php

namespace App\Http\Controllers;

use Inertia\Inertia;
use App\Models\Product;
use Illuminate\Http\Request;

class ProductsController extends Controller
{
    public function index() {

        $all_product = Product::orderBy('name', 'asc')->paginate(8);
        return Inertia::render('Admin/Product/Product', [
            'products' => $all_product,
        ]);
    }

    public function create() {
        $latestRecord = Product::latest()->first();
        return Inertia::render('Admin/Product/CreateProduct', [
            'latestRecord' => $latestRecord
        ]);
    }

    public function store(Request $request) {
        $request->validate([
            'name' => 'required|unique:products,name',
            'product_code' => 'required|unique:products,product_code',
            'sell_price' => 'numeric|required|regex:/^(?!0+$)[0-9]+$/',
            'initial_price' => 'numeric|required|regex:/^(?!0+$)[0-9]+$/',
            'unit' => 'required',
            'stock' => 'numeric|required|regex:/^[0-9]+$/',
        ], [
            'name.required' => 'Kolom Nama Barang Tidak Boleh Kosong.',
            'name.unique' => 'Kolom Nama Barang sudah terdapat pada daftar barang.',
            'product_code.required' => 'Kolom Kode Barang Tidak Boleh Kosong.',
            'product_code.unique' => 'Kolom Kode Barang sudah terdapat pada daftar barang.',
            'sell_price.required' => 'Kolom Harga Jual tidak boleh kosong.',
            'sell_price.numeric' => 'Kolom Harga Jual harus berupa angka.',
            'sell_price.regex' => 'Inputan Harga Jual tidak sesuai dengan validasi yang diminta.',
            'initial_price.required' => 'Kolom Harga Awal tidak boleh kosong.',
            'initial_price.numeric' => 'Kolom Harga Awal harus berupa angka.',
            'initial_price.regex' => 'Inputan Harga Awal tidak sesuai dengan validasi yang diminta.',
            'unit.required' => 'Kolom Satuan Barang Tidak Boleh Kosong.',
            'stock.required' => 'Kolom Harga Awal tidak boleh kosong.',
            'stock.numeric' => 'Kolom Harga Awal harus berupa angka.',
            'stock.regex' => 'Inputan Harga Awal tidak sesuai dengan validasi yang diminta.',
        ]);

        Product::create([
            'name' => $request->name,
            'unit' => $request->unit,
            'stock' => $request->stock,
            'product_code' => $request->product_code,
            'sell_price' => $request->sell_price,
            'initial_price' => $request->initial_price,
        ]);

        return redirect()->route('product.create');
    }

    public function show($id) {
        $product = Product::findOrFail($id);

        return Inertia::render('Admin/Product/ShowProduct', [
            'product' => $product
        ]);
    }

    public function update(Request $request, $id) {
        $request->validate([
            'name' => 'required',
            'unit' => 'required',
            'sell_price' => 'numeric|required|regex:/^(?!0+$)[0-9]+$/',
            'initial_price' => 'numeric|required|regex:/^(?!0+$)[0-9]+$/',
            'stock' => 'numeric|required|regex:/^(?!0+$)[0-9]+$/',
        ], [
            'name.required' => 'Kolom Nama Barang Tidak Boleh Kosong.',
            'unit.required' => 'Kolom Unit Barang Tidak Boleh Kosong.',
            'sell_price.required' => 'Kolom Harga Jual tidak boleh kosong.',
            'sell_price.numeric' => 'Kolom Harga Jual harus berupa angka.',
            'sell_price.regex' => 'Inputan Harga Jual tidak sesuai dengan validasi yang diminta.',
            'initial_price.required' => 'Kolom Harga Awal tidak boleh kosong.',
            'initial_price.numeric' => 'Kolom Harga Awal harus berupa angka.',
            'initial_price.regex' => 'Inputan Harga Awal tidak sesuai dengan validasi yang diminta.',
            'stock.required' => 'Kolom Harga Awal tidak boleh kosong.',
            'stock.numeric' => 'Kolom Harga Awal harus berupa angka.',
            'stock.regex' => 'Inputan Harga Awal tidak sesuai dengan validasi yang diminta.',
        ]);

        $product = Product::findOrFail($id);

        $product_data = [
            'name' => $request->name,
            'unit' => $request->unit,
            'stock' => $request->stock,
            'sell_price' => $request->sell_price,
            'initial_price' => $request->initial_price,
        ];

        $product->update($product_data);

        return back();
    }

    public function delete($id) {
        Product::destroy($id);
        return redirect()->route('product.dashboard');
    }
}
