<?php

namespace App\Http\Controllers;

use App\Models\Article;
use App\Models\Course;
use App\Models\User;
use Illuminate\Http\JsonResponse;

class PublicStatsController extends Controller
{
    public function homepage(): JsonResponse
    {
        return response()->json([
            'users' => User::query()->count(),
            'courses' => Course::query()->where('Status', 'published')->count(),
            'articles' => Article::query()->where('Status', 'published')->count(),
        ]);
    }
}