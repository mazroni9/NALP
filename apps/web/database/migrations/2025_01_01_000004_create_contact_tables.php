<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('investor_inquiries', function (Blueprint $table) {
            $table->id();
            $table->string('name');
            $table->string('email');
            $table->string('company')->nullable();
            $table->text('message')->nullable();
            $table->string('type')->default('contact'); // contact, data_room_access
            $table->string('status')->default('new');
            $table->timestamps();
        });

        Schema::create('nda_requests', function (Blueprint $table) {
            $table->id();
            $table->string('name');
            $table->string('email');
            $table->string('company')->nullable();
            $table->string('phone')->nullable();
            $table->text('purpose')->nullable();
            $table->string('status')->default('pending');
            $table->timestamps();
        });

        Schema::create('scenarios', function (Blueprint $table) {
            $table->id();
            $table->foreignId('user_id')->constrained()->cascadeOnDelete();
            $table->string('name');
            $table->decimal('occupancy', 8, 4)->nullable();
            $table->decimal('bed_rate', 12, 2)->nullable();
            $table->decimal('opex_cap', 12, 2)->nullable();
            $table->decimal('land_exit_price', 18, 2)->nullable();
            $table->json('extra_params')->nullable();
            $table->timestamps();
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('scenarios');
        Schema::dropIfExists('nda_requests');
        Schema::dropIfExists('investor_inquiries');
    }
};
