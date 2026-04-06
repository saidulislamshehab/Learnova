<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Enrollment extends Model
{
    use HasFactory;

    protected $fillable = [
        'UserID',
        'CourseID',
        'Payment_Method',
        'Amount_Paid',
        'Enrolled_At',
        'Progress_Percent',
        'Completed_Lessons',
        'Last_Accessed_At'
    ];

    protected $casts = [
        'Enrolled_At' => 'datetime',
        'Last_Accessed_At' => 'datetime',
        'Amount_Paid' => 'decimal:2',
    ];

    public function user()
    {
        return $this->belongsTo(User::class, 'UserID');
    }

    public function course()
    {
        return $this->belongsTo(Course::class, 'CourseID');
    }
}
