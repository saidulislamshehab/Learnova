<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\HasMany;

class Course extends Model
{
    use HasFactory;

    protected $table = 'courses';
    protected $primaryKey = 'CourseID';

    protected $fillable = [
        'UserID',
        'Title',
        'Category',
        'Description',
        'Short_Description',
        'Overview',
        'Thumbnail',
        'Total_Hours',
        'Price',
        'Old_Price',
        'Status',
        'Course_Code',
        'category_id',
    ];

    protected static function booted()
    {
        static::creating(function ($course) {
            if (empty($course->Course_Code)) {
                $prefix = strtoupper(substr(preg_replace('/[^a-zA-Z]/', '', $course->Title), 0, 3));
                $code = $prefix . '-' . strtoupper(\Illuminate\Support\Str::random(6));
                while (static::where('Course_Code', $code)->exists()) {
                    $code = $prefix . '-' . strtoupper(\Illuminate\Support\Str::random(6));
                }
                $course->Course_Code = $code;
            }
        });
    }

    public function contents()
    {
        return $this->hasMany(CourseContent::class, 'course_id', 'CourseID');
    }

    public function enrollments(): HasMany
    {
        return $this->hasMany(Enrollment::class, 'CourseID', 'CourseID');
    }

    public function user()
    {
        return $this->belongsTo(User::class, 'UserID', 'id');
    }
}
