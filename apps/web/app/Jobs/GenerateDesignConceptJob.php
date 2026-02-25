<?php

namespace App\Jobs;

use App\Models\DesignRun;
use App\Services\DesignGeneratorClient;
use Illuminate\Bus\Queueable;
use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Foundation\Bus\Dispatchable;
use Illuminate\Queue\InteractsWithQueue;
use Illuminate\Queue\SerializesModels;

class GenerateDesignConceptJob implements ShouldQueue
{
    use Dispatchable, InteractsWithQueue, Queueable, SerializesModels;

    public function __construct(
        public DesignRun $designRun
    ) {}

    public function handle(DesignGeneratorClient $client): void
    {
        $this->designRun->update(['status' => 'processing']);

        try {
            $inputs = array_merge(
                $this->designRun->inputs ?? [],
                ['run_id' => (string) $this->designRun->id]
            );
            $response = $client->generate($inputs);
            $data = $response['outputs'] ?? $response;
            $this->designRun->update(['outputs' => $data]);

            foreach ($data['files'] ?? [] as $file) {
                $this->designRun->files()->create([
                    'type' => $file['type'] ?? 'glb',
                    'path' => $file['path'],
                    'filename' => basename($file['path']),
                ]);
            }

            $this->designRun->update(['status' => 'completed']);
        } catch (\Throwable $e) {
            $this->designRun->update([
                'status' => 'failed',
                'error_message' => $e->getMessage(),
            ]);
            throw $e;
        }
    }
}
