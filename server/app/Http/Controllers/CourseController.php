<?php

namespace App\Http\Controllers;

use App\Models\Course;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Storage;
use Illuminate\Validation\Rule;

class CourseController extends Controller
{
    public function indexPending(Request $request): JsonResponse
    {
        $courses = Course::query()
            ->with('user:id,name,email')
            ->where('status', 'pending')
            ->orderByDesc('created_at')
            ->get();

        return response()->json([
            'courses' => $courses,
        ]);
    }

    public function indexPublic(Request $request): JsonResponse
    {
        $courses = Course::query()
            ->with('user:id,name,picture')
            ->where('Status', 'published')
            ->orderByDesc('created_at')
            ->get();

        return response()->json([
            'courses' => $courses,
        ]);
    }

    public function indexMyCourses(Request $request): JsonResponse
    {
        $courses = Course::query()
            ->with('contents')
            ->where('UserID', $request->user()->id)
            ->orderByDesc('created_at')
            ->get();

        return response()->json([
            'courses' => $courses,
        ]);
    }

    public function show(Request $request, int $id): JsonResponse
    {
        $course = Course::query()
            ->with(['contents', 'user:id,name,picture'])
            ->findOrFail($id);

        return response()->json([
            'course' => $course,
        ]);
    }

    public function store(Request $request): JsonResponse
    {
        $validated = $this->validateCourseRequest($request);

        $creatorRole = (string) ($request->user()->role ?? '');
        if (!in_array($creatorRole, ['admin', 'instructor'], true)) {
            return response()->json([
                'message' => 'Only instructors and admins can create courses.',
            ], 403);
        }

        $contents = $this->normalizeCourseContents($validated['course_contents']);

        if ($contents === null) {
            return response()->json([
                'message' => 'Invalid course_contents payload. Send a valid JSON array or array.',
            ], 422);
        }

        $course = DB::transaction(function () use ($request, $validated, $contents) {
            $thumbnailUrl = $validated['thumbnail'] ?? null;
            if ($request->hasFile('thumbnail')) {
                $thumbnailPath = $request->file('thumbnail')->store('course-thumbnails', 'public');
                $thumbnailUrl = Storage::url($thumbnailPath);
            }

            $course = Course::create([
                'UserID' => $request->user()->id,
                'Title' => $validated['title'],
                'Category' => $validated['category_name'] ?? (string) $validated['category_id'],
                'Description' => $validated['short_description'],
                'Overview' => $validated['overview'],
                'Thumbnail' => $thumbnailUrl,
                'Total_Hours' => $validated['duration'],
                'Price' => $validated['price'],
                'Old_Price' => $validated['old_price'] ?? null,
                'Status' => $validated['status'] ?? 'draft',
                'category_id' => $validated['category_id'],
            ]);

            if (($validated['status'] ?? '') === 'pending') {
                DB::table('course_approvals')->insert([
                    'course_id' => $course->CourseID,
                    'status' => 'pending',
                    'created_at' => now(),
                    'updated_at' => now(),
                ]);
            }

            foreach ($contents as $index => $item) {
                $course->contents()->create([
                    'title' => $item['title'],
                    'description' => $item['description'] ?? null,
                    'youtube_url' => $item['youtube_url'] ?? null,
                    'order' => $item['order'] ?? ($index + 1),
                ]);
            }

            return $course->load('contents');
        });

        return response()->json([
            'message' => 'Course created successfully.',
            'course' => $course,
        ], 201);
    }

    public function update(Request $request, int $id): JsonResponse
    {
        $validated = $this->validateCourseRequest($request);

        $course = Course::query()->findOrFail($id);

        if ((int) $course->UserID !== (int) $request->user()->id) {
            return response()->json([
                'message' => 'You are not allowed to update this course.',
            ], 403);
        }

        $contents = $this->normalizeCourseContents($validated['course_contents']);

        if ($contents === null) {
            return response()->json([
                'message' => 'Invalid course_contents payload. Send a valid JSON array or array.',
            ], 422);
        }

        $updatedCourse = DB::transaction(function () use ($request, $validated, $course, $contents) {
            $thumbnailUrl = $course->Thumbnail;
            
            // If the thumbnail field exists and is a URL string
            if (isset($validated['thumbnail']) && is_string($validated['thumbnail']) && str_starts_with($validated['thumbnail'], 'http')) {
                $thumbnailUrl = $validated['thumbnail'];
            }

            if ($request->hasFile('thumbnail')) {
                $newPath = $request->file('thumbnail')->store('course-thumbnails', 'public');
                $thumbnailUrl = Storage::url($newPath);
            }

            $newStatus = $validated['status'] ?? 'draft';
            if ($course->Status === 'published') {
                $newStatus = 'published';
            }

            $course->update([
                'Title' => $validated['title'],
                'Category' => $validated['category_name'] ?? (string) $validated['category_id'],
                'Description' => $validated['short_description'],
                'Overview' => $validated['overview'],
                'Thumbnail' => $thumbnailUrl,
                'Total_Hours' => $validated['duration'],
                'Price' => $validated['price'],
                'Old_Price' => $validated['old_price'] ?? null,
                'Status' => $newStatus,
                'category_id' => $validated['category_id'],
            ]);

            if (($validated['status'] ?? '') === 'pending') {
                DB::table('course_approvals')->updateOrInsert(
                    ['course_id' => $course->CourseID],
                    [
                        'status' => 'pending',
                        'updated_at' => now(),
                        'created_at' => now(),
                    ]
                );
            }

            $course->contents()->delete();

            foreach ($contents as $index => $item) {
                $course->contents()->create([
                    'title' => $item['title'],
                    'description' => $item['description'] ?? null,
                    'youtube_url' => $item['youtube_url'] ?? null,
                    'order' => $item['order'] ?? ($index + 1),
                ]);
            }

            return $course->fresh()->load('contents');
        });

        return response()->json([
            'message' => 'Course updated successfully.',
            'course' => $updatedCourse,
        ]);
    }

    public function moderate(Request $request, int $id): JsonResponse
    {
        $validated = $request->validate([
            'status' => ['required', Rule::in(['published', 'rejected', 'draft'])],
            'comments' => ['nullable', 'string'],
        ]);

        $course = Course::query()->findOrFail($id);

        $backendStatus = $validated['status'];

        $course->update([
            'Status' => $backendStatus,
        ]);

        DB::table('course_approvals')->updateOrInsert(
            ['course_id' => $course->CourseID],
            [
                'admin_id' => $request->user()->id,
                'status' => $backendStatus === 'published' ? 'approved' : ($backendStatus === 'rejected' ? 'rejected' : 'pending'),
                'comments' => $validated['comments'] ?? null,
                'updated_at' => now(),
            ]
        );

        return response()->json([
            'message' => 'Course status updated successfully.',
            'course' => $course->fresh()->load('contents'),
        ]);
    }

    private function validateCourseRequest(Request $request): array
    {
        return $request->validate([
            'title' => ['required', 'string', 'max:255'],
            'category_id' => ['required', 'integer', 'min:1'],
            'category_name' => ['nullable', 'string', 'max:255'],
            'short_description' => ['nullable', 'string'],
            'overview' => ['nullable', 'string'],
            'duration' => ['nullable', 'numeric', 'min:0'],
            'price' => ['nullable', 'numeric', 'min:0'],
            'old_price' => ['nullable', 'numeric', 'min:0'],
            'thumbnail' => ['nullable', 'max:5120'],
            'status' => ['nullable', Rule::in(['draft', 'pending', 'published'])],
            'course_contents' => ['required'],
        ]);
    }

    private function normalizeCourseContents(mixed $rawContents): ?array
    {
        if (empty($rawContents)) {
            return [];
        }

        $contents = $rawContents;

        if (is_string($rawContents)) {
            $decoded = json_decode($rawContents, true);
            if (json_last_error() !== JSON_ERROR_NONE) {
                return null;
            }
            $contents = $decoded;
        }

        // If it's a single object (associative array), wrap it in an array
        if (is_array($contents) && count($contents) > 0 && !isset($contents[0]) && (isset($contents['title']) || isset($contents['Title']))) {
            $contents = [$contents];
        }

        if (!is_array($contents)) {
            return null;
        }

        $normalized = [];
        foreach ($contents as $item) {
            if (!is_array($item)) {
                continue;
            }

            // Title is the only strictly required field for an item
            $title = $item['title'] ?? $item['Title'] ?? '';
            if (trim((string) $title) === '') {
                continue;
            }

            $normalized[] = [
                'title' => trim((string) $title),
                'description' => $item['description'] ?? $item['Description'] ?? null,
                'youtube_url' => $item['youtube_url'] ?? $item['youtubeUrl'] ?? $item['videoUrl'] ?? null,
                'order' => $item['order'] ?? $item['Order'] ?? (count($normalized) + 1),
            ];
        }

        return $normalized;
    }
}
