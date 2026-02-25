<?php

namespace App\Services;

use Illuminate\Support\Facades\Http;

class DesignGeneratorClient
{
    protected string $baseUrl;

    public function __construct()
    {
        $this->baseUrl = rtrim(config('services.generator.url', 'http://generator:8000'), '/');
    }

    public function generate(array $inputs): array
    {
        $response = Http::timeout(300)->post("{$this->baseUrl}/api/generate", $inputs);

        if (! $response->successful()) {
            throw new \RuntimeException(
                'Generator service failed: ' . ($response->body() ?: $response->status())
            );
        }

        return $response->json('outputs', []);
    }

    public function health(): bool
    {
        try {
            $response = Http::timeout(5)->get("{$this->baseUrl}/health");
            return $response->successful();
        } catch (\Throwable) {
            return false;
        }
    }
}
