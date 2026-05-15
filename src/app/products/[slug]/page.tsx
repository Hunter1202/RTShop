'use client';

import { useState, useEffect, useRef } from 'react';
import { useParams } from 'next/navigation';
import Link from 'next/link';
import { useTranslation } from 'react-i18next';
import Navbar from '@/components/layout/Navbar';
import Footer from '@/components/layout/Footer';
import ProductCard from '@/components/product/ProductCard';
import { productApi, formatVND, getProductName, getProductDesc } from '@/lib/api';
import { useCartStore } from '@/store';
import i18n from '@/i18n/config';
import toast from 'react-hot-toast';

export default function ProductDetailPage() {
  const { slug } = useParams<{ slug: string }>();
  const { t } = useTranslation('common');
  const lang = i18n.language || 'vi';
  const { addItem, openCart } = useCartStore();

  const [product, setProduct] = useState<any>(null);
  const [related, setRelated] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedImage, setSelectedImage] = useState(0);
  const [lightboxOpen, setLightboxOpen] = useState(false);
  const [quantity, setQuantity] = useState(1);

  const dragStartX = useRef<number | null>(null);
  const dragging = useRef(false);

  const images = product?.images?.length ? product.images : [];

  const goPrevImage = () => {
    if (!images.length) return;
    setSelectedImage((prev) => (prev - 1 + images.length) % images.length);
  };

  const goNextImage = () => {
    if (!images.length) return;
    setSelectedImage((prev) => (prev + 1) % images.length);
  };

  const onPointerDown = (e: React.PointerEvent<HTMLDivElement>) => {
    dragStartX.current = e.clientX;
    dragging.current = true;
  };

  const onPointerUp = (e: React.PointerEvent<HTMLDivElement>) => {
    if (!dragging.current || dragStartX.current === null) return;
    const delta = e.clientX - dragStartX.current;
    if (Math.abs(delta) > 36) {
      if (delta > 0) goPrevImage();
      else goNextImage();
    }
    dragging.current = false;
    dragStartX.current = null;
  };

  const onPointerCancel = () => {
    dragging.current = false;
    dragStartX.current = null;
  };

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (!lightboxOpen) return;
      if (e.key === 'Escape') setLightboxOpen(false);
      if (e.key === 'ArrowLeft') goPrevImage();
      if (e.key === 'ArrowRight') goNextImage();
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [lightboxOpen, images.length]);

  useEffect(() => {
    setLoading(true);
    productApi.getBySlug(slug)
      .then((res) => {
        setProduct(res.data.data);
        setRelated(res.data.data.related || []);
        setSelectedImage(0);
        setQuantity(1);
      })
      .catch(() => {})
      .finally(() => setLoading(false));
  }, [slug]);

  const handleAddToCart = () => {
    if (!product || product.stock_quantity === 0) return;
    addItem(product, quantity);
    openCart();
    toast.success(lang === 'vi' ? 'Đã thêm vào giỏ!' : 'Added to cart!');
  };

  if (loading) {
    return (
      <div style={{ background: 'var(--bg)' }}>
        <Navbar />
        <div className="max-w-6xl mx-auto px-4 pt-28 pb-16">
          <div className="grid grid-cols-2 gap-5">
            <div className="skeleton aspect-square rounded-2xl" />
            <div className="space-y-3">
              <div className="skeleton h-6 w-1/3 rounded" />
              <div className="skeleton h-8 w-3/4 rounded" />
              <div className="skeleton h-5 w-1/2 rounded" />
              <div className="skeleton h-20 rounded" />
            </div>
          </div>
        </div>
        <Footer />
      </div>
    );
  }

  if (!product) {
    return (
      <div style={{ background: 'var(--bg)' }}>
        <Navbar />
        <div className="max-w-5xl mx-auto px-4 py-28 text-center">
          <p className="text-lg" style={{ color: 'var(--text)' }}>Product not found</p>
          <Link href="/products" className="btn-primary mt-5 inline-block">Back to Products</Link>
        </div>
        <Footer />
      </div>
    );
  }

  const name = getProductName(product, lang);
  const desc = getProductDesc(product, lang);
  const isOutOfStock = product.stock_quantity === 0;
  const discount = product.original_price ? Math.round((1 - product.price / product.original_price) * 100) : 0;

  return (
    <div style={{ background: 'var(--bg)' }}>
      <Navbar />

      <div className="max-w-5xl mx-auto px-4 pt-24 pb-10">
        <nav className="flex items-center gap-2 text-xs mb-6" style={{ color: 'var(--text-secondary)' }}>
          <Link href="/">{t('nav.home')}</Link>
          <span>/</span>
          <Link href="/products">{t('products.title')}</Link>
          <span>/</span>
          <span className="truncate max-w-[120px] sm:max-w-xs" style={{ color: 'var(--text)' }}>{name}</span>
        </nav>

        <div className="grid grid-cols md:grid-cols-2 gap-5 mb-12">
          <div>
            <div
              className="relative aspect-square max-w-[380px] mx-auto rounded-2xl overflow-hidden touch-pan-y select-none"
              style={{ background: 'var(--bg-secondary)' }}
              onPointerDown={onPointerDown}
              onPointerUp={onPointerUp}
              onPointerCancel={onPointerCancel}
            >
              {images[selectedImage] ? (
                <img
                  src={images[selectedImage]}
                  alt={name}
                  className="w-full h-full object-cover cursor-zoom-in"
                  draggable={false}
                  onClick={() => setLightboxOpen(true)}
                />
              ) : (
                <div className="w-full h-full flex items-center justify-center">
                  <svg className="w-16 h-16" style={{ color: 'var(--border)' }} viewBox="0 0 24 24" fill="none" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.4} d="M4 16l4.5-4.5a2 2 0 012.8 0L16 16m-1.8-1.8l1.5-1.5a2 2 0 012.8 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                  </svg>
                </div>
              )}

              {images.length > 1 && (
                <>
                  <button
                    onClick={goPrevImage}
                    className="absolute left-2 top-1/2 -translate-y-1/2 w-9 h-9 rounded-full flex items-center justify-center"
                    style={{ background: 'rgba(15,23,42,0.72)', color: 'white' }}
                    aria-label="Previous image"
                  >
                    <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                    </svg>
                  </button>
                  <button
                    onClick={goNextImage}
                    className="absolute right-2 top-1/2 -translate-y-1/2 w-9 h-9 rounded-full flex items-center justify-center"
                    style={{ background: 'rgba(15,23,42,0.72)', color: 'white' }}
                    aria-label="Next image"
                  >
                    <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                    </svg>
                  </button>
                </>
              )}
            </div>

            {images.length > 1 && (
              <div className="mt-3 flex gap-2 justify-center overflow-x-auto pb-1">
                {images.map((img: string, i: number) => (
                  <button
                    key={i}
                    onClick={() => setSelectedImage(i)}
                    className="w-12 h-12 rounded-lg overflow-hidden border"
                    style={{ borderColor: selectedImage === i ? 'var(--accent)' : 'var(--border)' }}
                  >
                    <img src={img} alt="" className="w-full h-full object-cover" draggable={false} />
                  </button>
                ))}
              </div>
            )}
          </div>

          <div className="min-w-0">
            <h1 className="text-xl sm:text-2xl font-black leading-tight mb-2" style={{ fontFamily: 'Playfair Display, serif', color: 'var(--text)' }}>
              {name}
            </h1>

            <div className="flex items-center gap-2 mb-3">
              <span className="text-2xl sm:text-3xl font-black" style={{ color: 'var(--accent)' }}>{formatVND(product.price)}</span>
              {product.original_price && (
                <span className="text-sm sm:text-base line-through" style={{ color: 'var(--text-secondary)' }}>{formatVND(product.original_price)}</span>
              )}
              {discount > 0 && <span className="text-xs px-2 py-0.5 rounded-full bg-green-500 text-white">-{discount}%</span>}
            </div>

            <div className={`flex items-center gap-2 mb-4 text-xs font-semibold ${isOutOfStock ? 'text-red-500' : 'text-green-600'}`}>
              <span className={`w-2 h-2 rounded-full ${isOutOfStock ? 'bg-red-500' : 'bg-green-500'}`} />
              {isOutOfStock ? t('products.out_of_stock') : `${t('products.in_stock')} (${product.stock_quantity})`}
            </div>

            {desc && (
              <p className="text-sm leading-relaxed mb-5" style={{ color: 'var(--text-secondary)' }}>{desc}</p>
            )}
              <div className="pb-8">
                <a href={product.product_link} className="text-sm leading-relaxed text-blue-500 font-bold">{lang === 'vi' ? 'Link sản phẩm' : 'Link to product'}</a>
              </div>
           {!isOutOfStock && (
              <div className="flex items-center gap-3 mb-4">
                <div className="flex items-center rounded-lg border" style={{ borderColor: 'var(--border)' }}>
                  <button onClick={() => setQuantity(Math.max(1, quantity - 1))} className="w-9 h-9 flex items-center justify-center" style={{ color: 'var(--text)' }}>-</button>
                  <span className="w-8 text-center text-sm font-semibold" style={{ color: 'var(--text)' }}>{quantity}</span>
                  <button onClick={() => setQuantity(Math.min(product.stock_quantity, quantity + 1))} className="w-9 h-9 flex items-center justify-center" style={{ color: 'var(--text)' }}>+</button>
                </div>
              </div>
            )}

            <button onClick={handleAddToCart} disabled={isOutOfStock} className="btn-primary w-full py-3 text-sm">
              {isOutOfStock ? t('products.out_of_stock') : t('products.add_to_cart')}
            </button>
          </div>
        </div>

        {related.length > 0 && (
          <section>
            <h2 className="section-title mb-6">{t('products.related')}</h2>
            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
              {related.map((p) => <ProductCard key={p.id} product={p} />)}
            </div>
          </section>
        )}
      </div>

      <Footer />

      {lightboxOpen && images.length > 0 && (
        <div
          className="fixed inset-0 z-[70] flex items-center justify-center p-4"
          style={{ background: 'rgba(2,6,23,0.9)' }}
          onClick={() => setLightboxOpen(false)}
        >
          <div
            className="relative w-full max-w-4xl aspect-[4/3] rounded-xl overflow-hidden"
            onClick={(e) => e.stopPropagation()}
          >
            <img src={images[selectedImage]} alt={name} className="w-full h-full object-contain bg-black" />
            <button
              onClick={goPrevImage}
              className="absolute left-3 top-1/2 -translate-y-1/2 w-10 h-10 rounded-full flex items-center justify-center"
              style={{ background: 'rgba(15,23,42,0.7)', color: 'white' }}
              aria-label="Previous image"
            >
              <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
              </svg>
            </button>
            <button
              onClick={goNextImage}
              className="absolute right-3 top-1/2 -translate-y-1/2 w-10 h-10 rounded-full flex items-center justify-center"
              style={{ background: 'rgba(15,23,42,0.7)', color: 'white' }}
              aria-label="Next image"
            >
              <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
              </svg>
            </button>
            <button
              onClick={() => setLightboxOpen(false)}
              className="absolute top-3 right-3 w-9 h-9 rounded-full flex items-center justify-center"
              style={{ background: 'rgba(15,23,42,0.7)', color: 'white' }}
              aria-label="Close viewer"
            >
              <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
