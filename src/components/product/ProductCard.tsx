'use client';

import Link from 'next/link';
import Image from 'next/image';
import { useTranslation } from 'react-i18next';
import { useCartStore } from '@/store';
import { formatVND, getProductName } from '@/lib/api';
import i18n from '@/i18n/config';
import toast from 'react-hot-toast';

interface ProductCardProps {
  product: {
    id: number;
    name_vi: string;
    name_en: string;
    slug: string;
    price: number;
    original_price?: number;
    images: string[];
    stock_quantity: number;
    is_featured?: boolean;
    category?: { name_vi: string; name_en: string; slug: string };
  };
}

export default function ProductCard({ product }: ProductCardProps) {
  const { t } = useTranslation('common');
  const { addItem, openCart } = useCartStore();
  const lang = i18n.language || 'vi';

  const name = getProductName(product, lang);
  const image = product.images?.[0];
  const isOutOfStock = product.stock_quantity === 0;
  const discount = product.original_price
    ? Math.round((1 - product.price / product.original_price) * 100)
    : 0;

  const handleAddToCart = (e: React.MouseEvent) => {
    e.preventDefault();
    if (isOutOfStock) return;
    addItem(product);
    openCart();
    toast.success(lang === 'vi' ? 'Đã thêm vào giỏ!' : 'Added to cart!');
  };

  return (
    <Link href={`/products/${product.slug}`} className="group">
      <div className="card card-hover overflow-hidden cursor-pointer">
        {/* Image */}
        <div className="relative aspect-square overflow-hidden" style={{ background: 'var(--bg-secondary)' }}>
          {image ? (
            <img
              src={image}
              alt={name}
              className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
            />
          ) : (
            <div className="w-full h-full flex items-center justify-center">
              <svg className="w-16 h-16" style={{ color: 'var(--border)' }} fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
              </svg>
            </div>
          )}

          {/* Badges */}
          <div className="absolute top-3 left-3 flex flex-col gap-1.5">
            {product.is_featured && (
              <span className="px-2.5 py-1 rounded-full text-xs font-bold text-white"
                    style={{ background: 'var(--accent)' }}>
                ★ {t('products.featured')}
              </span>
            )}
            {discount > 0 && (
              <span className="px-2.5 py-1 rounded-full text-xs font-bold text-white bg-green-500">
                -{discount}%
              </span>
            )}
            {isOutOfStock && (
              <span className="px-2.5 py-1 rounded-full text-xs font-bold text-white bg-gray-500">
                {t('products.out_of_stock')}
              </span>
            )}
          </div>

          {/* Quick Add Button */}
          <div className="absolute bottom-3 left-3 right-3 translate-y-2 opacity-0 group-hover:translate-y-0 group-hover:opacity-100 transition-all duration-200">
            <button
              onClick={handleAddToCart}
              disabled={isOutOfStock}
              className="w-full py-2.5 rounded-xl text-sm font-semibold text-white transition-all disabled:opacity-50 disabled:cursor-not-allowed"
              style={{ background: 'var(--accent)' }}
            >
              {isOutOfStock ? t('products.out_of_stock') : t('products.add_to_cart')}
            </button>
          </div>
        </div>

        {/* Info */}
        <div className="p-4">
          {product.category && (
            <p className="text-xs font-medium mb-1.5" style={{ color: 'var(--accent)' }}>
              {lang === 'vi' ? product.category.name_vi : product.category.name_en}
            </p>
          )}
          <h3 className="font-semibold text-sm leading-snug mb-2 line-clamp-2" style={{ color: 'var(--text)' }}>
            {name}
          </h3>
          <div className="flex items-baseline gap-2">
            <span className="text-lg font-bold" style={{ color: 'var(--accent)' }}>
              {formatVND(product.price)}
            </span>
            {product.original_price && (
              <span className="text-xs line-through" style={{ color: 'var(--text-secondary)' }}>
                {formatVND(product.original_price)}
              </span>
            )}
          </div>
        </div>
      </div>
    </Link>
  );
}