'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import api from '../utils/api';


export default function LoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      const res = await api.post('/auth/login', { email, password });
      const { token } = res.data;

      localStorage.setItem('token', token);
      router.push('/posts');
    } catch (err: any) {
      console.error('Login error:', err);
      if (err.response) {
        setError(err.response.data.error || 'Login failed. Please check your credentials.');
      } else if (err.message) {
        setError(err.message);
      } else {
        setError('Network error or server not reachable.');
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div
      className="min-h-screen flex items-center justify-center p-6"
      style={{
        backgroundImage: "url('/images/bg.png')",
        backgroundSize: 'cover',
        backgroundPosition: 'center',
      }}
    >
      <form
        onSubmit={handleSubmit}
        className="bg-white p-8 rounded shadow-md w-full max-w-md"
      >
        <h2 className="text-2xl font-bold mb-6 text-[#812558]">Login</h2>

        {error && (
          <p className="mb-4 text-[#e03b6d] bg-[#fcdbbc] p-2 rounded">{error}</p>
        )}

        <label className="block mb-2 font-semibold text-[#812558]">Email</label>
        <input
          type="email"
          value={email}
          onChange={e => setEmail(e.target.value)}
          required
          disabled={loading}
          className="w-full p-2 mb-4 border border-[#586ed5] rounded"
        />

        <label className="block mb-2 font-semibold text-[#812558]">Password</label>
        <input
          type="password"
          value={password}
          onChange={e => setPassword(e.target.value)}
          required
          disabled={loading}
          className="w-full p-2 mb-6 border border-[#586ed5] rounded"
        />

        <button
          type="submit"
          disabled={loading}
          className={`w-full py-2 rounded text-white transition ${
            loading
              ? 'bg-[#e03b6d] opacity-60 cursor-not-allowed'
              : 'bg-[#e03b6d] hover:bg-[#812558]'
          }`}
        >
          {loading ? 'Logging in...' : 'Log In'}
        </button>

        <p className="mt-4 text-sm text-center">
          Don&apos;t have an account?{' '}
          <a href="/register" className="text-[#586ed5] hover:underline">
            Register here
          </a>.
        </p>
      </form>
    </div>
  );
}
