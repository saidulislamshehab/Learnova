<?php

namespace App\Http\Controllers;

use App\Models\Article;
use App\Models\Course;
use App\Models\Tutorial;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;

class SearchController extends Controller
{
    private function normalizeType(string $type): string
    {
        return match (strtolower($type)) {
            'article', 'articles' => 'article',
            'course', 'courses' => 'course',
            'tutorial', 'tutorials' => 'tutorial',
            default => 'all',
        };
    }

    private function clampPerPage(int $perPage): int
    {
        return max(5, min($perPage, 10));
    }

    public function suggestions(Request $request): JsonResponse
    {
        $query = trim((string) $request->query('query', ''));

        if (mb_strlen($query) < 2) {
            return response()->json([
                'results' => [],
            ]);
        }

        $articleMatches = Article::query()
            ->where('Status', 'published')
            ->where(function ($builder) use ($query) {
                $builder
                    ->where('Title', 'LIKE', "%{$query}%")
                    ->orWhere('Category', 'LIKE', "%{$query}%")
                    ->orWhere('Content', 'LIKE', "%{$query}%");
            })
            ->orderByDesc('created_at')
            ->limit(6)
            ->get(['Article_ID', 'Title', 'Category'])
            ->map(fn (Article $item) => [
                'type' => 'article',
                'id' => (int) $item->Article_ID,
                'title' => (string) $item->Title,
                'subtitle' => (string) ($item->Category ?? 'Article'),
            ]);

        $courseMatches = Course::query()
            ->where('Status', 'published')
            ->where(function ($builder) use ($query) {
                $builder
                    ->where('Title', 'LIKE', "%{$query}%")
                    ->orWhere('Category', 'LIKE', "%{$query}%")
                    ->orWhere('Description', 'LIKE', "%{$query}%")
                    ->orWhere('Overview', 'LIKE', "%{$query}%");
            })
            ->orderByDesc('created_at')
            ->limit(4)
            ->get(['CourseID', 'Title', 'Category'])
            ->map(fn (Course $item) => [
                'type' => 'course',
                'id' => (int) $item->CourseID,
                'title' => (string) $item->Title,
                'subtitle' => (string) ($item->Category ?? 'Course'),
            ]);

        $tutorialMatches = Tutorial::query()
            ->where('Status', 'published')
            ->where(function ($builder) use ($query) {
                $builder
                    ->where('Title', 'LIKE', "%{$query}%")
                    ->orWhere('Category', 'LIKE', "%{$query}%")
                    ->orWhere('Description', 'LIKE', "%{$query}%");
            })
            ->orderByDesc('created_at')
            ->limit(4)
            ->get(['T_ID', 'Title', 'Category'])
            ->map(fn (Tutorial $item) => [
                'type' => 'tutorial',
                'id' => (int) $item->T_ID,
                'title' => (string) $item->Title,
                'subtitle' => (string) ($item->Category ?? 'Tutorial'),
            ]);

        $results = $articleMatches
            ->concat($courseMatches)
            ->concat($tutorialMatches)
            ->take(14)
            ->values();

        return response()->json([
            'results' => $results,
        ]);
    }

    public function search(Request $request): JsonResponse
    {
        $query = trim((string) $request->query('query', ''));
        $type = $this->normalizeType((string) $request->query('type', 'all'));
        $page = max(1, (int) $request->query('page', 1));
        $perPage = $this->clampPerPage((int) $request->query('per_page', 6));

        if ($query === '') {
            return response()->json([
                'query' => $query,
                'type' => $type,
                'items' => [],
                'page' => $page,
                'per_page' => $perPage,
                'total' => 0,
                'total_pages' => 0,
                'counts' => [
                    'articles' => 0,
                    'courses' => 0,
                    'tutorials' => 0,
                    'all' => 0,
                ],
            ]);
        }

        $articleQuery = Article::query()
            ->where('Status', 'published')
            ->where(function ($builder) use ($query) {
                $builder
                    ->where('Title', 'LIKE', "%{$query}%")
                    ->orWhere('Category', 'LIKE', "%{$query}%")
                    ->orWhere('Tags', 'LIKE', "%{$query}%")
                    ->orWhere('Content', 'LIKE', "%{$query}%");
            });

        $courseQuery = Course::query()
            ->where('Status', 'published')
            ->where(function ($builder) use ($query) {
                $builder
                    ->where('Title', 'LIKE', "%{$query}%")
                    ->orWhere('Category', 'LIKE', "%{$query}%")
                    ->orWhere('Description', 'LIKE', "%{$query}%")
                    ->orWhere('Overview', 'LIKE', "%{$query}%");
            });

        $tutorialQuery = Tutorial::query()
            ->where('Status', 'published')
            ->where(function ($builder) use ($query) {
                $builder
                    ->where('Title', 'LIKE', "%{$query}%")
                    ->orWhere('Category', 'LIKE', "%{$query}%")
                    ->orWhere('Description', 'LIKE', "%{$query}%");
            });

        $articleCount = (clone $articleQuery)->count();
        $courseCount = (clone $courseQuery)->count();
        $tutorialCount = (clone $tutorialQuery)->count();

        $counts = [
            'articles' => $articleCount,
            'courses' => $courseCount,
            'tutorials' => $tutorialCount,
            'all' => $articleCount + $courseCount + $tutorialCount,
        ];

        if ($type === 'article') {
            $total = $articleCount;
            $totalPages = $total > 0 ? (int) ceil($total / $perPage) : 0;
            $safePage = $totalPages > 0 ? min($page, $totalPages) : 1;
            $items = $articleQuery
                ->orderByDesc('created_at')
                ->offset(($safePage - 1) * $perPage)
                ->limit($perPage)
                ->get(['Article_ID', 'Title', 'Category', 'Content'])
                ->map(fn (Article $item) => [
                    'type' => 'article',
                    'id' => (int) $item->Article_ID,
                    'title' => (string) $item->Title,
                    'subtitle' => (string) ($item->Category ?? 'Article'),
                    'description' => (string) \Illuminate\Support\Str::limit(strip_tags((string) ($item->Content ?? '')), 120),
                ])
                ->values();

            return response()->json([
                'query' => $query,
                'type' => $type,
                'items' => $items,
                'page' => $safePage,
                'per_page' => $perPage,
                'total' => $total,
                'total_pages' => $totalPages,
                'counts' => $counts,
            ]);
        }

        if ($type === 'course') {
            $total = $courseCount;
            $totalPages = $total > 0 ? (int) ceil($total / $perPage) : 0;
            $safePage = $totalPages > 0 ? min($page, $totalPages) : 1;
            $items = $courseQuery
                ->orderByDesc('created_at')
                ->offset(($safePage - 1) * $perPage)
                ->limit($perPage)
                ->get(['CourseID', 'Title', 'Category', 'Description', 'Overview'])
                ->map(fn (Course $item) => [
                    'type' => 'course',
                    'id' => (int) $item->CourseID,
                    'title' => (string) $item->Title,
                    'subtitle' => (string) ($item->Category ?? 'Course'),
                    'description' => (string) \Illuminate\Support\Str::limit(strip_tags((string) ($item->Description ?? $item->Overview ?? '')), 120),
                ])
                ->values();

            return response()->json([
                'query' => $query,
                'type' => $type,
                'items' => $items,
                'page' => $safePage,
                'per_page' => $perPage,
                'total' => $total,
                'total_pages' => $totalPages,
                'counts' => $counts,
            ]);
        }

        if ($type === 'tutorial') {
            $total = $tutorialCount;
            $totalPages = $total > 0 ? (int) ceil($total / $perPage) : 0;
            $safePage = $totalPages > 0 ? min($page, $totalPages) : 1;
            $items = $tutorialQuery
                ->orderByDesc('created_at')
                ->offset(($safePage - 1) * $perPage)
                ->limit($perPage)
                ->get(['T_ID', 'Title', 'Category', 'Description'])
                ->map(fn (Tutorial $item) => [
                    'type' => 'tutorial',
                    'id' => (int) $item->T_ID,
                    'title' => (string) $item->Title,
                    'subtitle' => (string) ($item->Category ?? 'Tutorial'),
                    'description' => (string) \Illuminate\Support\Str::limit(strip_tags((string) ($item->Description ?? '')), 120),
                ])
                ->values();

            return response()->json([
                'query' => $query,
                'type' => $type,
                'items' => $items,
                'page' => $safePage,
                'per_page' => $perPage,
                'total' => $total,
                'total_pages' => $totalPages,
                'counts' => $counts,
            ]);
        }

        // "all" tab: merge top items from each category and paginate combined list.
        $allItems = $articleQuery
            ->orderByDesc('created_at')
            ->limit(24)
            ->get(['Article_ID', 'Title', 'Category', 'Content', 'created_at'])
            ->map(fn (Article $item) => [
                'type' => 'article',
                'id' => (int) $item->Article_ID,
                'title' => (string) $item->Title,
                'subtitle' => (string) ($item->Category ?? 'Article'),
                'description' => (string) \Illuminate\Support\Str::limit(strip_tags((string) ($item->Content ?? '')), 120),
                'created_at' => optional($item->created_at)->toIso8601String(),
            ])
            ->concat(
                $courseQuery
                    ->orderByDesc('created_at')
                    ->limit(24)
                    ->get(['CourseID', 'Title', 'Category', 'Description', 'Overview', 'created_at'])
                    ->map(fn (Course $item) => [
                        'type' => 'course',
                        'id' => (int) $item->CourseID,
                        'title' => (string) $item->Title,
                        'subtitle' => (string) ($item->Category ?? 'Course'),
                        'description' => (string) \Illuminate\Support\Str::limit(strip_tags((string) ($item->Description ?? $item->Overview ?? '')), 120),
                        'created_at' => optional($item->created_at)->toIso8601String(),
                    ])
            )
            ->concat(
                $tutorialQuery
                    ->orderByDesc('created_at')
                    ->limit(24)
                    ->get(['T_ID', 'Title', 'Category', 'Description', 'created_at'])
                    ->map(fn (Tutorial $item) => [
                        'type' => 'tutorial',
                        'id' => (int) $item->T_ID,
                        'title' => (string) $item->Title,
                        'subtitle' => (string) ($item->Category ?? 'Tutorial'),
                        'description' => (string) \Illuminate\Support\Str::limit(strip_tags((string) ($item->Description ?? '')), 120),
                        'created_at' => optional($item->created_at)->toIso8601String(),
                    ])
            )
            ->sortByDesc('created_at')
            ->values();

        $counts['all'] = $allItems->count();
        $total = $counts['all'];
        $totalPages = $total > 0 ? (int) ceil($total / $perPage) : 0;
        $safePage = $totalPages > 0 ? min($page, $totalPages) : 1;
        $items = $allItems
            ->slice(($safePage - 1) * $perPage, $perPage)
            ->values()
            ->map(fn (array $item) => [
                'type' => $item['type'],
                'id' => (int) $item['id'],
                'title' => (string) $item['title'],
                'subtitle' => (string) $item['subtitle'],
                'description' => (string) $item['description'],
            ])
            ->values();

        return response()->json([
            'query' => $query,
            'type' => $type,
            'items' => $items,
            'page' => $safePage,
            'per_page' => $perPage,
            'total' => $total,
            'total_pages' => $totalPages,
            'counts' => $counts,
        ]);
    }
}
