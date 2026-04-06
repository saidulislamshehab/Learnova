<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class Feedback extends Model
{
    use HasFactory;

    protected $table = 'feedbacks';
    protected $primaryKey = 'F_ID';

    protected $fillable = [
        'UserID',
        'Subject',
        'Type',
        'Description',
        'Status',
    ];

    public function user(): BelongsTo
    {
        return $this->belongsTo(User::class, 'UserID');
    }
}
