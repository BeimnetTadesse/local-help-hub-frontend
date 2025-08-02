'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import api from '../../utils/api';
import Link from 'next/link';

type Post = {
  id: number;
  title: string;
  content: string;
  username: string;
  email: string;
  address: string;
  category: string;
  category_id: number;
  created_at: string;
  volunteers: number;
};

type Category = {
  id: number;
  name: string;
};

export default function PostsPage() {
  const router = useRouter();
  const [posts, setPosts] = useState<Post[]>([]);
  const [filteredPosts, setFilteredPosts] = useState<Post[]>([]);

  const [search, setSearch] = useState('');
  const [locationFilter, setLocationFilter] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('');
  const [dateFilter, setDateFilter] = useState('');
  const [loading, setLoading] = useState(true);
  const [categories, setCategories] = useState<Category[]>([]);

  const cities = [
    'Addis Ababa', 'Amhara', 'Oromia', 'Tigray',
    'Southern Nations', 'Afar', 'Gambela',
    'Benishangul-Gumuz', 'Harari', 'Dire Dawa',
  ];

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (!token) {
      router.push('/');
      return;
    }

    const fetchPostsAndCategories = async () => {
      try {
        const [postsRes, categoriesRes] = await Promise.all([
          api.get('/posts?status=all', {
            headers: { Authorization: `Bearer ${token}` },
          }),
          api.get('/categories', {
            headers: { Authorization: `Bearer ${token}` },
          }),
        ]);

        setPosts(postsRes.data);
        setFilteredPosts(postsRes.data);
        setCategories(categoriesRes.data);
      } catch (err) {
        console.error('Failed to fetch posts or categories:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchPostsAndCategories();
  }, [router]);

  useEffect(() => {
    let filtered = posts;

    if (search.trim() !== '') {
      const term = search.toLowerCase();
      filtered = filtered.filter(
        (post) =>
          post.title.toLowerCase().includes(term) ||
          post.content.toLowerCase().includes(term)
      );
    }

    if (locationFilter !== '') {
      filtered = filtered.filter((post) =>
        post.address?.toLowerCase().includes(locationFilter.toLowerCase())
      );
    }

    if (categoryFilter !== '') {
      filtered = filtered.filter(
        (post) => post.category_id?.toString() === categoryFilter
      );
    }

    if (dateFilter !== '') {
      filtered = filtered.filter((post) =>
        post.created_at.startsWith(dateFilter)
      );
    }

    setFilteredPosts(filtered);
  }, [search, locationFilter, categoryFilter, dateFilter, posts]);

  return (
    <div className="min-h-screen bg-[#efefef] text-[#691c47] px-6 py-10 font-sans">
      {/* Header & Nav */}
      <div className="flex flex-col sm:flex-row justify-between items-center mb-8 gap-4">
        <h1 className="text-4xl font-extrabold text-[#691c47]">🔗 CommUnity</h1>

        <div className="flex items-center gap-4">
        <Link href="/createPost">
            <button className="bg-[#ffcedc] text-[#691c47] px-5 py-2.5 rounded-xl text-sm font-semibold transition shadow-md hover:shadow-lg transform hover:-translate-y-0.5">
              ➕ New Post
            </button>
          </Link>
          <Link
            href="/myPosts"
            className="px-4 py-2 rounded-lg text-sm bg-[#ffcedc] text-[#691c47] font-semibold transition shadow-sm hover:shadow-md"
          >
            📝 My Posts
          </Link>
          
          <Link
            href="/profile"
            className="px-4 py-2 rounded-lg font-medium text-sm bg-[#dc275c] text-white  transition shadow-sm hover:shadow-md"
          >
            👤 My Profile
          </Link>
        </div>
      </div>

      {/* Filters */}
      <div className="flex flex-col md:flex-row gap-4 mb-6">
        <input
          type="text"
          placeholder="🔍 Search posts..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="p-3 border border-[#d0d0d0] rounded-md w-full md:w-1/3 bg-white text-[#691c47]"
        />
        <select
          className="p-3 border border-[#d0d0d0] rounded-md w-full md:w-1/4 bg-white text-[#691c47]"
          onChange={(e) => setLocationFilter(e.target.value)}
          value={locationFilter}
        >
          <option value="">All Locations</option>
          {cities.map((city, i) => (
            <option key={i} value={city}>
              {city}
            </option>
          ))}
        </select>
        <select
          className="p-3 border border-[#d0d0d0] rounded-md w-full md:w-1/4 bg-white text-[#691c47]"
          onChange={(e) => setCategoryFilter(e.target.value)}
          value={categoryFilter}
        >
          <option value="">All Categories</option>
          {categories.map((cat) => (
            <option key={cat.id} value={cat.id.toString()}>
              {cat.name}
            </option>
          ))}
        </select>
        <input
          type="date"
          value={dateFilter}
          onChange={(e) => setDateFilter(e.target.value)}
          className="p-3 border border-[#d0d0d0] rounded-md w-full md:w-1/4 bg-white text-[#691c47]"
        />
      </div>

      {/* Posts Grid */}
      {loading ? (
        <p className="text-center text-[#691c47] animate-pulse">Loading posts...</p>
      ) : filteredPosts.length === 0 ? (
        <p className="text-center text-[#691c47] italic">No matching posts found.</p>
      ) : (
        <div className="grid md:grid-cols-2 xl:grid-cols-3 gap-6">
          {filteredPosts.map((post) => (
            <Link href={`/posts/${post.id}`} key={post.id}>
              <div className="cursor-pointer bg-white border border-[#d0d0d0] rounded-xl p-5 shadow-sm hover:shadow-md transition-all hover:border-[#dc275c]">
                <h2 className="text-2xl font-bold text-[#691c47] mb-1">{post.title}</h2>
                <p className="text-sm text-[#dc275c] mb-2">👤 @{post.username}</p>
                <p className="text-[#691c47] leading-relaxed line-clamp-4">{post.content}</p>
                <p className="text-sm text-[#812558] mt-4">📍 {post.address}</p>
              </div>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}

