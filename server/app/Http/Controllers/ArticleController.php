<?php

namespace App\Http\Controllers;

use App\Models\Article;
use App\Models\Comment;
use App\Models\Report;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;

class ArticleController extends Controller
{
    public function index(Request $request): JsonResponse
    {
        $articles = Article::query()
            ->with('user:id,name,picture')
            ->where('Status', 'published')
            ->orderByDesc('created_at')
            ->get();

        return response()->json([
            'articles' => $articles,
        ]);
    }

    public function myArticles(Request $request): JsonResponse
    {
        $articles = Article::query()
            ->where('UserID', $request->user()->id)
            ->orderByDesc('created_at')
            ->get();

        return response()->json([
            'articles' => $articles,
        ]);
    }

    public function show(int $id): JsonResponse
    {
        $article = Article::with('user:id,name,picture')->findOrFail($id);
        
        // Increment views without touching updated_at
        Article::withoutTimestamps(fn () => $article->increment('Views'));

        return response()->json([
            'article' => $article,
        ]);
    }

    public function comments(int $id): JsonResponse
    {
        $comments = Comment::query()
            ->with('user:id,name,picture')
            ->where('Article_ID', $id)
            ->orderBy('created_at', 'asc')
            ->get();

        return response()->json([
            'comments' => $comments,
        ]);
    }

    public function storeComment(Request $request, int $id): JsonResponse
    {
        $validated = $request->validate([
            'content' => ['required', 'string', 'max:5000'],
        ]);

        $comment = Comment::create([
            'UserID' => $request->user()->id,
            'Article_ID' => $id,
            'Content' => $validated['content'],
        ]);

        $comment->load('user:id,name,picture');

        return response()->json([
            'message' => 'Comment created successfully.',
            'comment' => $comment,
        ], 201);
    }

    public function storeReport(Request $request, int $id): JsonResponse
    {
        $article = Article::findOrFail($id);

        $validated = $request->validate([
            'report_type' => ['required', 'string', 'max:50'],
            'description' => ['nullable', 'string', 'max:5000'],
        ]);

        $report = Report::create([
            'UserID' => $request->user()->id,
            'Article_ID' => $article->Article_ID,
            'Report_Type' => $validated['report_type'],
            'Description' => $validated['description'] ?? null,
            'Status' => 'pending',
        ]);

        return response()->json([
            'message' => 'Article reported successfully.',
            'report' => $report,
        ], 201);
    }

    public function indexPending(Request $request): JsonResponse
    {
        $articles = Article::query()
            ->with(['user:id,name,picture', 'approvals'])
            ->whereHas('approvals', function ($q) {
                $q->where('status', 'pending');
            })
            ->orderByDesc('created_at')
            ->get();

        return response()->json([
            'articles' => $articles,
        ]);
    }

    public function moderate(Request $request, int $id): JsonResponse
    {
        $validated = $request->validate([
            'status' => ['required', 'string', 'in:published,rejected'],
            'comments' => ['nullable', 'string'],
        ]);

        $article = Article::findOrFail($id);
        
        $article->update([
            'Status' => $validated['status'],
        ]);

        DB::table('article_approvals')
            ->where('article_id', $id)
            ->where('status', 'pending')
            ->update([
                'admin_id' => $request->user()->id,
                'status' => $validated['status'] === 'published' ? 'approved' : 'rejected',
                'comments' => $validated['comments'] ?? null,
                'updated_at' => now(),
            ]);

        return response()->json([
            'message' => 'Article status updated successfully.',
            'article' => $article->fresh(),
        ]);
    }

    public function store(Request $request): JsonResponse
    {
        $validated = $request->validate([
            'title' => ['required', 'string', 'max:255'],
            'content' => ['required', 'string'],
            'category' => ['nullable', 'string', 'max:255'],
            'tags' => ['nullable', 'string', 'max:255'],
            'status' => ['nullable', 'string', 'in:draft,pending,published,rejected'],
            'read_time' => ['nullable', 'string', 'max:30'],
        ]);

        $role = $request->user()->role;
        $status = $validated['status'] ?? 'draft';

        // Auto-approve if admin
        if ($status === 'pending' && $role === 'admin') {
            $status = 'published';
        }

        $article = Article::create([
            'UserID' => $request->user()->id,
            'Title' => $validated['title'],
            'Content' => $validated['content'],
            'Category' => $validated['category'] ?? 'General',
            'Tags' => $validated['tags'] ?? '',
            'Status' => $status,
            'Read_Time' => $validated['read_time'] ?? '0 min',
            'Reaction' => 0,
            'Views' => 0,
        ]);

        if ($status === 'pending') {
            DB::table('article_approvals')->insert([
                'article_id' => $article->Article_ID,
                'status' => 'pending',
                'created_at' => now(),
                'updated_at' => now(),
            ]);
        }

        return response()->json([
            'message' => 'Article created successfully.',
            'article' => $article,
        ], 201);
    }

    public function update(Request $request, int $id): JsonResponse
    {
        $article = Article::findOrFail($id);

        if ((int) $article->UserID !== (int) $request->user()->id) {
            return response()->json([
                'message' => 'You are not allowed to update this article.',
            ], 403);
        }

        $validated = $request->validate([
            'title' => ['required', 'string', 'max:255'],
            'content' => ['required', 'string'],
            'category' => ['nullable', 'string', 'max:255'],
            'tags' => ['nullable', 'string', 'max:255'],
            'status' => ['nullable', 'string', 'in:draft,pending,published,rejected'],
            'read_time' => ['nullable', 'string', 'max:30'],
        ]);

        $role = $request->user()->role;
        $status = $validated['status'] ?? $article->Status;

        // Auto-approve if admin
        if ($status === 'pending' && $role === 'admin') {
            $status = 'published';
        }

        $article->update([
            'Title' => $validated['title'],
            'Content' => $validated['content'],
            'Category' => $validated['category'] ?? $article->Category,
            'Tags' => $validated['tags'] ?? $article->Tags,
            'Status' => $status,
            'Read_Time' => $validated['read_time'] ?? $article->Read_Time,
        ]);

        if ($status === 'pending') {
            DB::table('article_approvals')->updateOrInsert(
                ['article_id' => $article->Article_ID, 'status' => 'pending'],
                [
                    'created_at' => now(),
                    'updated_at' => now(),
                ]
            );
        }

        return response()->json([
            'message' => 'Article updated successfully.',
            'article' => $article,
        ]);
    }

    /**
     * Toggle reaction (like) on an article. Increments Reaction count.
     */
    public function toggleReaction(Request $request, int $id): JsonResponse
    {
        $article = Article::findOrFail($id);

        // Increment without touching updated_at
        Article::withoutTimestamps(fn () => $article->increment('Reaction'));

        return response()->json([
            'message'   => 'Reaction added.',
            'reactions'  => $article->fresh()->Reaction,
        ]);
    }
}
