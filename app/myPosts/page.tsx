'use client';

import { useEffect, useState } from 'react';
import api from '../../utils/api';
import { useRouter } from 'next/navigation';
import Link from 'next/link';

type Post = {
  id: number;
  title: string;
  content: string;
  category: string;
  created_at: string;
  address: string;
};

export default function MyPostsPage() {
  const router = useRouter();
  const [posts, setPosts] = useState<Post[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (!token) {
      router.push('/login');
      return;
    }

    const fetchMyPosts = async () => {
      try {
        const res = await api.get('/posts/myPosts');
        setPosts(res.data);
      } catch (err: any) {
        setError(err.response?.data?.error || 'Failed to load posts');
      } finally {
        setLoading(false);
      }
    };

    fetchMyPosts();
  }, [router]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center text-[#691c47] animate-pulse bg-[#e4e4e5]">
        Loading your posts...
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white flex flex-col md:flex-row">
      {/* Left side image */}
      <div className="hidden md:flex md:w-[42%] items-center justify-center p-6">
  <img
    src="/images/postt2.png"
    alt="My Posts Visual"
    className="w-full h-full max-h-[85vh] rounded-2xl  object-contain"
  />
</div>

      {/* Right side content */}
      <div className="md:w-[58%] w-full py-10 px-6 sm:px-10 font-sans text-[#691c47]">
        <div className="max-w-3xl mx-auto">
          <div className="flex justify-between items-center mb-8">
            <h1 className="text-3xl font-extrabold">📋 My Posts</h1>
            <div className="flex gap-4">
              <Link
                href="/posts"
                className="bg-[#ffcedc] text-[#691c47] px-4 py-2 rounded-full shadow-sm font-medium hover:text-[#4a1140] transition-all"
              >
                ← Back to All Posts
              </Link>
              <Link
                href="/createPost"
                className="bg-[#dc275c] text-white px-5 py-2.5 rounded-xl font-semibold hover:bg-[#a81b42] transition-all shadow-md hover:shadow-lg"
              >
                ➕ New Post
              </Link>
            </div>
          </div>

          {error && (
            <div className="mb-6 p-4 bg-red-100 text-red-600 rounded-lg shadow-sm">
              {error}
            </div>
          )}

          {posts.length === 0 ? (
            <p>You haven’t posted anything yet.</p>
          ) : (
            <div className="grid gap-6">
              {posts.map((post) => (
                <div
                  key={post.id}
                  className="bg-white border border-[#ffcedc] rounded-lg p-6 shadow-sm hover:shadow-md transition"
                >
                  <Link href={`/posts/${post.id}`} className="cursor-pointer">
                    <h2 className="text-xl font-bold text-[#691c47]">{post.title}</h2>
                    <p className="text-sm text-[#812558] mt-1 line-clamp-2">{post.content}</p>
                    <div className="mt-3 flex justify-between text-sm text-[#691c47]">
                      <span>📍 {post.address}</span>
                      <span>📂 {post.category}</span>
                      <span>🕒 {new Date(post.created_at).toLocaleString()}</span>
                    </div>
                  </Link>

                  <div className="flex gap-4 mt-4">
                    <button
                      onClick={() => router.push(`/editPost/${post.id}`)}
                      className="text-[#691c47] bg-[#ffcedc] px-4 py-1 rounded-lg shadow-sm font-semibold hover:text-[#4a1140] transition"
                    >
                      ✏️ Edit
                    </button>
                    <button
                      onClick={async () => {
                        if (confirm('Are you sure you want to delete this post?')) {
                          try {
                            await api.delete(`/posts/${post.id}`);
                            setPosts(posts.filter((p) => p.id !== post.id));
                          } catch (err: any) {
                            alert(err.response?.data?.message || 'Failed to delete post');
                          }
                        }
                      }}
                      className="text-white bg-[#dc275c] px-4 py-1 rounded-lg shadow-sm font-semibold hover:bg-[#a81b42] transition"
                    >
                      🗑 Delete
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
