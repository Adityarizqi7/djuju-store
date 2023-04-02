<?php

namespace Database\Seeders;

use App\Models\Products;
use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;

class ProductSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        $product = [
            [
                'name' => 'Minyak Goreng',
                'barcode' => '2022Yerz2_',
                'initial_price' => '20000',
                'sell_price' => '22000',
            ],
            [
                'name' => 'Sabun Lifeboy',
                'barcode' => '2022ErAd4_',
                'initial_price' => '30000',
                'sell_price' => '31000',
            ],
        ];

        $profit = $product[0]['sell_price'] -  $product[0]['initial_price'];
        $product[0]['profit_price'] = $profit;

        $profit = $product[1]['sell_price'] -  $product[1]['initial_price'];
        $product[1]['profit_price'] = $profit;

        Products::insert($product);
    }
}
