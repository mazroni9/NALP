<?php

namespace App\Http\Controllers;

use App\Models\InvestorInquiry;
use App\Models\NdaRequest;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Inertia\Inertia;

class ContactController extends Controller
{
    public function index()
    {
        return Inertia::render('Public/Contact');
    }

    public function submit(Request $request): RedirectResponse
    {
        $validated = $request->validate([
            'name' => 'required|string|max:255',
            'email' => 'required|email',
            'message' => 'nullable|string',
            'request_nda' => 'boolean',
            'request_type' => 'required|in:contact,nda,data_room',
        ]);

        if (in_array($validated['request_type'], ['nda']) || ! empty($validated['request_nda'])) {
            NdaRequest::create([
                'name' => $validated['name'],
                'email' => $validated['email'],
                'company' => $request->input('company'),
                'phone' => $request->input('phone'),
                'purpose' => $validated['message'] ?? '',
            ]);
            return back()->with('success', 'NDA request submitted.');
        }

        $type = $validated['request_type'] === 'data_room' ? 'data_room_access' : 'contact';
        InvestorInquiry::create([
            'name' => $validated['name'],
            'email' => $validated['email'],
            'company' => $request->input('company'),
            'message' => $validated['message'] ?? '',
            'request_nda' => ! empty($validated['request_nda']),
            'request_type' => $type,
        ]);

        return match ($type) {
            'data_room_access' => back()->with('success', 'Data room access request submitted.'),
            default => back()->with('success', 'Message sent successfully.'),
        };
    }
}
