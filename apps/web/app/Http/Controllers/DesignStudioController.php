<?php

namespace App\Http\Controllers;

use App\Jobs\GenerateDesignConceptJob;
use App\Models\DesignRun;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Inertia\Inertia;

class DesignStudioController extends Controller
{
    public function index()
    {
        return Inertia::render('Studio/Index');
    }

    public function runs(Request $request): JsonResponse
    {
        $runs = $request->user()
            ->designRuns()
            ->with('files')
            ->orderByDesc('created_at')
            ->get();

        return response()->json(['runs' => $runs]);
    }

    public function show(Request $request, DesignRun $run): JsonResponse
    {
        if ($run->user_id !== $request->user()->id) {
            abort(403);
        }

        $run->load('files');

        return response()->json(['run' => $run]);
    }

    public function generate(Request $request): JsonResponse
    {
        $validated = $request->validate([
            'land' => 'required|array',
            'land.type' => 'in:rectangle,polygon',
            'land.length' => 'nullable|numeric|min:1',
            'land.width' => 'nullable|numeric|min:1',
            'land.points' => 'nullable|array',
            'zone_a_percent' => 'required|numeric|min:0|max:100',
            'zone_b_percent' => 'required|numeric|min:0|max:100',
        ]);

        $run = $request->user()->designRuns()->create([
            'status' => 'pending',
            'inputs' => $validated,
        ]);

        GenerateDesignConceptJob::dispatch($run);

        return response()->json(['run' => $run->load('files')]);
    }
}
