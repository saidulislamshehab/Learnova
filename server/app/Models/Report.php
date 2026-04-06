<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class Report extends Model
{
    use HasFactory;

    protected $table = 'reports';
    protected $primaryKey = 'R_ID';

    protected $fillable = [
        'UserID',
        'Article_ID',
        'Report_Type',
        'Description',
        'Status',
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