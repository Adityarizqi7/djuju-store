<?php

namespace App\Http\Controllers;

use Carbon\Carbon;
use App\Models\Note;
use Inertia\Inertia;
use App\Models\Product;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;

class NotesController extends Controller {
    
    public function index() {

        $products = Product::all();
        $all_note = Note::with('product')
                ->where('is_session', 'Y')
                ->where('is_finished', 'N')
                ->get();

        return Inertia::render('Admin/Note/Note', [
            'notes' => $all_note,
            'products' => $products,
        ]);
        
    }

    public function store(Request $request) {

        $request->validate([    
            'product_id' => 'required|regex:/^[0-9]+$/|exists:products,id',
            'purchase_amount' => 'numeric|required|regex:/^(?!0+$)[0-9]+$/',
        ], [
            'product_id.required' => 'Kolom Kode Barang Tidak Boleh Kosong.',
            'product_id.exists' => 'Barang tidak tersedia dan belum dimasukkan pada daftar barang.',
            'product_id.regex' => 'Inputan Kode Barang tidak sesuai dengan validasi yang diminta.',
            'purchase_amount.required' => 'Kolom Jumlah Barang tidak boleh kosong.',
            'purchase_amount.numeric' => 'Kolom Jumlah Barang harus berupa angka.',
            'purchase_amount.regex' => 'Inputan Jumlah Barang tidak sesuai dengan validasi yang diminta.',
        ]);

        try {
            DB::beginTransaction();

            $product = Product::find($request->product_id);
            $purchaseAmount = $request->purchase_amount;
            $currentStock = $product->stock;
            
            $newStock = $currentStock - $purchaseAmount;
            $product->update(['stock' => $newStock]);
            
            Note::create([
                'product_id' => $request->product_id,
                'code_record' => $request->code_record,
                'purchase_amount' => $purchaseAmount,
                'is_saved' => 'N',
                'is_session' => 'Y',
                'is_finished' => 'N',
            ]);            

            DB::commit();
        } catch (\Exception $e) {
            DB::rollback();
            throw new \Exception($e->getMessage());
        }

        return redirect()->route('note.dashboard');
    }

    public function update_purchase_amount(Request $request, $id) {
        $request->validate([    
            'purchase_amount' => 'numeric|regex:/^(?!0+$)[0-9]+$/',
        ], [
            'purchase_amount.numeric' => 'Kolom Jumlah Barang harus berupa angka.',
            'purchase_amount.regex' => 'Inputan Jumlah Barang tidak sesuai dengan validasi yang diminta.',
        ]);

        try {
            DB::beginTransaction();
            
            $note = Note::findOrFail($id);
            $oldPurchaseAmount = $note->purchase_amount;

            $note_data = [
                'purchase_amount' => $request->purchase_amount,
            ];
    
            $note->update($note_data);

            $newPurchaseAmount = $note->purchase_amount;
            $purchaseAmountChange = $newPurchaseAmount - $oldPurchaseAmount;

            $productId = $note->product_id;
            $product = Product::findOrFail($productId);
            $oldStock = $product->stock;

            $newStock = $oldStock - $purchaseAmountChange;

            $product->update(['stock' => $newStock]);

            DB::commit();
        } catch (\Exception $e) {
            DB::rollback();
            throw new \Exception($e->getMessage());
        }

        return redirect()->route('note.dashboard');
    }

    public function saved(Request $request, $id) {
        $request->validate([    
            'cost_subtotal' => 'numeric',
        ], [
            'cost_subtotal.numeric' => 'Kolom Jumlah Barang harus berupa angka.',
        ]);

        $note = Note::findOrFail($id);

        $note_data = [
            'cost_subtotal' => $note->purchase_amount * $note->product->sell_price,
            'is_saved' => 'Y',
        ];

        try {
            DB::beginTransaction();

            $note->update($note_data);

            DB::commit();
        } catch (\Exception $e) {
            DB::rollback();
            throw new \Exception($e->getMessage());
        }


        return redirect()->route('note.dashboard');
    }

    public function returned_saved(Request $request, $id) {
        $request->validate([    
            'cost_subtotal' => 'numeric',
        ], [
            'cost_subtotal.numeric' => 'Kolom Jumlah Barang harus berupa angka.',
        ]);

        $note = Note::findOrFail($id);

        $note_data = [
            'cost_subtotal' => $note->purchase_amount * $note->product->sell_price,
            'is_saved' => 'N',
        ];

        try {
            DB::beginTransaction();

            $note->update($note_data);

            DB::commit();
        } catch (\Exception $e) {
            DB::rollback();
            throw new \Exception($e->getMessage());
        }


        return redirect()->route('note.dashboard');
    }

    public function finished(Request $request) {
        
        $request->validate([
            'cost_total' => 'numeric',
        ], [
            'cost_total.numeric' => 'Kolom Total Harga Barang harus berupa angka saja.',
        ]);
        
        $cost_subtotal = Note::where([
            ['is_saved', '=', 'Y'],
            ['is_session', '=', 'Y'],
            ['is_finished', '=', 'N']
        ])->sum('cost_subtotal');
        $int_costSubtotal = intval($cost_subtotal);
        
        $note_id = Note::where([
            ['is_saved', '=', 'Y'],
            ['is_session', '=', 'Y']
        ])->pluck('id');
        
        $note_data = [
            'is_session' => 'N',
            'is_finished' => 'Y',
            'cost_total' => $int_costSubtotal,
            'transaction_order' => $request->transaction_order,
            'created_transaction_at' => $request->created_transaction_at,
        ];

        DB::beginTransaction();
        
        try {
            $note = Note::whereIn('id', $note_id->toArray())->update($note_data);
            DB::commit();
        } catch (\Exception $e) {
            DB::rollback();
            throw new \Exception($e->getMessage());
        }

        return redirect()->route('note.dashboard');
    }

    public function delete($id) {

        $note = Note::findOrFail($id);
        $product = $note->product;
        $purchaseAmount = $note->purchase_amount;

        $newStock = $product->stock + $purchaseAmount;
        $product->update(['stock' => $newStock]);

        Note::destroy($id);

        return redirect()->route('note.dashboard');
    }
}