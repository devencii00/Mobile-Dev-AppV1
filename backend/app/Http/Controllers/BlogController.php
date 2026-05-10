<?php

namespace App\Http\Controllers;

use App\Models\Blog;
use Illuminate\Http\Request;

class BlogController extends Controller
{
    public function fetchBlogs(Request $request)
    {
        $blogs = Blog::with('user')->latest()->get();

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

    public function fetchBlog(Request $request, $id)
    {
        $blog = Blog::with('user')->find($id);

        if (!$blog) {
            return response()->json(['message' => 'Blog not found'], 404);
        }

        return response()->json($blog);
    }

    public function deleteBlog(Request $request, $id)
    {
        $blog = Blog::find($id);

        if (!$blog) {
            return response()->json(['message' => 'Blog not found'], 404);
        }

        if ($blog->user_id !== $request->user()->id) {
            return response()->json(['message' => 'Unauthorized'], 403);
        }

        $blog->delete();

        return response()->json(['message' => 'Blog deleted successfully']);
    }

    public function userBlogs(Request $request)
    {
        $blogs = Blog::with('user')->where('user_id', $request->user()->id)->latest()->get();

        return response()->json($blogs);
    }

    public function updateBlog(Request $request, $id)
    {
        $blog = Blog::find($id);

        if (!$blog) {
            return response()->json(['message' => 'Blog not found'], 404);
        }

        if ($blog->user_id !== $request->user()->id) {
            return response()->json(['message' => 'Unauthorized'], 403);
        }

        $request->validate([
            'title' => ['required', 'string', 'max:255'],
            'description' => ['required', 'string'],
            'image' => ['nullable', 'image', 'mimes:jpg,jpeg,png'],
        ]);

        $blog->title = $request->title;
        $blog->description = $request->description;

        if ($request->hasFile('image')) {
            $image_url = $request->file('image')->store('blogs', 'public');
            $blog->image = $image_url;
        }

        $blog->save();

        return response()->json([
            'message' => 'Blog updated successfully!',
            'blog' => $blog
        ], 200);
    }
}
