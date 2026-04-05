<?php

namespace App\Models;

// use Illuminate\Contracts\Auth\MustVerifyEmail;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Foundation\Auth\User as Authenticatable;
use Illuminate\Notifications\Notifiable;

class User extends Authenticatable implements \PHPOpenSourceSaver\JWTAuth\Contracts\JWTSubject
{
    /** @use HasFactory<\Database\Factories\UserFactory> */
    use HasFactory, Notifiable;

    /**
     * The attributes that are mass assignable.
     *
     * @var list<string>
     */
    protected $fillable = [
        'name',
        'username',
        'email',
        'role',
        'password',
        'picture',
        'bio',
        'gender',
        'country',
        'number',
        'city',
        'designation',
        'experience',
        'company_name',
        'qualifications',
        'institution',
        'github_link',
        'linkedin_link',
    ];

    /**
     * The "booted" method of the model.
     */
    protected static function booted()
    {
        static::saving(function ($user) {
            if (!$user->username && $user->name) {
                // Generate initial username: saidul islam -> saidul.islam.me
                $baseUsername = str_replace(' ', '.', strtolower(trim($user->name))) . '.me';
                
                // Ensure uniqueness
                $username = $baseUsername;
                $counter = 1;
                while (static::where('username', $username)->where('id', '!=', $user->id)->exists()) {
                    $username = str_replace('.me', '', $baseUsername) . $counter . '.me';
                    $counter++;
                }
                
                $user->username = $username;
            }
        });
    }

    /**
     * The attributes that should be hidden for serialization.
     *
     * @var list<string>
     */
    protected $hidden = [
        'password',
        'remember_token',
    ];

    /**
     * Get the attributes that should be cast.
     *
     * @return array<string, string>
     */
    protected function casts(): array
    {
        return [
            'email_verified_at' => 'datetime',
            'password' => 'hashed',
        ];
    }

    /**
     * Get the identifier that will be stored in the subject claim of the JWT.
     *
     * @return mixed
     */
    public function getJWTIdentifier()
    {
        return $this->getKey();
    }

    /**
     * Return a key value array, containing any custom claims to be added to the JWT.
     *
     * @return array
     */
    public function getJWTCustomClaims(): array
    {
        return [];
    }
}
