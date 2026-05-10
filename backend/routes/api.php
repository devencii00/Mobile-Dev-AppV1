<?php

use App\Http\Controllers\AuthController;
use App\Http\Controllers\BlogController;
use Illuminate\Support\Facades\Route;

Route::middleware('guest')->group(function () {
    Route::post('/register', [AuthController::class, 'register']);
    Route::post('/login', [AuthController::class, 'login']);
});

Route::middleware('auth:sanctum')->group(function () {
    Route::get('/user', [AuthController::class, 'user']);
    Route::put('/user', [AuthController::class, 'updateUser']);

    Route::post('/logout', [AuthController::class, 'logout']);

    Route::post('/create/blog', [BlogController::class, 'createBlog']);
    Route::get('/fetchBlogs', [BlogController::class, 'fetchBlogs']);
    Route::get('/blogs/{id}', [BlogController::class, 'fetchBlog']);
    Route::post('/blogs/{id}', [BlogController::class, 'updateBlog']);
    Route::delete('/blogs/{id}', [BlogController::class, 'deleteBlog']);
    Route::get('/user/blogs', [BlogController::class, 'userBlogs']);
});
