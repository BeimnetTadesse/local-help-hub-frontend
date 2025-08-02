'use client';

import { useEffect, useState } from 'react';
import api from '../../utils/api';
import { useRouter } from 'next/navigation';

type Profile = {
  id: number;
  username: string;
  email: string;
  full_name: string;
  phone: string;
  address: string;
  role: string;
};

export default function ProfilePage() {
  const router = useRouter();
  const [profile, setProfile] = useState<Profile | null>(null);
  const [loading, setLoading] = useState(true);
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');
  const [formData, setFormData] = useState({
    full_name: '',
    phone: '',
    address: '',
  });

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (!token) {
      router.push('/login');
      return;
    }

    const fetchProfile = async () => {
      try {
        const res = await api.get('/user/profile');
        setProfile(res.data);
        setFormData({
          full_name: res.data.full_name || '',
          phone: res.data.phone || '',
          address: res.data.address || '',
        });
      } catch (err) {
        console.error('Error fetching profile:', err);
        setError('Failed to load profile');
      } finally {
        setLoading(false);
      }
    };

    fetchProfile();
  }, [router]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleUpdate = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setMessage('');

    if (
      profile &&
      formData.full_name === (profile.full_name || '') &&
      formData.phone === (profile.phone || '') &&
      formData.address === (profile.address || '')
    ) {
      setMessage('You made no changes.');
      return;
    }

    try {
      const res = await api.put('/user/profile', formData);
      setMessage(res.data.message || 'Profile updated!');
      setProfile((prev) => (prev ? { ...prev, ...formData } : null));
    } catch (err: any) {
      console.error('Update failed:', err);
      setError(err.response?.data?.error || 'Update failed');
    }
  };

  const handleLogout = () => {
    localStorage.removeItem('token');
    router.push('/login');
  };

  if (loading)
    return (
      <div className="min-h-screen bg-[#e4e4e5] flex items-center justify-center">
        <p className="text-[#691c47] text-lg animate-pulse">Loading...</p>
      </div>
    );

  return (
    <div
    className="min-h-screen flex items-center justify-center p-6"
    style={{
      backgroundImage: "url('/images/bg.png')",
      backgroundSize: 'cover',
      backgroundPosition: 'center',
    }}
  >
      <div className="max-w-xl mx-auto">
        {/* Back Button */}
        <button
          onClick={() => router.push('/posts')}
          className="mb-6 inline-block bg-[#ffcedc] text-[#691c47] px-4 py-2 rounded-full shadow transition-colors duration-200 font-medium select-none"
          aria-label="Back to Home"
        >
          ← Back to Home
        </button>

        {/* Profile Card */}
        <div className="bg-white rounded-xl shadow-lg border border-[#fcdbbc] p-8">
          <h1 className="text-3xl font-extrabold mb-6 flex items-center gap-2">
            👤 My Profile
          </h1>

          {/* Messages */}
          {message && (
            <div className="mb-6 p-4 bg-green-100 text-green-600 rounded-lg shadow-sm">
              {message}
            </div>
          )}
          {error && (
            <div className="mb-6 p-4 bg-red-100 text-red-600 rounded-lg shadow-sm">
              {error}
            </div>
          )}

          {/* Profile Info */}
          <div className="mb-8 grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="p-4 bg-white hover:bg-[#ffcedc] rounded-lg shadow-sm">
              <strong className="font-medium">Username:</strong>
              <p className=" text-[#691c47]">{profile?.username}</p>
            </div>
            <div className="p-4 hover:bg-[#ffcedc] rounded-lg shadow-sm">
              <strong className="font-medium">Email:</strong>
              <p className="text-[#691c47]">{profile?.email}</p>
            </div>
          </div>

          {/* Update Form */}
          <form onSubmit={handleUpdate} className="space-y-6">
            <div>
              <label className="block mb-2 font-medium">Full Name</label>
              <input
                name="full_name"
                value={formData.full_name}
                onChange={handleChange}
                placeholder="Enter your full name"
                className="w-full p-3 border border-[#fcdbbc] rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-[#dc275c] transition-colors duration-200"
                autoComplete="off"
              />
            </div>

            <div>
              <label className="block mb-2 font-medium">Phone</label>
              <input
                name="phone"
                value={formData.phone}
                onChange={handleChange}
                placeholder="Enter your phone number"
                className="w-full p-3 border border-[#fcdbbc] rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-[#dc275c] transition-colors duration-200"
                autoComplete="off"
              />
            </div>

            <div>
              <label className="block mb-2 font-medium">Address</label>
              <input
                name="address"
                value={formData.address}
                onChange={handleChange}
                placeholder="Enter your address"
                className="w-full p-3 border border-[#fcdbbc] rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-[#dc275c] transition-colors duration-200"
                autoComplete="off"
              />
            </div>

            <button
              type="submit"
              className="w-full  text-white px-6 py-3 rounded-lg font-medium bg-[#a81b42] transition-all duration-200 shadow-sm hover:shadow-md"
            >
              Update Profile
            </button>
          </form>

          {/* Logout Button */}
          <button
            type="button"
            onClick={handleLogout}
            className="mt-6 w-full  text-white px-6 py-3 rounded-lg font-medium bg-[#a81b42] transition-all duration-200 shadow-sm hover:shadow-md"
          >
            Logout
          </button>
        </div>
      </div>
    </div>
  );
}
