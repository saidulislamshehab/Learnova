<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class CourseContent extends Model
{
    use HasFactory;

    protected $table = 'course_contents';

    protected $fillable = [
        'course_id',
        'title',
        'description',
        'youtube_url',
        'order',
    ];

    public function course()
    {
        return $this->belongsTo(Course::class, 'course_id', 'CourseID');
    }
}
