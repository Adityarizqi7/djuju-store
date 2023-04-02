<?php

namespace App\Http\Controllers;

use App\Models\User;
use Inertia\Inertia;
use Illuminate\Http\Request;
use Illuminate\Validation\Rules;
use Illuminate\Support\Facades\Hash;
use Illuminate\Http\RedirectResponse;
use Illuminate\Auth\Events\Registered;

class UserController extends Controller {
    
    public function index() {
        $users = User::all();
        return Inertia::render('Admin/User/User', [
            'users' => $users,
        ]);
    }

    public function create() {
        $latestRecord = User::latest()->first();
        return Inertia::render('Admin/User/Registration', [
            'latestRecord' => $latestRecord
        ]);
    }

    /**
     * Handle an incoming registration request.
     *
     * @throws \Illuminate\Validation\ValidationException
     */
    public function store(Request $request): RedirectResponse {
        $request->validate([
            'name' => 'required|string',
            'email' => 'required|string|email|unique:'.User::class,
            'password' => ['required', 'min:8', 'confirmed', Rules\Password::defaults()],
            'phone' => 'max:12|min:10|unique:'.User::class,
            'address' => 'string',
            'role' => 'string|required',
        ], [
            'name.required' => 'Kolom Nama Pengguna Tidak Boleh Kosong.',
            'email.required' => 'Kolom Email Tidak Boleh Kosong.',
            'email.unique' => 'Kolom Email sudah terdapat pada daftar pengguna.',
            'email.email' => 'Kolom Email harus berupa email yang valid.',
            'password.required' => 'Kolom Password Tidak Boleh Kosong.',
            'password.min' => 'Kolom Password harus memiliki minimal 8 Karakter.',
            'phone.max' => 'Kolom Nomor Telepon tidak boleh lebih dari 12 digit.',
            'phone.min' => 'Kolom Nomor Telepon harus memiliki minimal 10 digit.',
            'phone.email' => 'Kolom Nomor Telepon sudah terdapat pada daftar pengguna.',
            'role.required' => 'Kolom Role Pengguna Tidak Boleh Kosong.',
        ]);

        $user = User::create([
            'name' => $request->name,
            'email' => $request->email,
            'password' => Hash::make($request->password),
            'phone' => $request->phone,
            'address' => $request->address,
            'role' => $request->role,
        ]);

        event(new Registered($user));

        return redirect()->route('user.create');
    }

    public function show($id) {
        $user = User::findOrFail($id);

        return Inertia::render('Admin/User/ShowUser', [
            'user' => $user
        ]);
    }

    public function update(Request $request, $id) {
        $request->validate([
            'name' => 'required|string',
            'email' => 'required|string|email',
            'phone' => 'max:12|min:10',
            'address' => 'string',
            'role' => 'string|required',
        ], [
            'name.required' => 'Kolom Nama Pengguna Tidak Boleh Kosong.',
            'email.required' => 'Kolom Email Tidak Boleh Kosong.',
            'email.email' => 'Kolom Email harus berupa email yang valid.',
            'phone.max' => 'Kolom Nomor Telepon tidak boleh lebih dari 12 digit.',
            'phone.min' => 'Kolom Nomor Telepon harus memiliki minimal 10 digit.',
            'phone.email' => 'Kolom Nomor Telepon sudah terdapat pada daftar pengguna.',
            'role.required' => 'Kolom Role Pengguna Tidak Boleh Kosong.',
        ]);

        $user = User::findOrFail($id);

        $user_data = [
            'name' => $request->name,
            'email' => $request->email,
            'phone' => $request->phone,
            'address' => $request->address,
            'role' => $request->role,
        ];

        $user->update($user_data);

        return back();
    }

    public function delete($id) {
        User::destroy($id);
        return redirect()->route('user.dashboard');
    }
}
