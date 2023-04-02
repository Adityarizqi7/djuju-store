<?php

namespace Database\Seeders;

use App\Models\Omzet;
use Illuminate\Database\Seeder;
use Illuminate\Database\Console\Seeds\WithoutModelEvents;

class OmzetSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        $omzet = [
            [
                'id' => 1,
                'omzet_amount' => 640000,
                'omzet_time' => '2022-12',
                'created_at' => now(),
                'updated_at' => now(),
            ],
            [
                'id' => 2,
                'omzet_amount' => 520000,
                'omzet_time' => '2023-01',
                'created_at' => now(),
                'updated_at' => now(),
            ],
            [
                'id' => 3,
                'omzet_amount' => 464000,
                'omzet_time' => '2023-02',
                'created_at' => now(),
                'updated_at' => now(),
            ],
            [
                'id' => 4,
                'omzet_amount' => 600000,
                'omzet_time' => '2023-03',
                'created_at' => now(),
                'updated_at' => now(),
            ],
            [
                'id' => 5,
                'omzet_amount' => 640000,
                'omzet_time' => '2023-04',
                'created_at' => now(),
                'updated_at' => now(),
            ],
        ];
        // $omzet = [
        //     [
        //         'id' => 1,
        //         'omzet_amount' => 200,
        //         'omzet_time' => '2022-08',
        //         'created_at' => now(),
        //         'updated_at' => now(),
        //     ],
        //     [
        //         'id' => 2,
        //         'omzet_amount' => 245,
        //         'omzet_time' => '2022-09',
        //         'created_at' => now(),
        //         'updated_at' => now(),
        //     ],
        //     [
        //         'id' => 3,
        //         'omzet_amount' => 240,
        //         'omzet_time' => '2022-10',
        //         'created_at' => now(),
        //         'updated_at' => now(),
        //     ],
        //     [
        //         'id' => 4,
        //         'omzet_amount' => 275,
        //         'omzet_time' => '2022-11',
        //         'created_at' => now(),
        //         'updated_at' => now(),
        //     ],
        //     [
        //         'id' => 5,
        //         'omzet_amount' => 285,
        //         'omzet_time' => '2022-12',
        //         'created_at' => now(),
        //         'updated_at' => now(),
        //     ],
        //     [
        //         'id' => 6,
        //         'omzet_amount' => 300,
        //         'omzet_time' => '2023-01',
        //         'created_at' => now(),
        //         'updated_at' => now(),
        //     ],
        //     [
        //         'id' => 7,
        //         'omzet_amount' => 290,
        //         'omzet_time' => '2023-02',
        //         'created_at' => now(),
        //         'updated_at' => now(),
        //     ],
        //     [
        //         'id' => 8,
        //         'omzet_amount' => 315,
        //         'omzet_time' => '2023-03',
        //         'created_at' => now(),
        //         'updated_at' => now(),
        //     ],
        // ];

        Omzet::insert($omzet);
    }
}
