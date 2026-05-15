'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useTranslation } from 'react-i18next';
import { newsletterApi } from '@/lib/api';
import toast from 'react-hot-toast';

export default function Footer() {
  const { t } = useTranslation('common');
  const [email, setEmail] = useState('');
  const [subscribing, setSubscribing] = useState(false);
  const [nextAllowedAt, setNextAllowedAt] = useState(0);

  const handleSubscribe = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email) return;
    const now = Date.now();
    if (subscribing || now < nextAllowedAt) {
      const sec = Math.ceil((nextAllowedAt - now) / 1000);
      if (sec > 0) toast.error(`Please wait ${sec}s before subscribing again.`);
      return;
    }
    setSubscribing(true);
    try {
      await newsletterApi.subscribe(email);
      toast.success(t('footer.subscribe') + ' ' + t('common.success') + '!');
      setEmail('');
      setNextAllowedAt(Date.now() + 15000);
    } catch (err: any) {
      toast.error(err.response?.data?.message || 'Failed to subscribe');
      setNextAllowedAt(Date.now() + 5000);
    } finally {
      setSubscribing(false);
    }
  };

  return (
    <footer style={{ background: 'var(--navy)', color: '#94a3b8' }}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12">

          {/* Brand */}
          <div className="lg:col-span-1">
            <div className="flex items-center gap-2 mb-4">
              <div className="w-9 h-9 rounded-xl flex items-center justify-center text-white font-bold text-lg"
                   style={{ background: 'linear-gradient(135deg, #e94560, #f97316)' }}>
                R
              </div>
              <span className="text-xl font-bold text-white" style={{ fontFamily: 'Playfair Display, serif' }}>
                RT<span style={{ color: '#e94560' }}>Shop</span>
              </span>
            </div>
            <p className="text-sm leading-relaxed mb-6">
              {t('about.mission_desc')}
            </p>
            {/* Social */}
            <div className="flex gap-3">
              {[
                { href: '#', icon: 'M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z' },
                { href: '#', icon: 'M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z' },
              ].map((social, i) => (
                <a
                  key={i}
                  href={social.href}
                  className="w-9 h-9 rounded-lg flex items-center justify-center transition-colors"
                  style={{ background: 'rgba(255,255,255,0.1)' }}
                  onMouseEnter={e => (e.currentTarget.style.background = '#1d4ed8')}
                  onMouseLeave={e => (e.currentTarget.style.background = 'rgba(255,255,255,0.1)')}
                >
                  <svg className="w-4 h-4 fill-current text-white" viewBox="0 0 24 24">
                    <path d={social.icon} />
                  </svg>
                </a>
              ))}
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="text-white font-semibold mb-5">{t('footer.quick_links')}</h4>
            <ul className="space-y-3">
              {[
                { href: '/', label: t('nav.home') },
                { href: '/products', label: t('nav.products') },
                { href: '/about', label: t('nav.about') },
                { href: '/track-order', label: t('nav.track_order') },
              ].map((link) => (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    className="text-sm transition-colors hover:text-white"
                    style={{ color: '#94a3b8' }}
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h4 className="text-white font-semibold mb-5">{t('about.contact')}</h4>
            <ul className="space-y-3 text-sm">
              <li className="flex items-start gap-2">
                <svg className="w-4 h-4 mt-0.5 shrink-0" style={{ color: '#1d4ed8' }} fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                </svg>
                <span>TP. Hà Nội</span>
              </li>
              <li className="flex items-center gap-2">
                <svg className="w-4 h-4 shrink-0" style={{ color: '#1d4ed8' }} fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                </svg>
                <a href="mailto:dev@trucla.id.vn" className="hover:text-white transition-colors">
                  dev@trucla.id.vn
                </a>
              </li>
              <li className="flex items-center gap-2">
                <svg className="w-4 h-4 shrink-0" style={{ color: '#1d4ed8' }} fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                </svg>
                <a href="tel:+84988715180" className="hover:text-white transition-colors">
                  0988 715 180
                </a>
              </li>
            </ul>
          </div>

          {/* Newsletter */}
          <div>
            <h4 className="text-white font-semibold mb-2">{t('footer.newsletter')}</h4>
            <p className="text-sm mb-4">{t('footer.newsletter_desc')}</p>
            <form onSubmit={handleSubscribe} className="flex flex-col gap-2">
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder={t('footer.email_placeholder')}
                className="w-full px-4 py-2.5 rounded-xl text-sm outline-none text-white placeholder-gray-500"
                style={{ background: 'rgba(255,255,255,0.08)', border: '1px solid rgba(255,255,255,0.15)' }}
                required
              />
              <button
                type="submit"
                disabled={subscribing}
                className="px-4 py-2.5 rounded-xl text-sm font-semibold text-white transition-all disabled:opacity-50"
                style={{ background: '#1d4ed8' }}
              >
                {subscribing ? '...' : t('footer.subscribe')}
              </button>
            </form>
          </div>
        </div>

        {/* Bottom */}
        <div className="border-t mt-12 pt-8 text-center text-sm" style={{ borderColor: 'rgba(255,255,255,0.1)' }}>
          {t('footer.rights')}
        </div>
      </div>
    </footer>
  );
}

