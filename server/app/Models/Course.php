<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Course extends Model
{
    use HasFactory;

    protected $table = 'courses';
    protected $primaryKey = 'CourseID';

    protected $fillable = [
        'I_ID',
        'UserID',
        'Title',
        'Category',
        'category_name',
        'Description',
        'Overview',
        'Thumbnail',
        'Total_Hours',
        'Price',
        'Status',
        'category_id',
        'category_name',
        'short_description',
        'overview',
        'duration',
        'price',
        'thumbnail',
        'status',
    ];

    public function contents()
    {
        return $this->hasMany(CourseContent::class, 'course_id', 'CourseID');
    }

    public function user()
    {
        return $this->belongsTo(User::class, 'UserID', 'id');
    }
}
