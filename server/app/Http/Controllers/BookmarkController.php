<?php

namespace App\Http\Controllers;

use App\Models\ArticleBookmark;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;

class BookmarkController extends Controller
{
    /**
     * List the authenticated user's bookmarked articles.
     */
    public function index(Request $request): JsonResponse
    {
        $bookmarks = ArticleBookmark::query()
            ->where('UserID', $request->user()->id)
            ->with(['article' => function ($q) {
                $q->with('user:id,name,picture');
            }])
            ->orderByDesc('created_at')
            ->get();

        return response()->json([
            'bookmarks' => $bookmarks,
        ]);
    }

    /**
     * Toggle bookmark for an article.
     * If already bookmarked, remove it. Otherwise, add it.
     */
    public function toggle(Request $request, int $articleId): JsonResponse
    {
        $userId = $request->user()->id;

        $existing = ArticleBookmark::where('UserID', $userId)
            ->where('Article_ID', $articleId)
            ->first();

        if ($existing) {
            $existing->delete();

            return response()->json([
                'message'    => 'Bookmark removed.',
                'bookmarked' => false,
            ]);
        }

        ArticleBookmark::create([
            'UserID'     => $userId,
            'Article_ID' => $articleId,
        ]);

        return response()->json([
            'message'    => 'Article bookmarked.',
            'bookmarked' => true,
        ], 201);
    }

    /**
     * Check if a specific article is bookmarked by the current user.
     */
    public function status(Request $request, int $articleId): JsonResponse
    {
        $exists = ArticleBookmark::where('UserID', $request->user()->id)
            ->where('Article_ID', $articleId)
            ->exists();

        return response()->json([
            'bookmarked' => $exists,
        ]);
    }
}
