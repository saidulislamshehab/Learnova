<?php

namespace App\Http\Controllers;

use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Auth\Events\PasswordReset;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Facades\Password;
use Illuminate\Support\Facades\Storage;
use Illuminate\Support\Str;
use Illuminate\Validation\ValidationException;

class AuthController extends Controller
{
    private const DEFAULT_PROFILE_PICTURE = 'https://res.cloudinary.com/dp1li5tkd/image/upload/v1776439457/silver-membership-icon-default-avatar-profile-icon-membership-icon-social-media-user-image-illustration-vector_xxnra2.jpg';

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

            $token = Auth::guard('api')->login($user);

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

            // Manually authenticate using email instead of the default username lookup
            $user = User::where('email', $credentials['email'])->first();

            if (!$user || !Hash::check($credentials['password'], $user->password)) {
                return response()->json(['message' => 'Invalid credentials'], 401);
            }

            // Generate JWT token for the authenticated user
            $token = Auth::guard('api')->login($user);

            return $this->respondWithToken($token);

        } catch (ValidationException $e) {
            return response()->json(['errors' => $e->errors()], 422);
        }
    }

    public function forgotPassword(Request $request)
    {
        try {
            $validated = $request->validate([
                'email' => 'required|email',
            ]);

            $status = Password::sendResetLink([
                'email' => $validated['email'],
            ]);

            if ($status === Password::RESET_LINK_SENT) {
                return response()->json([
                    'message' => __('passwords.sent'),
                ]);
            }

            return response()->json([
                'message' => __('passwords.user'),
            ], 422);
        } catch (ValidationException $e) {
            return response()->json(['errors' => $e->errors()], 422);
        } catch (\Exception $e) {
            return response()->json(['message' => 'Server Error: ' . $e->getMessage()], 500);
        }
    }

    public function resetPassword(Request $request)
    {
        try {
            $validated = $request->validate([
                'token' => 'required|string',
                'email' => 'required|email',
                'password' => 'required|string|min:8|confirmed',
            ]);

            $status = Password::reset(
                [
                    'email' => $validated['email'],
                    'password' => $validated['password'],
                    'password_confirmation' => $request->input('password_confirmation'),
                    'token' => $validated['token'],
                ],
                function (User $user, string $password) {
                    $user->forceFill([
                        'password' => Hash::make($password),
                        'remember_token' => Str::random(60),
                    ])->save();

                    event(new PasswordReset($user));
                }
            );

            if ($status === Password::PASSWORD_RESET) {
                return response()->json([
                    'message' => __('passwords.reset'),
                ]);
            }

            return response()->json([
                'message' => __($status),
            ], 422);
        } catch (ValidationException $e) {
            return response()->json(['errors' => $e->errors()], 422);
        } catch (\Exception $e) {
            return response()->json(['message' => 'Server Error: ' . $e->getMessage()], 500);
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

    public function changePassword(Request $request)
    {
        $user = $request->user();

        try {
            $validated = $request->validate([
                'current_password' => 'required|string',
                'new_password' => 'required|string|min:8|confirmed',
            ]);

            if (!Hash::check($validated['current_password'], $user->password)) {
                return response()->json([
                    'message' => 'The provided current password does not match your record.',
                    'errors' => ['current_password' => ['Incorrect current password.']]
                ], 422);
            }

            $user->update([
                'password' => Hash::make($validated['new_password'])
            ]);

            return response()->json([
                'message' => 'Password updated successfully'
            ]);

        } catch (ValidationException $e) {
            return response()->json(['errors' => $e->errors()], 422);
        } catch (\Exception $e) {
            return response()->json(['message' => 'Server Error: ' . $e->getMessage()], 500);
        }
    }

    public function deleteAccount(Request $request)
    {
        $user = $request->user();

        try {
            $user->delete();
            return response()->json([
                'message' => 'Account deleted successfully'
            ]);
        } catch (\Exception $e) {
            return response()->json(['message' => 'Server Error: ' . $e->getMessage()], 500);
        }
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
        $user = Auth::user();

        // If the user doesn't have a username yet, saving them will trigger 
        // the automatic generation logic I added to the User model
        if (!$user->username) {
            $user->save();
        }

        return response()->json([
            'message' => 'Login successful',
            'user' => $user->fresh(),
            'authorization' => [
                'token' => $token,
                'type' => 'bearer',
                'expires_in' => Auth::factory()->getTTL() * 60
            ]
        ]);
    }
}
