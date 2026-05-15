'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { useTranslation } from 'react-i18next';
import Navbar from '@/components/layout/Navbar';
import Footer from '@/components/layout/Footer';
import ProductCard from '@/components/product/ProductCard';
import { productApi, categoryApi, customOrderApi, getCategoryName } from '@/lib/api';
import i18n from '@/i18n/config';
import toast from 'react-hot-toast';

export default function HomePage() {
  const { t } = useTranslation('common');
  const lang = i18n.language || 'vi';

  const [featuredProducts, setFeaturedProducts] = useState<any[]>([]);
  const [newProducts, setNewProducts] = useState<any[]>([]);
  const [categories, setCategories] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [customSubmitting, setCustomSubmitting] = useState(false);
  const [customForm, setCustomForm] = useState({
    name: '',
    phone: '',
    facebook: '',
    email: '',
    services: '',
    description: '',
  });

  useEffect(() => {
    const loadData = async () => {
      try {
        const [featured, newest, cats] = await Promise.all([
          productApi.getAll({ featured: 'true', limit: 8 }),
          productApi.getAll({ sort: 'newest', limit: 8 }),
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

  const submitCustomOrder = async (e: React.FormEvent) => {
    e.preventDefault();
    setCustomSubmitting(true);
    try {
      await customOrderApi.create(customForm);
      toast.success(lang === 'vi' ? 'Chúng tôi sẽ sớm liên hệ tới bạn!' : 'Custom request sent successfully!');
      setCustomForm({ name: '', phone: '', facebook: '', email: '', services: '', description: '' });
    } catch (err: any) {
      const resData = err.response?.data;
      const errors = Array.isArray(resData?.errors) ? resData.errors : [];
      if (errors.length) {
        errors.forEach((x: any) => toast.error(`${x.field}: ${x.message}`));
      } else {
        toast.error(resData?.message || 'Failed to submit custom request');
      }
    } finally {
      setCustomSubmitting(false);
    }
  };

  return (
    <div style={{ background: 'var(--bg)' }}>
      <Navbar />
      <section className="relative min-h-screen overflow-hidden bg-black text-[#f5f1e8]">
        <img
          src="/img/hero.webp"
          alt="RTShop hero background"
          fetchPriority="high"
          className="absolute inset-0 h-full w-full object-cover opacity-45"
        />

        <div className="relative z-10 mx-auto flex min-h-[calc(100vh-120px)] w-[90%] max-w-[1200px] items-center pt-24">
          <div className="max-w-[750px]">
            <div className="mb-8 text-xs uppercase tracking-[0.4em] text-[#d0c8bc]">{t('hero.badge')}</div>

            <h1 className="mb-8 text-4xl font-light leading-[1.02] md:text-5xl lg:text-[72px]">
              {t('hero.title')}
            </h1>

            <p className="mb-10 max-w-[620px] text-base leading-8 text-[#d2cbc1] md:text-lg">
              {t('hero.subtitle')}
            </p>

            <div className="flex flex-wrap gap-5">
              <Link
                href="/products"
                className="bg-[#f5f1e8] px-8 py-4 text-[11px] uppercase tracking-[0.25em] text-black transition hover:opacity-85">
                {t('hero.cta_primary')}
              </Link>

              <Link
                href="/products?sort=newest"
                className="border border-white/50 px-7 py-3.5 text-[11px] uppercase tracking-[0.2em] transition hover:bg-white hover:text-black">
                {lang === 'vi' ? 'Sản phẩm mới' : 'New Arrivals'}
              </Link>
            </div>
          </div>
        </div>
      </section>

      {categories.length > 0 && (
        <section className="mx-auto max-w-7xl px-4 py-20 sm:px-6 lg:px-8">
          <div className="mb-6 text-center">
            <h2 className="section-title">{lang === 'vi' ? 'Danh mục' : 'Categories'}</h2>
          </div>

            <div className="grid grid-cols-2 gap-6 sm:grid-cols-3 lg:grid-cols-6">
                {categories.slice(0, 6).map((cat, i) => (
                    <Link
                        key={cat.id}
                        href={`/products?category=${cat.slug}`}
                        className="group relative h-40 flex flex-col items-center justify-center rounded-2xl overflow-hidden transition-all duration-500 hover:-translate-y-2"
                        style={{
                            background: 'var(--bg)',
                            border: '1px solid var(--border-color, rgba(0,0,0,0.05))'
                        }}>
                        {/* 1. Background Glow & Mesh - Chỉ hiện rõ khi hover */}
                        <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none">
                            <div className="absolute -inset-[100%] animate-[spin_10s_linear_infinite] bg-[conic-gradient(from_0deg,transparent,rgba(59,130,246,0.1),transparent)]"></div>
                        </div>

                        {/* 2. Content Container */}
                        <div className="relative z-10 flex flex-col items-center">
                            {/* Placeholder cho Icon - Bạn có thể thay bằng các SVG tương ứng với Slug */}
                            <div className="mb-3 p-3 rounded-full bg-gray-500/5 text-blue-500 group-hover:bg-blue-500 group-hover:text-white transition-all duration-300 group-hover:scale-110 shadow-inner">
                                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="m7.5 4.27 9 5.15"/><path d="M21 8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16Z"/><path d="m3.3 7 8.7 5 8.7-5"/><path d="M12 22V12"/></svg>
                            </div>

                            <p className="text-xs font-bold uppercase tracking-[0.2em] transition-all duration-300 group-hover:tracking-[0.3em]" style={{ color: 'var(--text)' }}>
                                {getCategoryName(cat, lang)}
                            </p>

                            {/* Số lượng sản phẩm dạng Badge nhỏ gọn */}
                            <div className="mt-2 px-2 py-0.5 rounded-full bg-blue-500/10 dark:bg-white/10 opacity-60 group-hover:opacity-100 transition-opacity">
                               <span className="text-[10px] font-bold text-blue-600 dark:text-blue-300">
                                 {cat.product_count}
                               </span>
                            </div>
                        </div>

                        {/* 3. Hiệu ứng "Scanner Line" chạy dọc card khi hover */}
                        <div className="absolute top-0 left-0 w-full h-1/2 bg-gradient-to-b from-blue-500/10 to-transparent -translate-y-full group-hover:animate-[scan_2s_linear_infinite]"></div>

                        {/* 4. Bottom Accent Line */}
                        <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-0 h-1 bg-blue-500 transition-all duration-500 group-hover:w-1/2 rounded-t-full shadow-[0_0_15px_rgba(59,130,246,0.8)]"></div>
                    </Link>
                ))}
            </div>
        </section>
      )}

      <section className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
        <div className="mb-6 text-center">
          <h2 className="section-title">{t('products.featured')}</h2>
        </div>

        <div className="mb-6 flex items-end justify-end">
          <Link href="/products?featured=true" className="text-sm font-semibold hover:underline" style={{ color: 'var(--accent)' }}>
            {t('common.view_all')}
          </Link>
        </div>

        {loading ? (
          <div className="grid grid-cols-2 gap-5 sm:grid-cols-3 lg:grid-cols-4">
            {Array.from({ length: 8 }).map((_, i) => (
              <div key={i} className="overflow-hidden rounded-2xl">
                <div className="skeleton aspect-square" />
                <div className="space-y-2 p-4">
                  <div className="skeleton h-4 w-3/4 rounded" />
                  <div className="skeleton h-5 w-1/2 rounded" />
                </div>
              </div>
            ))}
          </div>
        ) : featuredProducts.length > 0 ? (
          <div className="grid grid-cols-2 gap-5 sm:grid-cols-3 lg:grid-cols-4">
            {featuredProducts.map((product, i) => (
              <div key={product.id} className="animate-fade-in" style={{ animationDelay: `${i * 0.05}s` }}>
                <ProductCard product={product} />
              </div>
            ))}
          </div>
        ) : null}
      </section>

      <section className="mx-auto max-w-4xl px-4 py-20 sm:px-6 lg:px-8">
        <div className="mb-8 text-center">
          <h2 className="section-title">{lang === 'vi' ? 'Thiết kế website/dịch vụ theo yêu cầu' : 'Tailored website/services built for your exact needs'}</h2>
        </div>

          <form onSubmit={submitCustomOrder} className="relative group overflow-hidden rounded-3xl p-[1px] transition-all duration-500 hover:shadow-[0_0_30px_rgba(59,130,246,0.2)]">
              {/* Hiệu ứng viền Gradient chạy xung quanh form khi hover */}
              <div className="absolute inset-0 bg-gradient-to-r from-blue-500 via-purple-500 to-pink-500 opacity-20 group-hover:opacity-50 transition-opacity"></div>
              <div className="relative card space-y-6 p-8 bg-white/80 dark:bg-[#0f172a]/90 backdrop-blur-xl rounded-[23px] border-none">
                  <div className="mb-8">
                      <h3 className="text-2xl font-bold mb-2" style={{ color: 'var(--text)' }}>
                          {lang === 'vi' ? 'Khởi động dự án' : 'Start a Project'}
                      </h3>
                      <p className="text-sm opacity-60" style={{ color: 'var(--text-secondary)' }}>
                          {lang === 'vi' ? 'Để lại thông tin, RTS sẽ liên hệ tư vấn giải pháp tối ưu nhất.' : 'Leave your details, RTS will contact you for the best solution.'}
                      </p>
                  </div>

                  <div className="grid gap-6 sm:grid-cols-2">
                      {[
                          { id: 'name', label: lang === 'vi' ? 'Họ tên *' : 'Full name *', type: 'text', required: true },
                          { id: 'phone', label: lang === 'vi' ? 'SĐT/Zalo/Whatsapp *' : 'Phone/Zalo/Whatsapp *', type: 'text', required: true },
                          { id: 'facebook', label: 'Facebook/Messenger', type: 'text', required: false },
                          { id: 'email', label: lang === 'vi' ? 'Email' : 'Email', type: 'email', required: false },
                      ].map((field) => (
                          <div key={field.id} className="relative group/input">
                              <input
                                  type={field.type}
                                  id={field.id}
                                  className="peer w-full bg-transparent border-b-2 py-2 outline-none transition-all placeholder-transparent"
                                  style={{ borderColor: 'var(--border-color, rgba(156, 163, 175, 0.3))', color: 'var(--text)' }}
                                  placeholder={field.label}
                                  value={customForm[field.id]}
                                  onChange={(e) => setCustomForm({ ...customForm, [field.id]: e.target.value })}
                                  required={field.required}
                              />
                              <label
                                  htmlFor={field.id}
                                  className="absolute left-0 -top-3.5 text-xs transition-all peer-placeholder-shown:text-base peer-placeholder-shown:top-2 peer-focus:-top-3.5 peer-focus:text-xs peer-focus:text-blue-500 opacity-60"
                                  style={{ color: 'var(--text-secondary)' }}>
                                  {field.label}
                              </label>
                              <div className="absolute bottom-0 left-0 h-[2px] w-0 bg-blue-500 transition-all duration-300 peer-focus:w-full"></div>
                          </div>
                      ))}
                  </div>

                  <div className="relative group/input">
                      <input
                          className="peer w-full bg-transparent border-b-2 py-2 outline-none transition-all placeholder-transparent"
                          style={{ borderColor: 'var(--border-color, rgba(156, 163, 175, 0.3))', color: 'var(--text)' }}
                          placeholder="Service"
                          value={customForm.services}
                          onChange={(e) => setCustomForm({ ...customForm, services: e.target.value })}
                          required
                      />
                      <label className="absolute left-0 -top-3.5 text-xs transition-all peer-placeholder-shown:text-base peer-placeholder-shown:top-2 peer-focus:-top-3.5 peer-focus:text-xs peer-focus:text-blue-500 opacity-60" style={{ color: 'var(--text-secondary)' }}>
                          {lang === 'vi' ? 'Dịch vụ (Website, App, Dashboard...) *' : 'Service interest *'}
                      </label>
                      <div className="absolute bottom-0 left-0 h-[2px] w-0 bg-blue-500 transition-all duration-300 peer-focus:w-full"></div>
                  </div>
                  <div className="relative group/input">
                      <textarea
                          className="peer w-full bg-transparent border-b-2 py-2 outline-none transition-all placeholder-transparent resize-none"
                          style={{ borderColor: 'var(--border-color, rgba(156, 163, 175, 0.3))', color: 'var(--text)' }}
                          rows={4}
                          placeholder="Description"
                          value={customForm.description}
                          onChange={(e) => setCustomForm({ ...customForm, description: e.target.value })}
                          required
                      />
                      <label className="absolute left-0 -top-3.5 text-xs transition-all peer-placeholder-shown:text-base peer-placeholder-shown:top-2 peer-focus:-top-3.5 peer-focus:text-xs peer-focus:text-blue-500 opacity-60" style={{ color: 'var(--text-secondary)' }}>
                          {lang === 'vi' ? 'Mô tả chi tiết yêu cầu *' : 'Detailed description *'}
                      </label>
                      <div className="absolute bottom-0 left-0 h-[2px] w-0 bg-blue-500 transition-all duration-300 peer-focus:w-full"></div>
                  </div>

                  <button type="submit" disabled={customSubmitting}
                      className="group relative w-full py-3 overflow-hidden rounded-xl font-bold tracking-widest text-white transition-all bg-blue-600 hover:bg-blue-700 hover:shadow-[0_0_20px_rgba(37,99,235,0.4)] disabled:opacity-50">
                      <span className="relative z-10 text-sm">
                        {customSubmitting ? (lang === 'vi' ? 'ĐANG GỬI...' : 'SUBMITTING...') : (lang === 'vi' ? 'GỬI YÊU CẦU' : 'SEND REQUEST')}
                      </span>
                      {/* Hiệu ứng vệt sáng chạy qua nút khi hover */}
                      <div className="absolute inset-0 -translate-x-full group-hover:translate-x-full transition-transform duration-1000 bg-gradient-to-r from-transparent via-white/20 to-transparent"></div>
                  </button>
              </div>
          </form>
      </section>
      <Footer />
    </div>
  );
}