<?php

namespace Tests\Feature;

use App\Models\DesignRun;
use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Illuminate\Support\Facades\Queue;
use Laravel\Sanctum\Sanctum;
use Tests\TestCase;

class DesignRunTest extends TestCase
{
    use RefreshDatabase;

    protected function setUp(): void
    {
        parent::setUp();
        Queue::fake();
    }

    public function test_user_can_create_design_run(): void
    {
        $user = User::factory()->create();
        Sanctum::actingAs($user);

        $response = $this->postJson('/api/studio/generate', [
            'land' => ['type' => 'rectangle', 'length' => 200, 'width' => 165],
            'zone_a_percent' => 50,
            'zone_b_percent' => 50,
        ]);

        $response->assertStatus(200)->assertJsonStructure(['run']);
        $this->assertDatabaseHas('design_runs', ['user_id' => $user->id]);
    }

    public function test_user_can_create_design_run_with_polygon(): void
    {
        $user = User::factory()->create();
        Sanctum::actingAs($user);

        $response = $this->postJson('/api/studio/generate', [
            'land' => [
                'type' => 'polygon',
                'points' => [[0, 0], [200, 0], [200, 165], [0, 165]],
            ],
            'zone_a_percent' => 50,
            'zone_b_percent' => 50,
        ]);

        $response->assertStatus(200);
    }

    public function test_user_can_list_own_runs(): void
    {
        $user = User::factory()->create();
        DesignRun::factory()->create(['user_id' => $user->id]);
        Sanctum::actingAs($user);

        $response = $this->getJson('/api/studio/runs');

        $response->assertStatus(200)->assertJsonStructure(['runs']);
    }

    public function test_guest_cannot_generate(): void
    {
        $response = $this->postJson('/api/studio/generate', [
            'land' => ['type' => 'rectangle', 'length' => 200, 'width' => 165],
            'zone_a_percent' => 50,
            'zone_b_percent' => 50,
        ]);

        $response->assertStatus(401);
    }
}
