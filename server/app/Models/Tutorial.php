<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsToMany;

class Tutorial extends Model
{
    use HasFactory;

    protected $table = 'tutorials';
    protected $primaryKey = 'T_ID';

    protected $fillable = [
        'Title',
        'Category',
        'Description',
        'Status',
    ];

    /**
     * Get the articles for the tutorial.
     */
    public function articles(): BelongsToMany
    {
        return $this->belongsToMany(Article::class, 'tutorial_articles', 'tutorial_id', 'article_id', 'T_ID', 'Article_ID')
            ->withPivot('order')
            ->withTimestamps()
            ->orderBy('tutorial_articles.order');
    }
}
