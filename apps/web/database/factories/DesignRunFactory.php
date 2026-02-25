<?php

namespace Database\Factories;

use App\Models\DesignRun;
use App\Models\User;
use Illuminate\Database\Eloquent\Factories\Factory;

class DesignRunFactory extends Factory
{
    protected $model = DesignRun::class;

    public function definition(): array
    {
        return [
            'user_id' => User::factory(),
            'status' => 'pending',
            'inputs' => [
                'land' => ['type' => 'rectangle', 'length' => 200, 'width' => 165],
                'zone_a_percent' => 50,
                'zone_b_percent' => 50,
            ],
        ];
    }
}
