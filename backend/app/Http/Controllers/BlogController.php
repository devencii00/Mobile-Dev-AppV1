<?php

namespace App\Http\Controllers;

use App\Models\Blog;
use Illuminate\Http\Request;

class BlogController extends Controller
{
    public function fetchBlogs(Request $request)
    {
        $blogs = Blog::get();

        return response()->json($blogs);
    }

    public function createBlog(Request $request)
    {
        $user_id = $request->user()->id;

        $request->validate([
            'title' => ['required'],
            'image' => ['required', 'image', 'mimes:jpg,jpeg,png'],
            'description' => ['required'],
        ]);

        $image_url = $request->file('image')->store('blogs', 'public');

        Blog::create([
            'user_id' => $user_id,
            'title' => $request->title,
            'image' => $image_url,
            'description' => $request->description
        ]);

        return response()->json([
            'message' => 'Blog created successfully!'
        ], 200);
    }
}
