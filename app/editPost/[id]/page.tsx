'use client';

import { useEffect, useState } from 'react';
import { useRouter, useParams } from 'next/navigation';
import api from '../../../utils/api';
import Link from 'next/link';

export default function EditPostPage() {
  const router = useRouter();
  const { id } = useParams();

  const [post, setPost] = useState({ title: '', content: '', address: '' });
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    async function fetchPost() {
      try {
        const res = await api.get(`/posts/${id}`);
        setPost({
          title: res.data.title,
          content: res.data.content,
          address: res.data.address || '',
        });
        setLoading(false);
      } catch {
        alert('Failed to fetch post.');
        router.push('/myPosts');
      }
    }
    fetchPost();
  }, [id, router]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    try {
      await api.put(`/posts/${id}`, post);
      router.push('/myPosts');
    } catch (err: any) {
      alert(err.response?.data?.message || 'Failed to update post');
    } finally {
      setSaving(false);
    }
  };

  if (loading)
    return (
      <div className="min-h-screen flex items-center justify-center text-[#691c47] animate-pulse">
        Loading post...
      </div>
    );

  return (
    <div className="min-h-screen bg-[#e4e4e5] px-6 py-12 font-sans text-[#691c47]">
      <div className="max-w-2xl mx-auto bg-white p-8 rounded-2xl shadow-md border border-[#fcdbbc]">
      <Link
              href="/posts"
              className="bg-[#ffcedc] text-[#691c47] px-4 py-2 mb-4 rounded-full shadow-sm font-medium  hover:text-[#4a1140] transition-all"
            >
              ←All Posts
            </Link>

        <h1 className="text-3xl font-bold mb-6 mt-4 text-center">✏️ Edit Post</h1>

        <form onSubmit={handleSubmit} className="space-y-5">
          <input
            type="text"
            placeholder="Title"
            className="w-full p-3 border border-[#fcdbbc] rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-[#dc275c]"
            value={post.title}
            onChange={e => setPost({ ...post, title: e.target.value })}
            required
          />

          <textarea
            placeholder="Content"
            className="w-full p-3 border border-[#fcdbbc] rounded-lg shadow-sm h-32 focus:outline-none focus:ring-2 focus:ring-[#dc275c]"
            value={post.content}
            onChange={e => setPost({ ...post, content: e.target.value })}
            required
          />

          <input
            type="text"
            placeholder="Address (optional)"
            className="w-full p-3 border border-[#fcdbbc] rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-[#dc275c]"
            value={post.address}
            onChange={e => setPost({ ...post, address: e.target.value })}
          />

          <button
            type="submit"
            disabled={saving}
            className="w-full bg-[#dc275c] text-white px-5 py-3 rounded-lg hover:bg-[#a81b42] transition-all shadow-md disabled:opacity-60"
          >
            {saving ? 'Saving...' : 'Save Changes'}
          </button>
        </form>
      </div>
    </div>
  );
}
