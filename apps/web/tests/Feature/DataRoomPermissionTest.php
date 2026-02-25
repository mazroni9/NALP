<?php

namespace Tests\Feature;

use App\Models\Role;
use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Laravel\Sanctum\Sanctum;
use Tests\TestCase;

class DataRoomPermissionTest extends TestCase
{
    use RefreshDatabase;

    public function test_authenticated_user_can_list_documents(): void
    {
        $user = User::factory()->create();
        Sanctum::actingAs($user);

        $response = $this->getJson('/api/data-room/documents');

        $response->assertStatus(200)->assertJsonStructure(['documents']);
    }

    public function test_guest_cannot_access_data_room_api(): void
    {
        $response = $this->getJson('/api/data-room/documents');

        $response->assertStatus(401);
    }

    public function test_investor_cannot_upload_to_data_room_admin(): void
    {
        $investorRole = Role::firstOrCreate(['name' => 'investor']);
        $user = User::factory()->create();
        $user->roles()->attach($investorRole->id);

        $this->actingAs($user);

        $response = $this->post(route('admin.data-room.upload'), [
            'name' => 'Test Doc',
            'file' => \Illuminate\Http\UploadedFile::fake()->create('doc.pdf', 100),
        ]);

        $response->assertStatus(403);
    }
}
