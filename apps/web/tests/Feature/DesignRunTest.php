<?php

namespace Tests\Feature;

use App\Models\DesignRun;
use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Tests\TestCase;

class DesignRunTest extends TestCase
{
    use RefreshDatabase;

    public function test_user_can_create_design_run(): void
    {
        $user = User::factory()->create();
        $this->actingAs($user);

        $response = $this->postJson('/api/studio/generate', [
            'land' => ['type' => 'rectangle', 'length' => 200, 'width' => 165],
            'zone_a_percent' => 50,
            'zone_b_percent' => 50,
        ]);

        $response->assertStatus(200);
        $this->assertDatabaseHas('design_runs', ['user_id' => $user->id]);
    }

    public function test_user_can_list_own_runs(): void
    {
        $user = User::factory()->create();
        DesignRun::factory()->create(['user_id' => $user->id]);
        $this->actingAs($user);

        $response = $this->getJson('/api/studio/runs');

        $response->assertStatus(200)->assertJsonStructure(['runs']);
    }
}
