'use client';

import { useState } from 'react';
import { useAuth } from '@/lib/auth';

const inputClass =
  'w-full p-3 border border-[#ddd] rounded-md text-base box-border transition-colors duration-300 focus:outline-none focus:border-indigo-500 focus:shadow-[0_0_0_3px_rgba(102,126,234,0.1)]';

export default function LoginPage() {
  const { login } = useAuth();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      await login(email, password);
      // Hard navigation: a client-side router.push right after setting the
      // auth cookie can race Next's router cache and hit middleware with a
      // stale (pre-login) cookie read, bouncing back to /admin/login.
      window.location.href = '/admin';
    } catch {
      setError('Invalid email or password');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex justify-center items-center min-h-screen bg-gray-50">
      <div className="bg-white p-12 rounded-lg shadow-[0_10px_30px_rgba(0,0,0,0.2)] w-full max-w-[400px]">
        <h1 className="text-[2rem] mb-2 text-[#333]">Admin Login</h1>
        <p className="text-[#666] mb-8">Raul Barbosa Neto Portfolio</p>

        {error && (
          <div className="p-4 rounded-md mb-6 font-medium bg-[#f8d7da] text-[#721c24] border border-[#f5c6cb]">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit}>
          <div className="mb-6">
            <label htmlFor="email" className="block mb-2 text-[#333] font-medium">
              Email
            </label>
            <input
              type="email"
              id="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              placeholder="admin@raulbarbosa.com"
              className={inputClass}
            />
          </div>

          <div className="mb-6">
            <label htmlFor="password" className="block mb-2 text-[#333] font-medium">
              Password
            </label>
            <input
              type="password"
              id="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              placeholder="••••••••"
              className={inputClass}
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full p-3 bg-gradient-to-br from-indigo-500 to-purple-600 text-white border-0 rounded-md text-base font-semibold cursor-pointer transition-all duration-300 enabled:hover:-translate-y-0.5 enabled:hover:shadow-[0_5px_15px_rgba(102,126,234,0.4)] disabled:opacity-60 disabled:cursor-not-allowed"
          >
            {loading ? 'Logging in...' : 'Login'}
          </button>
        </form>
      </div>
    </div>
  );
}
