<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('design_runs', function (Blueprint $table) {
            $table->id();
            $table->foreignId('user_id')->constrained()->cascadeOnDelete();
            $table->string('status')->default('pending'); // pending, processing, completed, failed
            $table->json('inputs')->nullable();
            $table->json('outputs')->nullable();
            $table->string('job_id')->nullable();
            $table->text('error_message')->nullable();
            $table->timestamps();
        });

        Schema::create('design_run_files', function (Blueprint $table) {
            $table->id();
            $table->foreignId('design_run_id')->constrained()->cascadeOnDelete();
            $table->string('type'); // glb, png, pdf
            $table->string('path');
            $table->string('filename');
            $table->timestamps();
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('design_run_files');
        Schema::dropIfExists('design_runs');
    }
};
