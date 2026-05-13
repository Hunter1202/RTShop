'use client';

import Link from 'next/link';
import { useTranslation } from 'react-i18next';
import { useCartStore } from '@/store';
import { formatVND, getProductName } from '@/lib/api';
import i18n from '@/i18n/config';

export default function CartDrawer() {
  const { t } = useTranslation('common');
  const { items, isOpen, closeCart, removeItem, updateQuantity, getSubtotal, getShipping, getTotal } = useCartStore();
  const lang = i18n.language || 'vi';
  const subtotal = getSubtotal();
  const shipping = getShipping();
  const total = getTotal();

  return (
    <>
      {/* Overlay */}
      {isOpen && (
        <div
          className="fixed inset-0 z-50 cart-overlay"
          onClick={closeCart}
        />
      )}

      {/* Drawer */}
      <div
        className={`fixed right-0 top-0 h-full w-full max-w-md z-50 flex flex-col transition-transform duration-300 ease-out ${
          isOpen ? 'translate-x-0' : 'translate-x-full'
        }`}
        style={{ background: 'var(--bg-card)', borderLeft: '1px solid var(--border)' }}
      >
        {/* Header */}
        <div className="flex items-center justify-between p-5 border-b" style={{ borderColor: 'var(--border)' }}>
          <div className="flex items-center gap-3">
            <h2 className="text-xl font-bold" style={{ fontFamily: 'Playfair Display, serif', color: 'var(--text)' }}>
              {t('cart.title')}
            </h2>
            {items.length > 0 && (
              <span className="px-2.5 py-0.5 rounded-full text-xs font-bold text-white" style={{ background: 'var(--accent)' }}>
                {items.length}
              </span>
            )}
          </div>
          <button
            onClick={closeCart}
            className="p-2 rounded-xl transition-colors hover:bg-gray-100 dark:hover:bg-dark-700"
          >
            <svg className="w-5 h-5" style={{ color: 'var(--text-secondary)' }} fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        {/* Items */}
        <div className="flex-1 overflow-y-auto p-5">
          {items.length === 0 ? (
            <div className="flex flex-col items-center justify-center h-full gap-4 text-center">
              <div className="w-20 h-20 rounded-2xl flex items-center justify-center" style={{ background: 'var(--bg-secondary)' }}>
                <svg className="w-10 h-10" style={{ color: 'var(--text-secondary)' }} fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
                </svg>
              </div>
              <div>
                <p className="font-semibold mb-1" style={{ color: 'var(--text)' }}>{t('cart.empty')}</p>
                <p className="text-sm" style={{ color: 'var(--text-secondary)' }}>{t('cart.empty_desc')}</p>
              </div>
              <button onClick={closeCart} className="btn-primary text-sm">
                {t('cart.continue_shopping')}
              </button>
            </div>
          ) : (
            <div className="space-y-4">
              {items.map((item) => (
                <div key={item.id} className="flex gap-4 animate-fade-in">
                  {/* Product Image */}
                  <div className="w-20 h-20 rounded-xl overflow-hidden shrink-0" style={{ background: 'var(--bg-secondary)' }}>
                    {item.images?.[0] ? (
                      <img src={item.images[0]} alt={getProductName(item, lang)} className="w-full h-full object-cover" />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center">
                        <svg className="w-8 h-8" style={{ color: 'var(--border)' }} fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                        </svg>
                      </div>
                    )}
                  </div>

                  {/* Product Info */}
                  <div className="flex-1 min-w-0">
                    <h4 className="text-sm font-semibold truncate" style={{ color: 'var(--text)' }}>
                      {getProductName(item, lang)}
                    </h4>
                    <p className="text-sm font-bold mt-0.5" style={{ color: 'var(--accent)' }}>
                      {formatVND(item.price)}
                    </p>

                    {/* Quantity Controls */}
                    <div className="flex items-center gap-2 mt-2">
                      <button
                        onClick={() => updateQuantity(item.id, item.quantity - 1)}
                        className="w-7 h-7 rounded-lg border flex items-center justify-center text-sm transition-colors hover:border-accent"
                        style={{ borderColor: 'var(--border)', color: 'var(--text)' }}
                      >
                        −
                      </button>
                      <span className="text-sm font-semibold w-6 text-center" style={{ color: 'var(--text)' }}>
                        {item.quantity}
                      </span>
                      <button
                        onClick={() => updateQuantity(item.id, item.quantity + 1)}
                        disabled={item.quantity >= item.stock_quantity}
                        className="w-7 h-7 rounded-lg border flex items-center justify-center text-sm transition-colors hover:border-accent disabled:opacity-40"
                        style={{ borderColor: 'var(--border)', color: 'var(--text)' }}
                      >
                        +
                      </button>
                      <span className="text-xs ml-auto" style={{ color: 'var(--text-secondary)' }}>
                        {formatVND(item.price * item.quantity)}
                      </span>
                    </div>
                  </div>

                  {/* Remove */}
                  <button
                    onClick={() => removeItem(item.id)}
                    className="shrink-0 p-1.5 rounded-lg transition-colors hover:bg-red-50 dark:hover:bg-red-900/20"
                    aria-label={t('cart.remove')}
                  >
                    <svg className="w-4 h-4 text-red-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                    </svg>
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Footer - Totals + Checkout */}
        {items.length > 0 && (
          <div className="border-t p-5 space-y-4" style={{ borderColor: 'var(--border)' }}>
            {/* Free shipping progress */}
            {subtotal < 500000 && (
              <div>
                <div className="flex justify-between text-xs mb-1.5" style={{ color: 'var(--text-secondary)' }}>
                  <span>Thêm {formatVND(500000 - subtotal)} để được miễn phí vận chuyển</span>
                  <span>{Math.round((subtotal / 500000) * 100)}%</span>
                </div>
                <div className="w-full h-1.5 rounded-full" style={{ background: 'var(--border)' }}>
                  <div
                    className="h-full rounded-full transition-all duration-500"
                    style={{ width: `${Math.min((subtotal / 500000) * 100, 100)}%`, background: 'var(--accent)' }}
                  />
                </div>
              </div>
            )}

            {/* Totals */}
            <div className="space-y-2">
              <div className="flex justify-between text-sm" style={{ color: 'var(--text-secondary)' }}>
                <span>{t('cart.subtotal')}</span>
                <span>{formatVND(subtotal)}</span>
              </div>
              <div className="flex justify-between text-sm" style={{ color: 'var(--text-secondary)' }}>
                <span>{t('cart.shipping')}</span>
                <span style={{ color: shipping === 0 ? '#22c55e' : 'var(--text)' }}>
                  {shipping === 0 ? t('cart.shipping_free') : formatVND(shipping)}
                </span>
              </div>
              <div className="flex justify-between font-bold text-base pt-2 border-t" style={{ borderColor: 'var(--border)', color: 'var(--text)' }}>
                <span>{t('cart.total')}</span>
                <span style={{ color: 'var(--accent)' }}>{formatVND(total)}</span>
              </div>
            </div>

            <Link href="/checkout" onClick={closeCart} className="btn-primary w-full text-center block">
              {t('cart.checkout')}
            </Link>
          </div>
        )}
      </div>
    </>
  );
}
