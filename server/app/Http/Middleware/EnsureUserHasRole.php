<?php

namespace App\Http\Middleware;

use Closure;
use Illuminate\Http\Request;
use Symfony\Component\HttpFoundation\Response;

class EnsureUserHasRole
{
    /**
     * Handle an incoming request.
     */
    public function handle(Request $request, \Closure $next, string ...$roles): Response
    {
        $user = \Illuminate\Support\Facades\Auth::guard('api')->user();

        if (! $user) {
            return response()->json([
                'message' => 'Unauthenticated.',
            ], 401);
        }

        $normalizedUserRole = strtolower((string) ($user->role ?? 'student'));
        $normalizedAllowedRoles = array_map('strtolower', $roles);

        if (! in_array($normalizedUserRole, $normalizedAllowedRoles, true)) {
            return response()->json([
                'message' => 'Forbidden. You do not have the required role.',
                'user_role' => $normalizedUserRole,
                'required_roles' => $normalizedAllowedRoles,
            ], 403);
        }

        // Share the authenticated user for the remainder of the request
        $request->setUserResolver(fn() => $user);

        return $next($request);
    }
}
