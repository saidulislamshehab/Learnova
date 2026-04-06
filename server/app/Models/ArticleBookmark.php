<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class ArticleBookmark extends Model
{
    use HasFactory;

    protected $table = 'article_bookmarks';
    protected $primaryKey = 'Bookmark_ID';

    protected $fillable = [
        'UserID',
        'Article_ID',
    ];

    public function user(): BelongsTo
    {
        return $this->belongsTo(User::class, 'UserID');
    }

    public function article(): BelongsTo
    {
        return $this->belongsTo(Article::class, 'Article_ID', 'Article_ID');
    }
}
