<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class InstructorApply extends Model
{
    use HasFactory;

    protected $table = 'instructor_applies';
    protected $primaryKey = 'In_Ap_ID';

    protected $fillable = [
        'UserID',
        'Expertise',
        'About',
        'Status',
    ];

    public function user(): BelongsTo
    {
        return $this->belongsTo(User::class, 'UserID');
    }
}
