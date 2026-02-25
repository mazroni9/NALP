<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Inertia\Inertia;

class PortalController extends Controller
{
    public function dashboard(Request $request)
    {
        $user = $request->user();
        $scenarioCount = $user->scenarios()->count();

        return Inertia::render('Portal/Dashboard', [
            'scenarioCount' => $scenarioCount,
        ]);
    }

    public function dataRoom(Request $request)
    {
        return Inertia::render('Portal/DataRoom');
    }

    public function scenarios(Request $request)
    {
        $scenarios = $request->user()->scenarios()->orderByDesc('created_at')->get();

        return Inertia::render('Portal/Scenarios', [
            'scenarios' => $scenarios,
        ]);
    }

    public function storeScenario(Request $request)
    {
        $validated = $request->validate([
            'name' => 'required|string|max:255',
            'occupancy' => 'nullable|numeric',
            'bed_rate' => 'nullable|numeric',
            'opex_cap' => 'nullable|numeric',
            'land_exit_price' => 'nullable|numeric',
        ]);

        $name = $validated['name'];
        $inputs = collect($validated)->except('name')->filter()->all();

        $request->user()->scenarios()->create([
            'name' => $name,
            'inputs' => $inputs,
        ]);

        return redirect()->route('portal.scenarios')->with('success', 'Scenario saved.');
    }

    public function compareScenarios(Request $request)
    {
        $scenarios = $request->user()->scenarios()->orderByDesc('created_at')->get();

        return Inertia::render('Portal/CompareScenarios', [
            'scenarios' => $scenarios,
        ]);
    }
}
