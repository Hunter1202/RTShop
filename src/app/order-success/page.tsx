'use client';

import { useSearchParams } from 'next/navigation';
import Link from 'next/link';
import { useTranslation } from 'react-i18next';
import Navbar from '@/components/layout/Navbar';
import Footer from '@/components/layout/Footer';
import { formatVND } from '@/lib/api';
import i18n from '@/i18n/config';

export default function OrderSuccessPage() {
  const { t } = useTranslation('common');
  const lang = i18n.language || 'vi';
  const params = useSearchParams();

  const orderNumber = params.get('order') || '';
  const total = parseInt(params.get('total') || '0');
  const method = params.get('method') || 'cod';

  return (
    <div style={{ background: 'var(--bg)' }}>
      <Navbar />

      <div className="max-w-2xl mx-auto px-4 pt-28 pb-20 text-center">
        {/* Success animation */}
        <div className="w-24 h-24 rounded-full flex items-center justify-center mx-auto mb-8 animate-scale-in"
             style={{ background: 'linear-gradient(135deg, rgba(29,78,216,0.12), rgba(249,115,22,0.1))', border: '2px solid var(--accent)' }}>
          <svg className="w-12 h-12" style={{ color: 'var(--accent)' }} fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
          </svg>
        </div>

        <h1 className="text-4xl font-black mb-3" style={{ fontFamily: 'Playfair Display, serif', color: 'var(--text)' }}>
          {t('order.success_title')}
        </h1>
        <p className="text-lg mb-8" style={{ color: 'var(--text-secondary)' }}>
          {t('order.success_desc')}
        </p>

        {/* Order details card */}
        <div className="card p-8 mb-8 text-left">
          <div className="flex items-center justify-between mb-6 pb-6 border-b" style={{ borderColor: 'var(--border)' }}>
            <div>
              <p className="text-sm font-medium mb-1" style={{ color: 'var(--text-secondary)' }}>
                {t('order.order_number')}
              </p>
              <p className="text-2xl font-black" style={{ color: 'var(--accent)' }}>{orderNumber}</p>
            </div>
            <div className="text-right">
              <p className="text-sm font-medium mb-1" style={{ color: 'var(--text-secondary)' }}>
                {t('cart.total')}
              </p>
              <p className="text-2xl font-black" style={{ color: 'var(--text)' }}>{formatVND(total)}</p>
            </div>
          </div>

          {/* Payment info */}
          {method === 'banking' ? (
            <div className="p-5 rounded-2xl text-center" style={{ background: 'rgba(249,115,22,0.05)', border: '1px dashed rgba(249,115,22,0.3)' }}>
              <p className="font-bold mb-3" style={{ color: 'var(--text)' }}>🏦 {t('order.banking_info')}</p>
              <div className="w-40 h-40 mx-auto rounded-xl mb-4 flex items-center justify-center"
                   style={{ background: 'var(--bg-secondary)' }}>
                {/* In real app, generate QR code here */}
                <div className="text-center">
                  <span className="text-5xl">📱</span>
                  <p className="text-xs mt-2" style={{ color: 'var(--text-secondary)' }}>QR Code</p>
                </div>
              </div>
              <div className="text-sm space-y-1" style={{ color: 'var(--text)' }}>
                <p><strong>VietcomBank</strong> · 1234567890</p>
                <p>RTSHOP CO LTD</p>
                <p className="font-bold" style={{ color: 'var(--accent)' }}>
                  {lang === 'vi' ? 'Nội dung' : 'Reference'}: {orderNumber}
                </p>
              </div>
            </div>
          ) : (
            <div className="p-5 rounded-2xl text-center" style={{ background: 'rgba(34,197,94,0.05)', border: '1px dashed rgba(34,197,94,0.3)' }}>
              <span className="text-4xl">💵</span>
              <p className="font-semibold mt-2" style={{ color: 'var(--text)' }}>
                {lang === 'vi' ? 'Thanh toán khi nhận hàng' : 'Pay cash on delivery'}
              </p>
              <p className="text-sm mt-1" style={{ color: 'var(--text-secondary)' }}>
                {lang === 'vi' ? 'Chuẩn bị đúng số tiền khi nhận hàng' : 'Please prepare exact amount upon delivery'}
              </p>
            </div>
          )}
        </div>

        <div className="flex flex-col sm:flex-row gap-3 justify-center">
          <Link href="/track-order" className="btn-primary px-8">
            {t('nav.track_order')}
          </Link>
          <Link href="/products" className="btn-secondary px-8">
            {t('cart.continue_shopping')}
          </Link>
        </div>
      </div>

      <Footer />
    </div>
  );
}

