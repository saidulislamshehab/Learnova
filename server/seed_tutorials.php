<?php

require __DIR__.'/vendor/autoload.php';
$app = require_once __DIR__.'/bootstrap/app.php';

use App\Models\User;
use App\Models\Article;
use App\Models\Tutorial;
use Illuminate\Contracts\Console\Kernel;

$kernel = $app->make(Kernel::class);
$kernel->bootstrap();

$user = User::where('email', 'shehab@gmail.com')->first();

if (!$user) {
    echo "User shehab@gmail.com not found.\n";
    exit(1);
}

// Fetch all articles for this user order by ID
$articles = Article::where('UserID', $user->id)->orderBy('Article_ID')->get();

if ($articles->count() == 0) {
    echo "No articles found for this user.\n";
    exit(1);
}

$tutorialData = [
    [
        'Title' => 'Modern Web Development Mastery',
        'Category' => 'Web Development',
        'Description' => 'A complete path to becoming a modern web developer focusing on React, TypeScript, and CSS layouts.',
        'article_indices' => [0, 4, 6, 12, 16, 20] 
    ],
    [
        'Title' => 'DevOps and Infrastructure',
        'Category' => 'DevOps',
        'Description' => 'Learn how to manage applications at scale with Docker, Kubernetes, and Git workflows.',
        'article_indices' => [7, 8, 18, 23]
    ],
    [
        'Title' => 'The Data Science Roadmap',
        'Category' => 'Data Science',
        'Description' => 'From Python basics to Machine Learning and Artificial Intelligence.',
        'article_indices' => [3, 15, 20]
    ],
    [
        'Title' => 'Advanced Backend Architectures',
        'Category' => 'Backend Development',
        'Description' => 'Deep dive into Laravel, Node.js, and Microservices design patterns.',
        'article_indices' => [1, 5, 10, 21, 24]
    ],
    [
        'Title' => 'Safe Systems Programming',
        'Category' => 'Software Engineering',
        'Description' => 'Master low-level programming with the memory safety of Rust and concurrency of Go.',
        'article_indices' => [2, 11, 22]
    ],
    [
        'Title' => 'Professional Software Engineering',
        'Category' => 'Software Engineering',
        'Description' => 'Core principles of clean code, algorithms, and team collaboration.',
        'article_indices' => [13, 14, 19]
    ]
];

foreach ($tutorialData as $data) {
    $tutorial = Tutorial::create([
        'Title' => $data['Title'],
        'Category' => $data['Category'],
        'Description' => $data['Description'],
        'Status' => 'published'
    ]);

    $syncData = [];
    foreach ($data['article_indices'] as $order => $index) {
        if (isset($articles[$index])) {
            $syncData[$articles[$index]->Article_ID] = ['order' => $order + 1];
        }
    }
    
    if (!empty($syncData)) {
        $tutorial->articles()->attach($syncData);
    }
}

echo "6 tutorials created successfully using existing articles for shehab@gmail.com\n";
