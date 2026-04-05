<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class ExpertApply extends Model
{
    use HasFactory;

    protected $table = 'expert_applies';
    protected $primaryKey = 'Ex_Ap_ID';

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
