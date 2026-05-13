'use client';

import { useState, useEffect, useCallback } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import { useTranslation } from 'react-i18next';
import Navbar from '@/components/layout/Navbar';
import Footer from '@/components/layout/Footer';
import ProductCard from '@/components/product/ProductCard';
import { productApi, categoryApi, getCategoryName } from '@/lib/api';
import i18n from '@/i18n/config';

export default function ProductsPage() {
  const { t } = useTranslation('common');
  const lang = i18n.language || 'vi';
  const router = useRouter();
  const searchParams = useSearchParams();

  const [products, setProducts] = useState<any[]>([]);
  const [categories, setCategories] = useState<any[]>([]);
  const [pagination, setPagination] = useState({ total: 0, pages: 1, page: 1 });
  const [loading, setLoading] = useState(true);

  const activeCategory = searchParams.get('category') || 'all';
  const activeSort = searchParams.get('sort') || 'newest';
  const activePage = parseInt(searchParams.get('page') || '1');

  const updateParams = (updates: Record<string, string | null>) => {
    const params = new URLSearchParams(searchParams.toString());
    Object.entries(updates).forEach(([k, v]) => {
      if (v) params.set(k, v); else params.delete(k);
    });
    params.delete('page'); // Reset to page 1 on filter change
    router.push(`/products?${params.toString()}`);
  };

  const loadProducts = useCallback(async () => {
    setLoading(true);
    try {
      const params: Record<string, any> = {
        sort: activeSort,
        page: activePage,
        limit: 16,
      };
      if (activeCategory !== 'all') params.category = activeCategory;

      const res = await productApi.getAll(params);
      setProducts(res.data.data || []);
      setPagination(res.data.pagination || { total: 0, pages: 1, page: 1 });
    } catch (err) {
      console.error('Failed to load products:', err);
    } finally {
      setLoading(false);
    }
  }, [activeCategory, activeSort, activePage]);

  useEffect(() => {
    loadProducts();
  }, [loadProducts]);

  useEffect(() => {
    categoryApi.getAll().then(res => setCategories(res.data.data || [])).catch(() => {});
  }, []);

  const sortOptions = [
    { value: 'newest', label: t('products.sort_newest') },
    { value: 'popular', label: t('products.sort_popular') },
    { value: 'price_asc', label: t('products.sort_price_asc') },
    { value: 'price_desc', label: t('products.sort_price_desc') },
  ];

  return (
    <div style={{ background: 'var(--bg)' }}>
      <Navbar />

      {/* Header */}
      <div className="pt-28 pb-10 px-4 sm:px-6 lg:px-8" style={{ background: 'var(--bg-secondary)' }}>
        <div className="max-w-7xl mx-auto">
          <h1 className="section-title">{t('products.title')}</h1>
          <p className="section-subtitle" style={{ marginBottom: 0 }}>
            {pagination.total} {lang === 'vi' ? 'sản phẩm' : 'products found'}
          </p>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
        <div className="flex flex-col lg:flex-row gap-8">

          {/* Sidebar Filters */}
          <aside className="w-full lg:w-56 shrink-0">
            {/* Categories */}
            <div className="card p-5 mb-5">
              <h3 className="font-bold mb-4 text-sm uppercase tracking-wider" style={{ color: 'var(--text-secondary)' }}>
                {lang === 'vi' ? 'Danh mục' : 'Categories'}
              </h3>
              <div className="space-y-1">
                <button
                  onClick={() => updateParams({ category: null })}
                  className={`w-full text-left px-3 py-2 rounded-lg text-sm font-medium transition-all ${
                    activeCategory === 'all' ? 'text-white' : ''
                  }`}
                  style={activeCategory === 'all' ? { background: 'var(--accent)', color: 'white' } : { color: 'var(--text-secondary)' }}
                >
                  {t('common.all')}
                </button>
                {categories.map((cat) => (
                  <button
                    key={cat.id}
                    onClick={() => updateParams({ category: cat.slug })}
                    className={`w-full text-left px-3 py-2 rounded-lg text-sm font-medium transition-all flex justify-between items-center ${
                      activeCategory === cat.slug ? 'text-white' : ''
                    }`}
                    style={activeCategory === cat.slug
                      ? { background: 'var(--accent)', color: 'white' }
                      : { color: 'var(--text-secondary)' }}
                  >
                    <span>{getCategoryName(cat, lang)}</span>
                    <span className="text-xs opacity-60">{cat.product_count}</span>
                  </button>
                ))}
              </div>
            </div>
          </aside>

          {/* Main Content */}
          <div className="flex-1">
            {/* Sort Bar */}
            <div className="flex items-center gap-3 mb-6 flex-wrap">
              <span className="text-sm font-medium" style={{ color: 'var(--text-secondary)' }}>
                {t('common.sort')}:
              </span>
              {sortOptions.map((opt) => (
                <button
                  key={opt.value}
                  onClick={() => updateParams({ sort: opt.value })}
                  className="px-4 py-2 rounded-xl text-sm font-medium transition-all"
                  style={activeSort === opt.value
                    ? { background: 'var(--accent)', color: 'white' }
                    : { background: 'var(--bg-secondary)', color: 'var(--text-secondary)', border: '1px solid var(--border)' }}
                >
                  {opt.label}
                </button>
              ))}
            </div>

            {/* Products Grid */}
            {loading ? (
              <div className="grid grid-cols-2 sm:grid-cols-3 xl:grid-cols-4 gap-5">
                {Array.from({ length: 16 }).map((_, i) => (
                  <div key={i} className="rounded-2xl overflow-hidden">
                    <div className="skeleton aspect-square" />
                    <div className="p-4 space-y-2">
                      <div className="skeleton h-4 w-3/4 rounded" />
                      <div className="skeleton h-5 w-1/2 rounded" />
                    </div>
                  </div>
                ))}
              </div>
            ) : products.length === 0 ? (
              <div className="text-center py-20">
                <div className="text-6xl mb-4">🔍</div>
                <p className="text-lg font-semibold mb-2" style={{ color: 'var(--text)' }}>
                  {t('products.no_products')}
                </p>
                <button onClick={() => updateParams({ category: null })} className="btn-primary mt-4">
                  {t('common.all')} {t('products.title')}
                </button>
              </div>
            ) : (
              <>
                <div className="grid grid-cols-2 sm:grid-cols-3 xl:grid-cols-4 gap-5">
                  {products.map((product, i) => (
                    <div key={product.id} className="animate-fade-in" style={{ animationDelay: `${i * 0.03}s` }}>
                      <ProductCard product={product} />
                    </div>
                  ))}
                </div>

                {/* Pagination */}
                {pagination.pages > 1 && (
                  <div className="flex items-center justify-center gap-2 mt-12">
                    <button
                      onClick={() => updateParams({ page: String(activePage - 1) })}
                      disabled={activePage <= 1}
                      className="px-4 py-2 rounded-xl text-sm font-medium disabled:opacity-40"
                      style={{ background: 'var(--bg-secondary)', color: 'var(--text)', border: '1px solid var(--border)' }}
                    >
                      ← {t('common.previous')}
                    </button>

                    {Array.from({ length: Math.min(pagination.pages, 7) }, (_, i) => i + 1).map((page) => (
                      <button
                        key={page}
                        onClick={() => updateParams({ page: String(page) })}
                        className="w-10 h-10 rounded-xl text-sm font-medium transition-all"
                        style={page === activePage
                          ? { background: 'var(--accent)', color: 'white' }
                          : { background: 'var(--bg-secondary)', color: 'var(--text)', border: '1px solid var(--border)' }}
                      >
                        {page}
                      </button>
                    ))}

                    <button
                      onClick={() => updateParams({ page: String(activePage + 1) })}
                      disabled={activePage >= pagination.pages}
                      className="px-4 py-2 rounded-xl text-sm font-medium disabled:opacity-40"
                      style={{ background: 'var(--bg-secondary)', color: 'var(--text)', border: '1px solid var(--border)' }}
                    >
                      {t('common.next')} →
                    </button>
                  </div>
                )}
              </>
            )}
          </div>
        </div>
      </div>
      <Footer />
    </div>
  );
}
