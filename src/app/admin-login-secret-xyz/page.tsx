'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { authApi } from '@/lib/api';
import { useAdminStore } from '@/store';
import toast from 'react-hot-toast';
import Script from 'next/script';

// This page is only accessible at /admin-login-secret-xyz
export default function AdminLoginPage() {
  const router = useRouter();
  const { setAdmin } = useAdminStore();

  const [form, setForm] = useState({ email: '', password: '' });
  const [loading, setLoading] = useState(false);
  const [gisReady, setGisReady] = useState(false);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      const res = await authApi.adminLogin(form.email, form.password);
      setAdmin(res.data.admin, res.data.token);
      toast.success('Welcome back!');
      router.push('/admin');
    } catch (err: any) {
      toast.error(err.response?.data?.message || 'Invalid credentials');
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleLogin = async (credential: string) => {
    setLoading(true);
    try {
      const res = await authApi.googleLogin(credential);
      setAdmin(res.data.admin, res.data.token);
      toast.success('Welcome!');
      router.push('/admin');
    } catch (err: any) {
      toast.error(err.response?.data?.message || 'Google login failed');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (!gisReady) return;
    const clientId = process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID;
    if (!clientId) return;

    const google = (window as any).google;
    if (!google?.accounts?.id) return;

    google.accounts.id.initialize({
      client_id: clientId,
      callback: (response: any) => {
        if (response?.credential) handleGoogleLogin(response.credential);
      },
    });

    google.accounts.id.renderButton(
      document.getElementById('google-signin-btn'),
      {
        type: 'standard',
        theme: 'filled_black',
        size: 'large',
        text: 'continue_with',
        shape: 'pill',
        width: 320,
      }
    );
  }, [gisReady]);

  return (
    <div className="min-h-screen flex items-center justify-center p-4"
         style={{ background: 'linear-gradient(135deg, var(--navy) 0%, #16213e 100%)' }}>
      <Script
        src="https://accounts.google.com/gsi/client"
        strategy="afterInteractive"
        onLoad={() => setGisReady(true)}
      />

      <div className="w-full max-w-md">
        {/* Logo */}
        <div className="text-center mb-10">
          <div className="w-16 h-16 rounded-2xl flex items-center justify-center text-white text-2xl font-black mx-auto mb-4"
               style={{ background: 'linear-gradient(135deg, #e94560, #f97316)' }}>
            R
          </div>
          <h1 className="text-3xl font-black text-white" style={{ fontFamily: 'Playfair Display, serif' }}>
            RT<span style={{ color: '#e94560' }}>Shop</span> Admin
          </h1>
          <p className="text-gray-400 mt-2 text-sm">Secure admin access</p>
        </div>

        <div className="card p-8" style={{ background: 'rgba(255,255,255,0.05)', backdropFilter: 'blur(12px)', borderColor: 'rgba(255,255,255,0.1)' }}>
          <form onSubmit={handleLogin} className="space-y-5">
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-1.5">Email</label>
              <input
                type="email"
                value={form.email}
                onChange={e => setForm({ ...form, email: e.target.value })}
                className="w-full px-4 py-3 rounded-xl outline-none text-white transition-all text-sm"
                style={{
                  background: 'rgba(255,255,255,0.08)',
                  border: '1px solid rgba(255,255,255,0.15)',
                }}
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-300 mb-1.5">Password</label>
              <input
                type="password"
                value={form.password}
                onChange={e => setForm({ ...form, password: e.target.value })}
                className="w-full px-4 py-3 rounded-xl outline-none text-white transition-all text-sm"
                style={{
                  background: 'rgba(255,255,255,0.08)',
                  border: '1px solid rgba(255,255,255,0.15)',
                }}
                placeholder="••••••••"
                required
              />
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full py-3.5 rounded-xl font-bold text-white transition-all disabled:opacity-50"
              style={{ background: 'linear-gradient(135deg, #1d4ed8, #0f172a)' }}
            >
              {loading ? 'Signing in...' : 'Sign In'}
            </button>
          </form>

          <div className="flex items-center gap-3 my-5">
            <div className="flex-1 h-px" style={{ background: 'rgba(255,255,255,0.1)' }} />
            <span className="text-xs text-gray-500">OR</span>
            <div className="flex-1 h-px" style={{ background: 'rgba(255,255,255,0.1)' }} />
          </div>

          <div className="flex justify-center">
            <div id="google-signin-btn" />
          </div>
        </div>

        <p className="text-center text-xs text-gray-600 mt-6">
          Unauthorized access is prohibited and monitored.
        </p>
      </div>
    </div>
  );
}
