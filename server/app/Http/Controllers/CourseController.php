<?php

namespace App\Http\Controllers;

use App\Models\Course;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Storage;
use Illuminate\Validation\Rule;
use App\Models\Notification;
use App\Models\User;

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

    public function topPublished(Request $request): JsonResponse
    {
        $courses = Course::query()
            ->with('user:id,name,picture')
            ->withCount('enrollments')
            ->where('Status', 'published')
            ->orderByDesc('enrollments_count')
            ->orderByDesc('created_at')
            ->limit(6)
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
        $categoryName = $this->resolveCategoryName($validated);

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

        // Admin-specific validation: Minimum one title and YouTube URL for each title
        $creatorRole = strtolower((string) ($request->user()->role ?? ''));
        if ($creatorRole === 'admin') {
            if (empty($contents)) {
                return response()->json([
                    'message' => 'Admins must add at least one title (course content) to the article.',
                ], 422);
            }

            foreach ($contents as $item) {
                if (empty($item['youtube_url'])) {
                    return response()->json([
                        'message' => 'Every title must have a valid YouTube link.',
                    ], 422);
                }
                
                // Generic youtube URL validation (at least check if it's a URL)
                if (!filter_var($item['youtube_url'], FILTER_VALIDATE_URL) || 
                    !(str_contains($item['youtube_url'], 'youtube.com') || str_contains($item['youtube_url'], 'youtu.be'))) {
                    return response()->json([
                        'message' => "The YouTube link for \"{$item['title']}\" is invalid.",
                    ], 422);
                }
            }
        }

        $course = DB::transaction(function () use ($request, $validated, $contents, $categoryName) {
            $thumbnailUrl = $validated['thumbnail'] ?? null;
            if ($request->hasFile('thumbnail')) {
                $thumbnailPath = $request->file('thumbnail')->store('course-thumbnails', 'public');
                $thumbnailUrl = Storage::url($thumbnailPath);
            }

            $course = Course::create([
                'UserID' => $request->user()->id,
                'Title' => $validated['title'],
                'Category' => $categoryName,
                'Description' => $validated['short_description'],
                'Overview' => $validated['overview'],
                'Thumbnail' => $thumbnailUrl,
                'Total_Hours' => $validated['duration'],
                'Price' => $validated['price'],
                'Old_Price' => $validated['old_price'] ?? null,
                'Status' => $validated['status'] ?? 'draft',
                'category_id' => $validated['category_id'] ?? null,
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

        // Notify all users about new course if it's published
        if ($course->Status === 'published') {
            $users = User::where('id', '!=', $request->user()->id)->get();
            foreach ($users as $recipient) {
                Notification::create([
                    'user_id' => $recipient->id,
                    'type' => 'course_posted',
                    'message' => "published a new course: \"{$course->Title}\"",
                    'author_name' => $request->user()->name,
                    'resource_id' => $course->CourseID,
                ]);
            }
        }

        return response()->json([
            'message' => 'Course created successfully.',
            'course' => $course,
        ], 201);
    }

    public function update(Request $request, int $id): JsonResponse
    {
        $validated = $this->validateCourseRequest($request);
        $categoryName = $this->resolveCategoryName($validated);

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

        // Admin-specific validation: Minimum one title and YouTube URL for each title
        $creatorRole = strtolower((string) ($request->user()->role ?? ''));
        if ($creatorRole === 'admin') {
            if (empty($contents)) {
                return response()->json([
                    'message' => 'Admins must add at least one title (course content) to the article.',
                ], 422);
            }

            foreach ($contents as $item) {
                if (empty($item['youtube_url'])) {
                    return response()->json([
                        'message' => 'Every title must have a valid YouTube link.',
                    ], 422);
                }
                
                if (!filter_var($item['youtube_url'], FILTER_VALIDATE_URL) || 
                    !(str_contains($item['youtube_url'], 'youtube.com') || str_contains($item['youtube_url'], 'youtu.be'))) {
                    return response()->json([
                        'message' => "The YouTube link for \"{$item['title']}\" is invalid.",
                    ], 422);
                }
            }
        }

        $updatedCourse = DB::transaction(function () use ($request, $validated, $course, $contents, $categoryName) {
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
                'Category' => $categoryName,
                'Description' => $validated['short_description'],
                'Overview' => $validated['overview'],
                'Thumbnail' => $thumbnailUrl,
                'Total_Hours' => $validated['duration'],
                'Price' => $validated['price'],
                'Old_Price' => $validated['old_price'] ?? null,
                'Status' => $newStatus,
                'category_id' => $validated['category_id'] ?? null,
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
            'category_id' => ['nullable', 'integer', 'min:1', 'required_without:category_name'],
            'category_name' => ['nullable', 'string', 'max:255', 'required_without:category_id'],
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

    private function resolveCategoryName(array $validated): string
    {
        $name = trim((string) ($validated['category_name'] ?? ''));

        if ($name !== '') {
            return $name;
        }

        return (string) ($validated['category_id'] ?? '');
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
