<?php

namespace Database\Seeders;

use App\Models\User;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\Hash;
use Illuminate\Database\Console\Seeds\WithoutModelEvents;

class UserSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        $user = [
            [
                'name' => 'Admin Toko Djuju',
                'email' => 'djujustore@gmail.com',
                'address' => 'Jln. Pogot Baru',
                'phone' => '083244532765',
                'email' => 'djujustore@gmail.com',
                'role' => 'owner',
                'password' => Hash::make('djujustore02_'),
                'created_at' => now(),
                'updated_at' => now(),
            ],
        ];

        User::insert($user);
    }
}
