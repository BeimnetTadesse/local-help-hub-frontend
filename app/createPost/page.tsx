'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import api from '../../utils/api';
import Link from 'next/link';

type Category = {
  id: number;
  name: string;
};

export default function CreatePostPage() {
  const router = useRouter();
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [category, setCategory] = useState('');
  const [address, setAddress] = useState('');
  const [image, setImage] = useState<File | null>(null);
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const res = await api.get('/categories');
        setCategories(res.data);
      } catch (err) {
        console.error('Failed to load categories:', err);
      }
    };
    fetchCategories();
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    const token = localStorage.getItem('token');
    if (!token) {
      router.push('/');
      return;
    }

    const formData = new FormData();
    formData.append('title', title);
    formData.append('content', content);
    formData.append('category', category);
    formData.append('address', address);
    if (image) formData.append('image', image);

    try {
      await api.post('/posts', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
          Authorization: `Bearer ${token}`,
        },
      });
      router.push('/posts');
    } catch (err) {
      console.error('Post creation failed:', err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex font-sans  text-[#691c47]">
      {/* LEFT SIDE IMAGE */}
      <div className="hidden md:flex md:w-[42%] items-center justify-center p-6">
  <img
    src="/images/postt1.png"
    alt="My Posts Visual"
    className="w-full h-auto max-h-[85vh] rounded-2xl  object-contain"
  />
</div>

      {/* RIGHT SIDE FORM */}
      <div className="w-full md:w-1/2 px-6 py-12 flex items-center justify-center ">
        <div className="w-full max-w-xl bg-white p-8 rounded-2xl shadow-md border border-[#ffcedc]">
          <Link
            href="/posts"
            className="bg-[#ffcedc] text-[#691c47] px-4 py-2 mb-4 rounded-full shadow-sm font-medium hover:text-[#4a1140] transition-all"
          >
            ← All Posts
          </Link>

          <h1 className="text-3xl font-bold mb-6 mt-4 text-center">
            Create a Help Request
          </h1>

          <form onSubmit={handleSubmit} className="space-y-5">
            <input
              type="text"
              placeholder="Title"
              className="w-full p-3 border border-[#ffcedc] rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-[#dc275c]"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              required
            />

            <textarea
              placeholder="Describe your request..."
              className="w-full p-3 border border-[#ffcedc] rounded-lg shadow-sm h-32 focus:outline-none focus:ring-2 focus:ring-[#dc275c]"
              value={content}
              onChange={(e) => setContent(e.target.value)}
              required
            />

            <select
              className="w-full p-3 border border-[#ffcedc] rounded-lg shadow-sm bg-white focus:outline-none focus:ring-2 focus:ring-[#dc275c]"
              value={category}
              onChange={(e) => setCategory(e.target.value)}
              required
            >
              <option value="">Select Category</option>
              {categories.map((cat) => (
                <option key={cat.id} value={cat.name}>
                  {cat.name}
                </option>
              ))}
            </select>

            <input
              type="text"
              placeholder="Address (e.g., Tuludimtu, Addis Ababa)"
              className="w-full p-3 border border-[#ffcedc] rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-[#dc275c]"
              value={address}
              onChange={(e) => setAddress(e.target.value)}
              required
            />

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-[#dc275c] text-white px-5 py-3 rounded-lg hover:bg-[#a81b42] transition-shadow shadow-md disabled:opacity-60"
            >
              {loading ? 'Submitting...' : 'Submit Help Request'}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}
