<?php

namespace App\Http\Controllers;

use App\Models\Article;
use App\Models\Tutorial;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Validator;

class TutorialController extends Controller
{
    /**
     * Display a listing of tutorials.
     */
    public function index(): JsonResponse
    {
        $tutorials = Tutorial::withCount('articles')
            ->orderBy('created_at', 'desc')
            ->get();

        return response()->json([
            'tutorials' => $tutorials,
        ]);
    }

    /**
     * Store a new tutorial.
     */
    public function store(Request $request): JsonResponse
    {
        $validator = Validator::make($request->all(), [
            'title'       => 'required|string|max:255',
            'category'    => 'required|string|max:100',
            'description' => 'required|string',
            'status'      => 'required|string|in:draft,published',
            'articles'    => 'required|array|min:1',
            'articles.*.id'    => 'required|exists:articles,Article_ID',
            'articles.*.order' => 'required|integer',
        ]);

        if ($validator->fails()) {
            return response()->json(['errors' => $validator->errors()], 422);
        }

        DB::beginTransaction();
        try {
            $tutorial = Tutorial::create([
                'Title'       => $request->title,
                'Category'    => $request->category,
                'Description' => $request->description,
                'Status'      => $request->status,
            ]);

            foreach ($request->articles as $article) {
                $tutorial->articles()->attach($article['id'], [
                    'order' => $article['order']
                ]);
            }

            DB::commit();

            return response()->json([
                'message'  => 'Tutorial created successfully.',
                'tutorial' => $tutorial->load('articles'),
            ], 201);

        } catch (\Exception $e) {
            DB::rollBack();
            return response()->json(['message' => 'Failed to create tutorial: ' . $e->getMessage()], 500);
        }
    }

    /**
     * Search for published articles only.
     */
    public function searchArticles(Request $request): JsonResponse
    {
        $query = $request->query('query');

        $articles = Article::where('Status', 'published')
            ->when($query, function ($q) use ($query) {
                $q->where(function($qq) use ($query) {
                    $qq->where('Title', 'LIKE', "%{$query}%")
                      ->orWhere('Category', 'LIKE', "%{$query}%");
                });
            })
            ->with('user:id,name') // include author info
            ->limit(10)
            ->get();

        return response()->json([
            'articles' => $articles,
        ]);
    }

    /**
     * Show a specific tutorial.
     */
    public function show(int $id): JsonResponse
    {
        $tutorial = Tutorial::with(['articles' => function ($q) {
            $q->with('user:id,name');
        }])->findOrFail($id);

        return response()->json([
            'tutorial' => $tutorial,
        ]);
    }
    /**
     * Delete a tutorial.
     */
    public function destroy(int $id): JsonResponse
    {
        $tutorial = Tutorial::findOrFail($id);

        DB::beginTransaction();
        try {
            // Detach all articles first (clean the pivot table)
            $tutorial->articles()->detach();
            // Delete the tutorial
            $tutorial->delete();

            DB::commit();

            return response()->json([
                'message' => 'Tutorial deleted successfully.',
            ]);
        } catch (\Exception $e) {
            DB::rollBack();
            return response()->json(['message' => 'Failed to delete tutorial: ' . $e->getMessage()], 500);
        }
    }

    /**
     * Display a listing of published tutorials for the public.
     */
    public function indexPublic(): JsonResponse
    {
        $tutorials = Tutorial::where('Status', 'published')
            ->withCount('articles')
            ->orderBy('created_at', 'desc')
            ->get();

        return response()->json([
            'tutorials' => $tutorials,
        ]);
    }

    /**
     * Show a specific tutorial for public.
     */
    public function showPublic(int $id): JsonResponse
    {
        $tutorial = Tutorial::where('Status', 'published')
            ->with(['articles' => function ($q) {
                $q->with('user:id,name');
            }])
            ->findOrFail($id);

        return response()->json([
            'tutorial' => $tutorial,
        ]);
    }
}
