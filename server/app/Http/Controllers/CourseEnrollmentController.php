<?php

namespace App\Http\Controllers;

use App\Models\Enrollment;
use App\Models\Course;
use Illuminate\Http\Request;
use Illuminate\Http\JsonResponse;
use Illuminate\Support\Facades\DB;

class CourseEnrollmentController extends Controller
{
    /**
     * Store a new enrollment/purchase record.
     */
    public function store(Request $request): JsonResponse
    {
        $validated = $request->validate([
            'course_id' => 'required|exists:courses,CourseID',
            'payment_method' => 'required|string|max:20',
            'amount_paid' => 'required|numeric|min:0',
        ]);

        $user = $request->user();

        // Check if user is already enrolled
        $existing = Enrollment::where('UserID', $user->id)
            ->where('CourseID', $validated['course_id'])
            ->first();

        if ($existing) {
            return response()->json([
                'message' => 'You are already enrolled in this course.',
            ], 400);
        }

        try {
            return DB::transaction(function () use ($validated, $user) {
                $enrollment = Enrollment::create([
                    'UserID' => $user->id,
                    'CourseID' => $validated['course_id'],
                    'Payment_Method' => $validated['payment_method'],
                    'Amount_Paid' => $validated['amount_paid'],
                    'Enrolled_At' => now(),
                    'Progress_Percent' => 0,
                    'Completed_Lessons' => 0,
                ]);

                return response()->json([
                    'message' => 'Enrollment successful!',
                    'enrollment' => $enrollment,
                ], 201);
            });
        } catch (\Exception $e) {
            return response()->json([
                'message' => 'Failed to process enrollment.',
                'error' => $e->getMessage(),
            ], 500);
        }
    }

    /**
     * Get user's enrolled courses.
     */
    public function myEnrolledCourses(Request $request): JsonResponse
    {
        $courses = Course::query()
            ->join('enrollments', 'courses.CourseID', '=', 'enrollments.CourseID')
            ->where('enrollments.UserID', $request->user()->id)
            ->select('courses.*', 'enrollments.Enrolled_At', 'enrollments.Progress_Percent')
            ->get();

        return response()->json([
            'courses' => $courses,
        ]);
    }
}
