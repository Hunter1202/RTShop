'use client';

import { useState, useEffect, useRef, useCallback } from 'react';
import Link from 'next/link';
import { useTranslation } from 'react-i18next';
import { useCartStore, useThemeStore } from '@/store';
import { productApi, formatVND, getProductName } from '@/lib/api';
import i18n from '@/i18n/config';
import CartDrawer from './CartDrawer';

export default function Navbar() {
  const { t } = useTranslation('common');
  const { getCount, toggleCart } = useCartStore();
  const { theme, toggleTheme } = useThemeStore();

  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState<any[]>([]);
  const [isSearching, setIsSearching] = useState(false);
  const [showSearch, setShowSearch] = useState(false);
  const [lang, setLang] = useState(i18n.language || 'vi');

  const searchRef = useRef<HTMLDivElement>(null);
  const searchTimeout = useRef<NodeJS.Timeout>();
  const cartCount = getCount();

  useEffect(() => {
    const handleScroll = () => setIsScrolled(window.scrollY > 20);
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Close search on outside click
  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (searchRef.current && !searchRef.current.contains(e.target as Node)) {
        setShowSearch(false);
        setSearchResults([]);
      }
    };
    document.addEventListener('mousedown', handler);
    return () => document.removeEventListener('mousedown', handler);
  }, []);

  // Debounced search
  const handleSearch = useCallback((q: string) => {
    setSearchQuery(q);
    clearTimeout(searchTimeout.current);
    if (q.length < 2) { setSearchResults([]); return; }
    setIsSearching(true);
    searchTimeout.current = setTimeout(async () => {
      try {
        const res = await productApi.search(q);
        setSearchResults(res.data.data || []);
      } catch { setSearchResults([]); }
      finally { setIsSearching(false); }
    }, 300);
  }, []);

  const toggleLang = () => {
    const newLang = lang === 'vi' ? 'en' : 'vi';
    i18n.changeLanguage(newLang);
    setLang(newLang);
    localStorage.setItem('rtshop-lang', newLang);
  };

  const navLinks = [
    { href: '/', label: t('nav.home') },
    { href: '/products', label: t('nav.products') },
    { href: '/about', label: t('nav.about') },
    { href: '/track-order', label: t('nav.track_order') },
  ];

  return (
    <>
      <nav
        className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 bg-white/10 backdrop-blur-md border-b border-white/20 shadow-lg py-3`}
        style={{ borderBottom: isScrolled ? '1px solid var(--border)' : 'none' }}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between gap-4">

            {/* Logo */}
            <Link href="/" className="flex items-center gap-2 shrink-0">
              <div className="w-9 h-9 rounded-xl flex items-center justify-center text-white font-bold text-lg"
                   style={{ background: 'linear-gradient(135deg, #e94560, #f97316)' }}>R
              </div>
              <span className="text-xl font-bold hidden text-white sm:block" style={{ fontFamily: 'Playfair Display, serif' }}>
                   <span style={{ color: '#e94560' }}>RTShop</span>
              </span>
            </Link>

            {/* Desktop Nav Links */}
            <div className="hidden md:flex items-center gap-1">
              {navLinks.map((link) => (
                <Link
                  key={link.href}
                  href={link.href}
                  className="px-4 font-bold py-2 rounded-lg transition-colors duration-150 hover:bg-primary-50 dark:hover:bg-dark-700"
                  style={{ color: '#8A97AB' }}>
                  {link.label}
                </Link>
              ))}
            </div>

            {/* Right Actions */}
            <div className="flex items-center gap-2">
              {/* Search */}
              <div ref={searchRef} className="relative">
                <button
                  onClick={() => setShowSearch(!showSearch)}
                  className="p-2.5 rounded-xl transition-colors hover:bg-primary-50 dark:hover:bg-dark-700"
                  aria-label="Search">
                  <svg className="w-5 h-5" style={{ color: 'var(--text-secondary)' }} fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                  </svg>
                </button>

                {/* Search Dropdown */}
                {showSearch && (
                  <div className="fixed translate-y-2 right-4 w-64 card shadow-xl animate-slide-down z-50">
                    <div className="p-1">
                      <input
                        autoFocus
                        type="text"
                        value={searchQuery}
                        onChange={(e) => handleSearch(e.target.value)}
                        placeholder={t('nav.search_placeholder')}
                        className="input-field text-sm"
                      />
                    </div>
                    {(isSearching || searchResults.length > 0) && (
                      <div className="border-t px-1 pb-1" style={{ borderColor: 'var(--border)' }}>
                        {isSearching ? (
                          <div className="p-2 text-center text-sm" style={{ color: 'var(--text-secondary)' }}>
                            {t('common.loading')}
                          </div>
                        ) : (
                          searchResults.map((p) => (
                            <Link
                              key={p.id}
                              href={`/products/${p.slug}`}
                              onClick={() => { setShowSearch(false); setSearchResults([]); setSearchQuery(''); }}
                              className="flex items-center gap-3 p-2 rounded-lg hover:bg-primary-50 dark:hover:bg-dark-700 transition-colors"
                            >
                              <div className="w-10 h-10 rounded-lg bg-gray-100 dark:bg-dark-700 overflow-hidden shrink-0">
                                {p.images?.[0] && (
                                  <img src={p.images[0]} alt={getProductName(p, lang)} className="w-full h-full object-cover" />
                                )}
                              </div>
                              <div className="min-w-0">
                                <p className="text-sm font-medium truncate" style={{ color: 'var(--text)' }}>
                                  {getProductName(p, lang)}
                                </p>
                                <p className="text-xs font-semibold" style={{ color: 'var(--accent)' }}>
                                  {formatVND(p.price)}
                                </p>
                              </div>
                            </Link>
                          ))
                        )}
                      </div>
                    )}
                  </div>
                )}
              </div>

              {/* Language Toggle */}
              <button
                onClick={toggleLang}
                className="hidden sm:flex items-center gap-1 px-3 py-2 rounded-xl text-sm font-semibold transition-colors hover:bg-primary-50 dark:hover:bg-dark-700"
                style={{ color: 'var(--text-secondary)' }}>
                <span>{lang === 'vi' ? '🇻🇳' : '🇺🇸'}</span>
                <span>{lang.toUpperCase()}</span>
              </button>

              {/* Theme Toggle */}
              <button
                onClick={toggleTheme}
                className="p-2.5 rounded-xl transition-colors hover:bg-primary-50 dark:hover:bg-dark-700"
                aria-label="Toggle theme">
                {theme === 'dark' ? (
                  <svg className="w-5 h-5" style={{ color: 'var(--text-secondary)' }} fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364 6.364l-.707-.707M6.343 6.343l-.707-.707m12.728 0l-.707.707M6.343 17.657l-.707.707M16 12a4 4 0 11-8 0 4 4 0 018 0z" />
                  </svg>
                ) : (
                  <svg className="w-5 h-5" style={{ color: 'var(--text-secondary)' }} fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20.354 15.354A9 9 0 018.646 3.646 9.003 9.003 0 0012 21a9.003 9.003 0 008.354-5.646z" />
                  </svg>
                )}
              </button>

              {/* Cart Button */}
              <button
                onClick={toggleCart}
                className="relative p-2.5 rounded-xl transition-colors hover:bg-primary-50 dark:hover:bg-dark-700"
                aria-label={t('nav.cart')}>
                <svg className="w-5 h-5" style={{ color: 'var(--text-secondary)' }} fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
                </svg>
                {cartCount > 0 && (
                  <span className="absolute -top-1 -right-1 w-5 h-5 text-white text-xs font-bold rounded-full flex items-center justify-center animate-scale-in"
                        style={{ background: 'var(--accent)' }}>
                    {cartCount > 99 ? '99+' : cartCount}
                  </span>
                )}
              </button>

              {/* Mobile Menu Button */}
              <button
                onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                className="md:hidden p-2.5 rounded-xl transition-colors hover:bg-primary-50 dark:hover:bg-dark-700">
                <svg className="w-5 h-5" style={{ color: 'var(--text-secondary)' }} fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  {isMobileMenuOpen ? (
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  ) : (
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                  )}
                </svg>
              </button>
            </div>
          </div>

          {/* Mobile Menu */}
          {isMobileMenuOpen && (
            <div className="md:hidden mt-4 pb-4 border-t animate-slide-down" style={{ borderColor: 'var(--border)' }}>
              <div className="flex flex-col items-center gap-1 pt-4">
                {navLinks.map((link) => (
                  <Link
                    key={link.href}
                    href={link.href}
                    onClick={() => setIsMobileMenuOpen(false)}
                    className="px-4 py-3 rounded-xl text-xl font-bold transition-colors"
                    style={{ color: '#8A97AB' }}>
                    {link.label}
                  </Link>
                ))}
                <button
                  onClick={toggleLang}
                  className="flex items-center text-xl gap-2 px-4 py-3 rounded-xl text-sm font-bold text-left"
                  style={{ color: 'var(--text-secondary)' }}>
                  <span>{lang === 'vi' ? '🇻🇳' : '🇺🇸'}</span>
                  <span>{lang === 'vi' ? 'Tiếng Việt' : 'English'}</span>
                </button>
              </div>
            </div>
          )}
        </div>
      </nav>

      {/* Cart Drawer */}
      <CartDrawer />
    </>
  );
}

