<?php

namespace App\Http\Controllers;

use App\Models\Report;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;

class ReportController extends Controller
{
    public function index(): JsonResponse
    {
        $reports = Report::query()
            ->with([
                'user:id,name,picture',
                'article:Article_ID,Title,Status,Category,UserID',
            ])
            ->orderByDesc('created_at')
            ->get();

        return response()->json([
            'reports' => $reports,
        ]);
    }

    public function update(Request $request, int $id): JsonResponse
    {
        $validated = $request->validate([
            'status' => ['required', 'string', 'in:pending,under_review,resolved'],
        ]);

        $report = Report::findOrFail($id);
        $report->update([
            'Status' => $validated['status'],
        ]);

        return response()->json([
            'message' => 'Report status updated successfully.',
            'report' => $report->fresh(['user:id,name,picture', 'article:Article_ID,Title,Status,Category,UserID']),
        ]);
    }
}