<?php

namespace App\Http\Controllers;

use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Facades\Storage;
use Illuminate\Validation\ValidationException;

class AuthController extends Controller
{
    private const DEFAULT_PROFILE_PICTURE = 'https://res.cloudinary.com/dp1li5tkd/image/upload/v1774902128/silver-membership-icon-default-avatar-profile-icon-membership-icon-social-media-user-image-vector-illustration_561158-4195_txcng6.jpg';

    public function register(Request $request)
    {
        try {
            $validated = $request->validate([
                'name' => 'required|string|max:255',
                'email' => 'required|string|email|max:255|unique:users',
                'password' => 'required|string|min:8',
            ]);

            $user = User::create([
                'name' => $validated['name'],
                'email' => $validated['email'],
                'password' => Hash::make($validated['password']),
                'role' => 'student',
                'picture' => self::DEFAULT_PROFILE_PICTURE,
            ]);

            $token = Auth::login($user);

            return response()->json([
                'message' => 'User registered successfully',
                'user' => $user,
                'authorization' => [
                    'token' => $token,
                    'type' => 'bearer',
                ]
            ], 201);

        } catch (ValidationException $e) {
            return response()->json(['errors' => $e->errors()], 422);
        } catch (\Exception $e) {
            return response()->json(['message' => 'Server Error: ' . $e->getMessage()], 500);
        }
    }

    public function login(Request $request)
    {
        try {
            $credentials = $request->validate([
                'email' => 'required|email',
                'password' => 'required',
            ]);

            if (! $token = Auth::attempt($credentials)) {
                return response()->json(['message' => 'Invalid credentials'], 401);
            }

            return $this->respondWithToken($token);

        } catch (ValidationException $e) {
            return response()->json(['errors' => $e->errors()], 422);
        }
    }
    
    public function me()
    {
        return response()->json(Auth::user());
    }

    public function logout()
    {
        Auth::logout();

        return response()->json(['message' => 'Successfully logged out']);
    }

    public function refresh()
    {
        return $this->respondWithToken(Auth::refresh());
    }

    public function updateProfile(Request $request)
    {
        $user = $request->user();

        $rules = [
            'name' => 'nullable|string|max:255',
            'picture' => 'nullable|string|max:2048',
            'bio' => 'nullable|string|max:2000',
            'gender' => 'nullable|string|max:50',
            'country' => 'nullable|string|max:100',
            'number' => 'nullable|string|max:30',
            'city' => 'nullable|string|max:100',
            'designation' => 'nullable|string|max:255',
            'experience' => 'nullable|integer|min:0|max:100',
            'company_name' => 'nullable|string|max:255',
            'qualifications' => 'nullable|string|max:2000',
            'institution' => 'nullable|string|max:255',
            'github_link' => 'nullable|url|max:255',
            'linkedin_link' => 'nullable|url|max:255',
        ];

        $validated = $request->validate($rules);

        $updateData = [];
        foreach (array_keys($rules) as $field) {
            if ($request->exists($field)) {
                $updateData[$field] = $validated[$field] ?? null;
            }
        }

        if (!empty($updateData)) {
            $user->update($updateData);
        }

        return response()->json([
            'message' => 'Profile updated successfully',
            'user' => $user->fresh(),
        ]);
    }

    public function updateProfilePicture(Request $request)
    {
        $user = $request->user();

        $validated = $request->validate([
            'picture' => 'required|image|mimes:jpg,jpeg,png,webp|max:5120',
        ]);

        $publicStoragePrefix = rtrim(url('/storage'), '/');
        $oldPicture = (string) ($user->picture ?? '');
        $oldPath = null;

        if ($oldPicture !== '') {
            if (str_starts_with($oldPicture, $publicStoragePrefix . '/')) {
                $oldPath = substr($oldPicture, strlen($publicStoragePrefix . '/'));
            } elseif (str_starts_with($oldPicture, '/storage/')) {
                $oldPath = substr($oldPicture, strlen('/storage/'));
            }
        }

        if ($oldPath) {
            Storage::disk('public')->delete($oldPath);
        }

        $storedPath = $validated['picture']->store('profile-pictures', 'public');
        $pictureUrl = url(Storage::url($storedPath));

        $user->update([
            'picture' => $pictureUrl,
        ]);

        return response()->json([
            'message' => 'Profile picture updated successfully',
            'user' => $user->fresh(),
        ]);
    }

    protected function respondWithToken($token)
    {
        return response()->json([
            'message' => 'Login successful',
            'user' => Auth::user(),
            'authorization' => [
                'token' => $token,
                'type' => 'bearer',
                'expires_in' => Auth::factory()->getTTL() * 60
            ]
        ]);
    }
}
