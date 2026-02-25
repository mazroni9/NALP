<?php

namespace Tests\Feature;

use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Tests\TestCase;

class DataRoomPermissionTest extends TestCase
{
    use RefreshDatabase;

    public function test_authenticated_user_can_list_documents(): void
    {
        $user = User::factory()->create();
        $this->actingAs($user);

        $response = $this->getJson('/api/data-room/documents');

        $response->assertStatus(200)->assertJsonStructure(['documents']);
    }

    public function test_guest_cannot_access_data_room_api(): void
    {
        $response = $this->getJson('/api/data-room/documents');

        $response->assertStatus(401);
    }
}
