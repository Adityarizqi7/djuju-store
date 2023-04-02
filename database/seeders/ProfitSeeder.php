<?php

namespace Database\Seeders;

use App\Models\Profit;
use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;

class ProfitSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void {
        // $profit = [
        //     [
        //         'id' => 1,
        //         'profit_amount' => 640000,
        //         'profit_time' => '2022-08',
        //         'created_at' => now(),
        //         'updated_at' => now(),
        //     ],
        //     [
        //         'id' => 2,
        //         'profit_amount' => 520000,
        //         'profit_time' => '2022-09',
        //         'created_at' => now(),
        //         'updated_at' => now(),
        //     ],
        //     [
        //         'id' => 3,
        //         'profit_amount' => 464000,
        //         'profit_time' => '2022-10',
        //         'created_at' => now(),
        //         'updated_at' => now(),
        //     ],
        //     [
        //         'id' => 4,
        //         'profit_amount' => 600000,
        //         'profit_time' => '2022-11',
        //         'created_at' => now(),
        //         'updated_at' => now(),
        //     ],
        //     [
        //         'id' => 5,
        //         'profit_amount' => 640000,
        //         'profit_time' => '2022-12',
        //         'created_at' => now(),
        //         'updated_at' => now(),
        //     ],
        // ];
        $profit = [
            [
                'id' => 1,
                'profit_amount' => 200,
                'profit_time' => '2022-08',
                'created_at' => now(),
                'updated_at' => now(),
            ],
            [
                'id' => 2,
                'profit_amount' => 245,
                'profit_time' => '2022-09',
                'created_at' => now(),
                'updated_at' => now(),
            ],
            [
                'id' => 3,
                'profit_amount' => 240,
                'profit_time' => '2022-10',
                'created_at' => now(),
                'updated_at' => now(),
            ],
            [
                'id' => 4,
                'profit_amount' => 275,
                'profit_time' => '2022-11',
                'created_at' => now(),
                'updated_at' => now(),
            ],
            [
                'id' => 5,
                'profit_amount' => 285,
                'profit_time' => '2022-12',
                'created_at' => now(),
                'updated_at' => now(),
            ],
            [
                'id' => 6,
                'profit_amount' => 300,
                'profit_time' => '2023-01',
                'created_at' => now(),
                'updated_at' => now(),
            ],
            [
                'id' => 7,
                'profit_amount' => 290,
                'profit_time' => '2023-02',
                'created_at' => now(),
                'updated_at' => now(),
            ],
            [
                'id' => 8,
                'profit_amount' => 315,
                'profit_time' => '2023-03',
                'created_at' => now(),
                'updated_at' => now(),
            ],
        ];

        Profit::insert($profit);

    }
}
