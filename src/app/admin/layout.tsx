'use client';

import { useEffect, useState } from 'react';
import { useRouter, usePathname } from 'next/navigation';
import Link from 'next/link';
import { useAdminStore, useThemeStore } from '@/store';
import { authApi } from '@/lib/api';
import toast from 'react-hot-toast';

const navItems = [
  { href: '/admin', label: 'Dashboard', icon: 'D', exact: true },
  { href: '/admin/products', label: 'Products', icon: 'P' },
  { href: '/admin/categories', label: 'Categories', icon: 'C' },
  { href: '/admin/orders', label: 'Orders', icon: 'O' },
  { href: '/admin/custom-orders', label: 'Custom Orders', icon: 'R' },
];

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const pathname = usePathname();
  const { admin, clearAdmin, isAuthenticated } = useAdminStore();
  const { theme, toggleTheme } = useThemeStore();
  const [sidebarOpen, setSidebarOpen] = useState(false);

  useEffect(() => {
    if (!isAuthenticated()) {
      router.replace('/admin-login-secret-xyz');
    }
  }, [isAuthenticated, router]);

  const handleLogout = async () => {
    try {
      await authApi.logout();
    } catch {}
    clearAdmin();
    toast.success('Logged out');
    router.push('/admin-login-secret-xyz');
  };

  if (!isAuthenticated()) return null;

  return (
    <div className="min-h-screen flex" style={{ background: 'var(--bg)' }}>
      <button
        onClick={() => setSidebarOpen(true)}
        className="md:hidden fixed top-4 left-4 z-50 w-10 h-10 rounded-xl text-white"
        style={{ background: 'var(--navy)' }}
        aria-label="Open sidebar"
      >
        ?
      </button>

      {sidebarOpen && (
        <div
          className="md:hidden fixed inset-0 z-40"
          style={{ background: 'rgba(2,6,23,0.5)' }}
          onClick={() => setSidebarOpen(false)}
        />
      )}

      <aside
        className={`fixed md:static inset-y-0 left-0 z-50 w-64 shrink-0 flex flex-col transform transition-transform duration-300 ${sidebarOpen ? 'translate-x-0' : '-translate-x-full md:translate-x-0'}`}
        style={{ background: 'var(--navy)', borderRight: '1px solid rgba(255,255,255,0.08)' }}
      >
        <div className="p-6 border-b" style={{ borderColor: 'rgba(255,255,255,0.08)' }}>
          <div className="flex items-center justify-between">
            <Link href="/admin" className="flex items-center gap-3" onClick={() => setSidebarOpen(false)}>
              <div className="w-9 h-9 rounded-xl flex items-center justify-center text-white font-black text-lg"
                   style={{ background: 'linear-gradient(135deg, #e94560, #f97316)' }}>
                R
              </div>
              <div>
                <p className="text-white font-bold text-sm" style={{ fontFamily: 'Playfair Display, serif' }}>RTShop</p>
                <p className="text-gray-500 text-xs">Admin Panel</p>
              </div>
            </Link>
            <button className="md:hidden text-gray-300" onClick={() => setSidebarOpen(false)} aria-label="Close sidebar">?</button>
          </div>
        </div>

        <nav className="flex-1 p-4 space-y-1">
          {navItems.map((item) => {
            const isActive = item.exact ? pathname === item.href : pathname.startsWith(item.href);
            return (
              <Link
                key={item.href}
                href={item.href}
                onClick={() => setSidebarOpen(false)}
                className="flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium transition-all"
                style={isActive
                  ? { background: 'rgba(79,92,241,0.86)', color: '#fdfca4', borderLeft: '3px solid #1d4ed8' }
                  : { color: '#94a3b8' }}
              >
                <span className="w-5 text-center font-bold">{item.icon}</span>
                {item.label}
              </Link>
            );
          })}
        </nav>

        <div className="p-4 border-t" style={{ borderColor: 'rgba(255,255,255,0.08)' }}>
          <div className="flex items-center gap-3 px-2 mb-3">
            {admin?.avatar_url ? (
              <img src={admin.avatar_url} alt="" className="w-8 h-8 rounded-full" />
            ) : (
              <div className="w-8 h-8 rounded-full flex items-center justify-center text-white text-sm font-bold"
                   style={{ background: 'var(--accent)' }}>
                {admin?.name?.[0]?.toUpperCase()}
              </div>
            )}
            <div className="min-w-0">
              <p className="text-white text-sm font-medium truncate">{admin?.name}</p>
              <p className="text-gray-500 text-xs truncate">{admin?.email}</p>
            </div>
          </div>

          <button
            onClick={toggleTheme}
            className="w-full mb-2 flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm font-medium transition-all text-gray-400 hover:text-white hover:bg-white/10"
            aria-label="Toggle theme"
          >
            {theme === 'dark' ? 'Light mode' : 'Dark mode'}
          </button>

          <button
            onClick={handleLogout}
            className="w-full flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm font-medium transition-all text-gray-400 hover:text-white hover:bg-white/10"
          >
            Logout
          </button>

          <Link
            href="/"
            target="_blank"
            className="mt-1 w-full flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm font-medium text-gray-400 hover:text-white hover:bg-white/10 transition-all"
          >
            View Store
          </Link>
        </div>
      </aside>

      <main className="flex-1 overflow-auto md:ml-0">
        {children}
      </main>
    </div>
  );
}
