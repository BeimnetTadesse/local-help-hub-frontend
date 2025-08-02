'use client';

import { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import api from '../../../utils/api';

type Post = {
  id: number;
  title: string;
  content: string;
  username: string;
  email: string;
  category_name?: string;
  address?: string;
  status?: string;
  created_at?: string;
};

export default function PostDetailPage() {
  const { id } = useParams();
  const router = useRouter();
  const [post, setPost] = useState<Post | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (!token) {
      router.push('/');
      return;
    }

    const fetchPost = async () => {
      try {
        const res = await api.get(`/posts/${id}`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        setPost(res.data);
      } catch (err) {
        console.error('Failed to load post:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchPost();
  }, [id, router]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#e4e4e5]">
        <div className="flex flex-col items-center gap-4">
          <div
            className="animate-spin rounded-full h-12 w-12 border-t-4"
            style={{ borderColor: '#dc275c transparent transparent transparent' }}
          ></div>
          <p className="text-[#691c47] text-base font-medium animate-pulse">
            Loading post details...
          </p>
        </div>
      </div>
    );
  }

  if (!post) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#e4e4e5]">
        <div className="text-center">
          <p className="text-[#dc275c] text-xl font-semibold">Post not found.</p>
          <button
            className="mt-4 bg-[#dc275c] hover:bg-[#a72049] text-white px-6 py-2 rounded-full font-medium transition-all duration-300"
            onClick={() => router.push('/posts')}
          >
            Back to Posts
          </button>
        </div>
      </div>
    );
  }

  return (
    <div
    className="min-h-screen bg-cover bg-center bg-no-repeat text-[#691c47] px-4 py-12 font-sans"
    style={{ backgroundImage: "url(/images/post3.png)" }}
  >
      <div className="max-w-4xl mx-auto bg-white rounded-3xl shadow-xl p-6 sm:p-10">
        <h1 className="text-3xl sm:text-4xl font-bold mb-6">{post.title}</h1>

        {/* INFO GRID */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-5 text-sm sm:text-base mb-6">
          <div>
            <p className="text-[#dc275c] font-semibold">👤 Username</p>
            <p>{post.username}</p>
          </div>
          <div>
            <p className="text-[#dc275c] font-semibold">📧 Email</p>
            <p>{post.email}</p>
          </div>
          {post.category_name && (
            <div>
              <p className="text-[#dc275c] font-semibold">🗂️ Category</p>
              <p>{post.category_name}</p>
            </div>
          )}
          {post.status && (
            <div>
              <p className="text-[#dc275c] font-semibold">📌 Status</p>
              <p className="capitalize">{post.status}</p>
            </div>
          )}
          {post.address && (
            <div>
              <p className="text-[#dc275c] font-semibold">📍 Location</p>
              <p>{post.address}</p>
            </div>
          )}
          {post.created_at && (
            <div>
              <p className="text-[#dc275c] font-semibold">📅 Created</p>
              <p>
                {new Date(post.created_at).toLocaleDateString('en-US', {
                  year: 'numeric',
                  month: 'long',
                  day: 'numeric',
                })}
              </p>
            </div>
          )}
        </div>

        <hr className="my-6 border-[#fcdbbc]" />

        {/* CONTENT */}
        <p className="text-base sm:text-lg leading-relaxed whitespace-pre-line">
          {post.content}
        </p>

        {/* BACK BUTTON */}
        <div className="mt-10 flex justify-end">
          <button
            className="bg-[#dc275c] hover:bg-[#a72049] text-white px-6 py-3 rounded-full text-base font-medium shadow-md hover:shadow-lg transition-all duration-300 flex items-center gap-2 group"
            onClick={() => router.push('/posts')}
          >
            <span className="transform group-hover:-translate-x-1 transition-transform duration-300">
              ←
            </span>
            Back to Posts
          </button>
        </div>
      </div>
    </div>
  );
}
