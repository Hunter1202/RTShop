'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { useTranslation } from 'react-i18next';
import Navbar from '@/components/layout/Navbar';
import Footer from '@/components/layout/Footer';
import ProductCard from '@/components/product/ProductCard';
import { productApi, categoryApi, getCategoryName } from '@/lib/api';
import i18n from '@/i18n/config';

export default function HomePage() {
  const { t } = useTranslation('common');
  const lang = i18n.language || 'vi';

  const [featuredProducts, setFeaturedProducts] = useState<any[]>([]);
  const [newProducts, setNewProducts] = useState<any[]>([]);
  const [categories, setCategories] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {

    const loadData = async () => {
      try {
        const [featured, newest, cats] = await Promise.all([
          productApi.getAll({
            featured: 'true',
            limit: 8,
          }),

          productApi.getAll({
            sort: 'newest',
            limit: 8,
          }),

          categoryApi.getAll(),
        ]);

        setFeaturedProducts(featured.data.data || []);
        setNewProducts(newest.data.data || []);
        setCategories(cats.data.data || []);

      } catch (err) {
        console.error('Failed to load homepage data:', err);
      } finally {
        setLoading(false);
      }
    };
    loadData();
  }, []);

  return (
    <div style={{ background: 'var(--bg)' }}>
      <Navbar />
      {/* ───────────────── HERO ───────────────── */}
        <div className="rt-modern">
        <section className="hero">
            <img src="/img/hero.webp" alt="RTShop hero background"/>
            <div className="container hero-content">
                <div className="hero-inner">
                    <div className="hero-sub">{t('hero.badge')}</div>
                    <h1>
                        {t('hero.title')}
                        <br />
                    </h1>
                    <p className="hero-text">{t('hero.subtitle')}</p>
                    <div className="hero-buttons">
                        <Link href="/products" className="btn-solid">{t('hero.cta_primary')}</Link>
                        <Link href="/products?sort=newest" className="btn-outline">
                            {lang === 'vi' ? 'Sản phẩm mới nhất' : 'View New Arrivals'}
                        </Link>
                    </div>
                </div>
            </div>
        </section>
        </div>

      {/* ───────────────── CATEGORIES ───────────────── */}
      {categories.length > 0 && (
        <section className="py-20 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
          <div className="text-center mb-6">
            <h2 className="section-title">
              {lang === 'vi' ? 'Danh mục' : 'Categories'}
            </h2>
          </div>
            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-4">
                {categories.slice(0, 6).map((cat, i) => (
                    <Link key={cat.id} href={`/products?category=${cat.slug}`}
                          className="group relative p-6 text-center rounded-xl border border-gray-100 dark:border-gray-800 bg-white dark:bg-zinc-900 transition-all duration-300 hover:border-black dark:hover:border-white hover:shadow-[0_20px_50px_rgba(0,0,0,0.05)]"
                    >
                        {/* Background Accent */}
                        <div className="absolute top-0 left-0 w-full h-1 bg-black scale-x-0 group-hover:scale-x-100 transition-transform duration-300 origin-left" />

                        <p className="text-sm font-bold tracking-widest uppercase transition-colors duration-300">
                            {getCategoryName(cat, lang)}
                        </p>

                        <div className="mt-4 flex items-center justify-center space-x-2">
                            <span className="h-[1px] w-4 bg-gray-300 group-hover:w-8 transition-all duration-300" />
                            <p className="text-[14px] font-medium text-gray-400">
                                {cat.product_count}
                            </p>
                            <span className="h-[1px] w-4 bg-gray-300 group-hover:w-8 transition-all duration-300" />
                        </div>
                    </Link>
                ))}
            </div>
        </section>
      )}

      {/* ───────────────── FEATURED PRODUCTS ───────────────── */}
      <section className="py-20 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
          <div className="text-center mb-6">
              <h2 className="section-title">
                  {t('products.featured')}
              </h2>
          </div>
        <div className="flex items-end justify-end mb-6">
          <Link
            href="/products?featured=true"
            className="text-sm font-semibold hover:underline"
            style={{ color: 'var(--accent)' }}>
            {t('common.view_all')} →
          </Link>
        </div>
        {loading ? (
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-5">
            {Array.from({ length: 8 }).map((_, i) => (
              <div key={i} className="rounded-2xl overflow-hidden">
                <div className="skeleton aspect-square" />
                <div className="p-4 space-y-2">
                  <div className="skeleton h-4 w-3/4 rounded" />
                  <div className="skeleton h-5 w-1/2 rounded" />
                </div>
              </div>
            ))}
          </div>
        ) : featuredProducts.length > 0 ? (
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-5">
            {featuredProducts.map((product, i) => (
              <div key={product.id} className="animate-fade-in" style={{animationDelay: `${i * 0.05}s`,}}>
                <ProductCard product={product} />
              </div>
            ))}
          </div>
        ) : null}
      </section>

        <style jsx global>{`
        .rt-modern {
          font-family: 'Inter', sans-serif;
          background: #000;
          color: #f5f1e8;
          overflow-x: hidden;
        }

        .rt-modern a {
          text-decoration: none;
          color: inherit;
        }

        .rt-modern img {
          width: 100%;
          display: block;
        }

        .rt-modern .container {
          width: min(1200px, 90%);
          margin: auto;
        }

        .rt-modern .hero {
          position: relative;
          min-height: 100vh;
          overflow: hidden;
        }

        .rt-modern .hero > img {
          position: absolute;
          inset: 0;
          width: 100%;
          height: 100%;
          object-fit: cover;
          opacity: 0.45;
        }
        .rt-modern header {
          position: relative;
          z-index: 2;
          padding: 35px 0;
        }
        .rt-modern .navbar {
          display: flex;
          justify-content: space-between;
          align-items: center;
          gap: 24px;
        }
        .rt-modern nav {
          display: flex;
          gap: 40px;
          text-transform: uppercase;
          font-size: 12px;
          letter-spacing: 0.2em;
          color: #d7d0c5;
        }
        .rt-modern nav a {
          transition: 0.3s;
        }
        .rt-modern nav a:hover {
          color: #fff;
        }
        .rt-modern .btn-outline {
          border: 1px solid rgba(255, 255, 255, 0.5);
          padding: 14px 28px;
          font-size: 11px;
          letter-spacing: 0.2em;
          text-transform: uppercase;
          transition: 0.3s;
        }
        .rt-modern .btn-outline:hover {
          background: #fff;
          color: #000;
        }
        .rt-modern .btn-solid {
          background: #f5f1e8;
          color: #000;
          padding: 16px 34px;
          font-size: 11px;
          letter-spacing: 0.25em;
          text-transform: uppercase;
          transition: 0.3s;
        }
        .rt-modern .btn-solid:hover {
          opacity: 0.85;
        }
        .rt-modern .hero-content {
          position: relative;
          z-index: 2;
          min-height: calc(100vh - 120px);
          display: flex;
          align-items: center;
        }
        .rt-modern .hero-inner {
          max-width: 750px;
        }
        .rt-modern .hero-sub {
          font-size: 12px;
          letter-spacing: 0.4em;
          text-transform: uppercase;
          color: #d0c8bc;
          margin-bottom: 30px;
        }
        .rt-modern .hero h1 {
          font-family: 'Cormorant Garamond', serif;
          font-size: 82px;
          line-height: 1;
          font-weight: 300;
          margin-bottom: 35px;
        }
        .rt-modern .hero-text,
        .rt-modern .section-text {
          color: #d2cbc1;
          font-size: 18px;
          line-height: 1.9;
          max-width: 620px;
          margin-bottom: 45px;
        }

        .rt-modern .hero-buttons {
          display: flex;
          gap: 20px;
          flex-wrap: wrap;
        }

        .rt-modern section {
          padding: 130px 0;
          border-top: 1px solid rgba(255, 255, 255, 0.08);
        }

        .rt-modern .section-label {
          text-transform: uppercase;
          letter-spacing: 0.35em;
          font-size: 11px;
          color: #8f887e;
          margin-bottom: 24px;
        }

        .rt-modern .section-title {
          font-family: 'Cormorant Garamond', serif;
          font-size: 60px;
          line-height: 1.1;
          font-weight: 300;
          margin-bottom: 35px;
          letter-spacing: 0;
        }

        .rt-modern .story-grid {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 80px;
          align-items: center;
        }

        .rt-modern .category-grid {
          display: grid;
          grid-template-columns: repeat(2, minmax(0, 1fr));
          gap: 20px;
        }

        .rt-modern .category-card {
          background: #0d0d0d;
          border-radius: 20px;
          padding: 28px;
          transition: 0.3s;
          border: 1px solid rgba(255, 255, 255, 0.08);
        }

        .rt-modern .category-card:hover {
          transform: translateY(-4px);
          border-color: rgba(255, 255, 255, 0.24);
        }

        .rt-modern .category-card h3 {
          font-family: 'Cormorant Garamond', serif;
          font-size: 32px;
          font-weight: 400;
          margin-bottom: 12px;
        }

        .rt-modern .category-card p {
          color: #bdb5aa;
          line-height: 1.9;
        }

        .rt-modern .dishes-header {
          display: flex;
          justify-content: space-between;
          align-items: end;
          margin-bottom: 70px;
          gap: 30px;
        }

        .rt-modern .cards-grid {
          display: grid;
          grid-template-columns: repeat(4, minmax(0, 1fr));
          gap: 28px;
        }

        .rt-modern .product-wrap {
          background: #0d0d0d;
          border-radius: 20px;
          overflow: hidden;
        }

        .rt-modern .skeleton-card {
          height: 340px;
          border-radius: 20px;
          background: linear-gradient(90deg, #111 25%, #181818 37%, #111 63%);
          background-size: 400% 100%;
          animation: rt-shimmer 1.5s ease-in-out infinite;
        }
        .rt-modern .experience {
          text-align: center;
          max-width: 900px;
          margin: auto;
        }
        @keyframes rt-shimmer {
          0% { background-position: 100% 0; }
          100% { background-position: -100% 0; }
        }
        @media (max-width: 992px) {
          .rt-modern .story-grid,
          .rt-modern .cards-grid {
            grid-template-columns: 1fr;
          }
          .rt-modern .category-grid {
            grid-template-columns: 1fr;
          }
          .rt-modern .hero h1 {
            font-size: 60px;
          }
          .rt-modern .section-title {
            font-size: 46px;
          }
          .rt-modern nav {
            display: none;
          }
          .rt-modern .dishes-header {
            flex-direction: column;
            align-items: flex-start;
          }
        }
        @media (max-width: 640px) {
          .rt-modern .hero h1 {
            font-size: 48px;
          }
          .rt-modern .section-title {
            font-size: 38px;
          }
          .rt-modern .hero-text,
          .rt-modern .section-text {
            font-size: 16px;
          }
        }
      `}</style>
      <Footer />
    </div>
  );
}