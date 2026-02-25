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
        $request->validate([
            'name' => 'required|string|max:255',
            'email' => 'required|email',
            'company' => 'nullable|string|max:255',
            'message' => 'nullable|string',
        ]);

        InvestorInquiry::create([
            'name' => $request->name,
            'email' => $request->email,
            'company' => $request->company,
            'message' => $request->message,
            'type' => 'contact',
        ]);

        return back()->with('success', 'Message sent successfully.');
    }

    public function nda(Request $request): RedirectResponse
    {
        $request->validate([
            'name' => 'required|string|max:255',
            'email' => 'required|email',
            'company' => 'nullable|string|max:255',
            'phone' => 'nullable|string|max:50',
            'purpose' => 'nullable|string',
        ]);

        NdaRequest::create($request->only(['name', 'email', 'company', 'phone', 'purpose']));

        return back()->with('success', 'NDA request submitted.');
    }

    public function dataRoom(Request $request): RedirectResponse
    {
        $request->validate([
            'name' => 'required|string|max:255',
            'email' => 'required|email',
            'company' => 'nullable|string|max:255',
            'message' => 'nullable|string',
        ]);

        InvestorInquiry::create([
            'name' => $request->name,
            'email' => $request->email,
            'company' => $request->company,
            'message' => $request->message,
            'type' => 'data_room_access',
        ]);

        return back()->with('success', 'Data room access request submitted.');
    }
}
