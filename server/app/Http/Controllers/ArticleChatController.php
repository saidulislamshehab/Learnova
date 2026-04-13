<?php

namespace App\Http\Controllers;

use App\Models\Article;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Http;

class ArticleChatController extends Controller
{
    public function ask(Request $request, int $id): JsonResponse
    {
        $validated = $request->validate([
            'message' => ['required', 'string', 'max:2000'],
            'history' => ['nullable', 'array', 'max:10'],
            'history.*.role' => ['required_with:history', 'string', 'in:user,assistant'],
            'history.*.content' => ['required_with:history', 'string', 'max:2000'],
        ]);

        $apiKey = config('services.openrouter.api_key');
        if (!$apiKey) {
            return response()->json([
                'message' => 'AI service is not configured.',
            ], 500);
        }

        $article = Article::query()
            ->where('Article_ID', $id)
            ->where('Status', 'published')
            ->first();

        if (!$article) {
            return response()->json([
                'message' => 'Article not found.',
            ], 404);
        }

        $articleContent = trim(strip_tags((string) $article->Content));
        if ($articleContent === '') {
            $articleContent = 'No article content available.';
        }

        $systemPrompt = implode("\n", [
            'You are a helpful AI assistant inside an article reading platform.',
            '',
            'ARTICLE:',
            '"""',
            $articleContent,
            '"""',
            '',
            'RULES:',
            '- Only use the article above',
            '- Do not use outside knowledge',
            "- If answer not found -> say it's not mentioned",
            '- Keep answers simple and clear',
        ]);

        $history = collect($validated['history'] ?? [])
            ->take(-4)
            ->map(fn (array $item): array => [
                'role' => $item['role'],
                'content' => $item['content'],
            ])
            ->values()
            ->all();

        $messages = array_merge(
            [
                ['role' => 'system', 'content' => $systemPrompt],
            ],
            $history,
            [
                ['role' => 'user', 'content' => $validated['message']],
            ]
        );

        try {
            $response = Http::timeout(45)
                ->withHeaders([
                    'Authorization' => 'Bearer ' . $apiKey,
                    'Content-Type' => 'application/json',
                ])
                ->post('https://openrouter.ai/api/v1/chat/completions', [
                    'model' => config('services.openrouter.model', 'openai/gpt-3.5-turbo'),
                    'messages' => $messages,
                ]);
        } catch (\Throwable $e) {
            return response()->json([
                'message' => 'Failed to connect to AI service.',
            ], 502);
        }

        if (!$response->successful()) {
            return response()->json([
                'message' => 'AI service returned an error.',
                'details' => $response->json('error.message') ?? $response->body(),
            ], 502);
        }

        $answer = (string) data_get($response->json(), 'choices.0.message.content', '');
        if ($answer === '') {
            $answer = 'This is not mentioned in the article.';
        }

        return response()->json([
            'answer' => $answer,
        ]);
    }
}
