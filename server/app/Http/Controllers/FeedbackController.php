<?php

namespace App\Http\Controllers;

use App\Models\Feedback;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;

class FeedbackController extends Controller
{
    /**
     * Store a new feedback (any authenticated user).
     */
    public function store(Request $request): JsonResponse
    {
        $validated = $request->validate([
            'subject'     => ['required', 'string', 'max:255'],
            'type'        => ['required', 'string', 'max:30'],
            'description' => ['required', 'string'],
        ]);

        $feedback = Feedback::create([
            'UserID'      => $request->user()->id,
            'Subject'     => $validated['subject'],
            'Type'        => $validated['type'],
            'Description' => $validated['description'],
            'Status'      => 'pending',
        ]);

        return response()->json([
            'message'  => 'Feedback submitted successfully.',
            'feedback' => $feedback,
        ], 201);
    }

    /**
     * List all feedbacks (admin only).
     */
    public function index(): JsonResponse
    {
        $feedbacks = Feedback::query()
            ->with('user:id,name,email')
            ->orderByDesc('created_at')
            ->get();

        return response()->json([
            'feedbacks' => $feedbacks,
        ]);
    }

    /**
     * Update feedback status (admin only).
     */
    public function updateStatus(Request $request, int $id): JsonResponse
    {
        $validated = $request->validate([
            'status' => ['required', 'string', 'in:pending,in_progress,resolved'],
        ]);

        $feedback = Feedback::findOrFail($id);

        $feedback->update([
            'Status' => $validated['status'],
        ]);

        return response()->json([
            'message'  => 'Feedback status updated successfully.',
            'feedback' => $feedback->fresh()->load('user:id,name,email'),
        ]);
    }
}
