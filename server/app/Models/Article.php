<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasMany;

class Article extends Model
{
    use HasFactory;

    protected $table = 'articles';
    protected $primaryKey = 'Article_ID';

    protected $fillable = [
        'UserID',
        'Title',
        'Content',
        'Tags',
        'Reaction',
        'Status',
        'Category',
        'Read_Time',
        'Views',
    ];

    protected $appends = ['id'];

    public function getIdAttribute()
    {
        return $this->attributes['Article_ID'];
    }

    public function user(): BelongsTo
    {
        return $this->belongsTo(User::class, 'UserID');
    }

    public function approvals(): HasMany
    {
        return $this->hasMany(ArticleApproval::class, 'article_id', 'Article_ID');
    }

    public function comments(): HasMany
    {
        return $this->hasMany(Comment::class, 'Article_ID', 'Article_ID');
    }

    public function reports(): HasMany
    {
        return $this->hasMany(Report::class, 'Article_ID', 'Article_ID');
    }

    public function toArray()
    {
        $array = parent::toArray();
        $array['id'] = $this->Article_ID;
        return $array;
    }
}
