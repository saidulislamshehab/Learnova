<?php

namespace App\Http\Controllers;

use App\Models\InstructorApply;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;

class InstructorApplicationController extends Controller
{
    private function normalizeStatus(?string $status): string
    {
        return strtolower((string) ($status ?? 'pending'));
    }

    private function toResponsePayload(InstructorApply $application): array
    {
        return [
            'id' => (int) $application->In_Ap_ID,
            'user_id' => (int) $application->UserID,
            'status' => $this->normalizeStatus($application->Status),
            'expertise' => $application->Expertise,
            'about' => $application->About,
            'created_at' => $application->created_at,
            'updated_at' => $application->updated_at,
            'user' => $application->relationLoaded('user') ? $application->user : null,
        ];
    }

    public function myStatus(Request $request): JsonResponse
    {
        $application = InstructorApply::query()
            ->where('UserID', $request->user()->id)
            ->latest('In_Ap_ID')
            ->first();

        $normalized = $application ? $this->toResponsePayload($application) : null;

        return response()->json([
            'has_application' => (bool) $normalized,
            'application' => $normalized,
            'is_blocked' => $normalized && in_array($normalized['status'], ['pending', 'approved'], true),
        ]);
    }

    public function store(Request $request): JsonResponse
    {
        $user = $request->user();

        $isProfileComplete =
            !empty(trim((string) $user->name))
            && !empty(trim((string) $user->email))
            && !empty(trim((string) $user->bio))
            && !empty(trim((string) $user->picture));

        if (!$isProfileComplete) {
            return response()->json([
                'message' => 'Please complete your profile before applying',
                'required_fields' => ['name', 'email', 'bio', 'profile_picture'],
            ], 422);
        }

        $existingActive = InstructorApply::query()
            ->where('UserID', $user->id)
            ->whereIn('Status', ['pending', 'approved', 'Pending', 'Approved'])
            ->latest('In_Ap_ID')
            ->first();

        if ($existingActive) {
            return response()->json([
                'message' => 'Application already submitted',
                'application' => $this->toResponsePayload($existingActive),
            ], 409);
        }

        $application = InstructorApply::create([
            'UserID' => $user->id,
            'Status' => 'pending',
            'Expertise' => null,
            'About' => $user->bio,
        ]);

        return response()->json([
            'message' => 'Instructor application submitted successfully',
            'application' => $this->toResponsePayload($application),
        ], 201);
    }

    public function index(): JsonResponse
    {
        $applications = InstructorApply::query()
            ->with(['user:id,name,username,email,role,picture,bio'])
            ->latest('In_Ap_ID')
            ->get();

        return response()->json([
            'message' => 'Instructor applications fetched successfully',
            'applications' => $applications->map(fn (InstructorApply $app) => $this->toResponsePayload($app))->values(),
        ]);
    }

    public function updateStatus(Request $request, int $id): JsonResponse
    {
        $validated = $request->validate([
            'status' => 'required|in:approved,rejected',
        ]);

        $application = InstructorApply::query()->with('user')->findOrFail($id);

        DB::transaction(function () use ($application, $validated): void {
            $application->update(['Status' => $validated['status']]);

            if ($validated['status'] === 'approved') {
                $application->user->update([
                    'role' => 'instructor',
                ]);

                $existsInInstructors = DB::table('instructors')
                    ->where('UserID', $application->user->id)
                    ->exists();

                if (!$existsInInstructors) {
                    DB::table('instructors')->insert([
                        'UserID' => $application->user->id,
                        'created_at' => now(),
                        'updated_at' => now(),
                    ]);
                }
            }
        });

        return response()->json([
            'message' => 'Application status updated successfully',
            'application' => $this->toResponsePayload($application->fresh(['user'])),
        ]);
    }
}
