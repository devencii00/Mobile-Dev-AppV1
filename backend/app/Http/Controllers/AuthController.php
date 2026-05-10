<?php

namespace App\Http\Controllers;

use App\Models\User;
use Hash;
use Illuminate\Http\Request;
use Illuminate\Validation\Rules\Password;

class AuthController extends Controller
{
    public function user(Request $request)
    {
        return $request->user();
    }

    public function register(Request $request)
    {
        $request->validate([
            'name' => ['required', 'string'],
            'email' => ['required', 'string', 'email', 'unique:users,email'],
            'profile_image' => ['required', 'image', 'mimes:jpg,jpeg,png'],
            'password' => ['required', 'confirmed', Password::defaults()],
        ]);

        $image_url = $request->file('profile_image')->store('users', 'public');

        User::create([
            'name' => $request->name,
            'profile_image' => $image_url,
            'email' => $request->email,
            'password' => Hash::make($request->password),
        ]);

        return response()->json([
            'message' => 'Register successfully!'
        ], 200);
    }

    public function login(Request $request)
    {
        $request->validate([
            'email' => ['required', 'email'],
            'password' => ['required']
        ]);

        $user = User::where('email', $request->email)->first();

        if (!$user || !Hash::check($request->password, $user->password)) {
            return response()->json(['message' => 'The provided credentials are incorrect.'], 422);
        }

        $token = $user->createToken('token')->plainTextToken;

        return response()->json([
            'token' => $token,
            'message' => 'Login successfully!'
        ], 200);
    }

    public function logout(Request $request)
    {
        $user = $request->user();

        $user->currentAccessToken()->delete();

        return response()->json([
            'message' => 'Logout successfully!'
        ], 200);
    }
}
