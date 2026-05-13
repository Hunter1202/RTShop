'use client';

import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import Navbar from '@/components/layout/Navbar';
import Footer from '@/components/layout/Footer';
import { orderApi, formatVND } from '@/lib/api';
import i18n from '@/i18n/config';

const STATUS_STEPS = ['pending', 'confirmed', 'shipped', 'delivered'];

const statusInfo = (t: any) => ({
  pending:   { label: t('order.status_pending'),   icon: '⏳', color: '#f59e0b' },
  confirmed: { label: t('order.status_confirmed'), icon: '✅', color: '#3b82f6' },
  shipped:   { label: t('order.status_shipped'),   icon: '🚚', color: '#8b5cf6' },
  delivered: { label: t('order.status_delivered'), icon: '🎉', color: '#22c55e' },
  cancelled: { label: t('order.status_cancelled'), icon: '❌', color: '#ef4444' },
});

export default function TrackOrderPage() {
  const { t } = useTranslation('common');
  const lang = i18n.language || 'vi';

  const [query, setQuery] = useState('');
  const [orders, setOrders] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [searched, setSearched] = useState(false);

  const handleSearch = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!query.trim()) return;
    setLoading(true);
    setSearched(true);

    try {
      const isEmail = /\S+@\S+\.\S+/.test(query);
      const isOrderNum = query.startsWith('RT-');
      const params = isOrderNum
        ? { order_number: query }
        : isEmail
        ? { email: query }
        : { phone: query };

      const res = await orderApi.track(params);
      setOrders(res.data.data || []);
    } catch {
      setOrders([]);
    } finally {
      setLoading(false);
    }
  };

  const statuses = statusInfo(t);

  return (
    <div style={{ background: 'var(--bg)' }}>
      <Navbar />

      <div className="max-w-3xl mx-auto px-4 pt-28 pb-20">
        <div className="text-center mb-10">
          <h1 className="section-title">{t('order.track_title')}</h1>
          <p className="section-subtitle">{t('order.track_desc')}</p>
        </div>

        {/* Search form */}
        <form onSubmit={handleSearch} className="card p-6 mb-8">
          <div className="flex gap-3">
            <input
              type="text"
              value={query}
              onChange={e => setQuery(e.target.value)}
              placeholder={lang === 'vi'
                ? 'Nhập email, số điện thoại, hoặc mã đơn hàng...'
                : 'Enter email, phone, or order number...'}
              className="input-field flex-1"
            />
            <button type="submit" className="btn-primary px-6" disabled={loading}>
              {loading ? '...' : t('common.search')}
            </button>
          </div>
        </form>

        {/* Results */}
        {searched && (
          orders.length === 0 ? (
            <div className="text-center py-12">
              <div className="text-5xl mb-4">📦</div>
              <p className="text-lg font-semibold" style={{ color: 'var(--text)' }}>{t('order.no_orders')}</p>
            </div>
          ) : (
            <div className="space-y-6">
              {orders.map((order) => {
                const status = statuses[order.order_status as keyof typeof statuses] || statuses.pending;
                const stepIndex = STATUS_STEPS.indexOf(order.order_status);

                return (
                  <div key={order.id} className="card overflow-hidden">
                    {/* Order header */}
                    <div className="p-5 border-b" style={{ borderColor: 'var(--border)' }}>
                      <div className="flex flex-wrap items-center justify-between gap-3">
                        <div>
                          <p className="text-sm font-medium mb-0.5" style={{ color: 'var(--text-secondary)' }}>
                            {t('order.order_number')}
                          </p>
                          <p className="text-xl font-black" style={{ color: 'var(--accent)' }}>
                            {order.order_number}
                          </p>
                        </div>
                        <div className="text-right">
                          <span
                            className="px-3 py-1.5 rounded-full text-sm font-bold"
                            style={{ background: status.color + '20', color: status.color }}
                          >
                            {status.icon} {status.label}
                          </span>
                          <p className="text-xs mt-1" style={{ color: 'var(--text-secondary)' }}>
                            {new Date(order.created_at).toLocaleDateString(lang === 'vi' ? 'vi-VN' : 'en-US')}
                          </p>
                        </div>
                      </div>
                    </div>

                    {/* Progress bar (only for non-cancelled) */}
                    {order.order_status !== 'cancelled' && (
                      <div className="px-5 py-4 border-b" style={{ borderColor: 'var(--border)' }}>
                        <div className="flex items-center">
                          {STATUS_STEPS.map((step, i) => {
                            const stepStatus = statuses[step as keyof typeof statuses];
                            const isCompleted = i <= stepIndex;
                            const isLast = i === STATUS_STEPS.length - 1;

                            return (
                              <div key={step} className="flex items-center flex-1 last:flex-none">
                                <div className="flex flex-col items-center">
                                  <div
                                    className="w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold transition-all"
                                    style={{
                                      background: isCompleted ? 'var(--accent)' : 'var(--border)',
                                      color: isCompleted ? 'white' : 'var(--text-secondary)',
                                    }}
                                  >
                                    {isCompleted ? '✓' : i + 1}
                                  </div>
                                  <p className="text-xs mt-1 text-center w-16" style={{ color: isCompleted ? 'var(--accent)' : 'var(--text-secondary)' }}>
                                    {stepStatus.label}
                                  </p>
                                </div>
                                {!isLast && (
                                  <div className="flex-1 h-0.5 mx-1 mb-4"
                                       style={{ background: i < stepIndex ? 'var(--accent)' : 'var(--border)' }} />
                                )}
                              </div>
                            );
                          })}
                        </div>
                      </div>
                    )}

                    {/* Order Items */}
                    {order.items && order.items.length > 0 && (
                      <div className="p-5 space-y-3">
                        {(typeof order.items === 'string' ? JSON.parse(order.items) : order.items).map((item: any, i: number) => (
                          <div key={i} className="flex gap-3 items-center">
                            <div className="w-12 h-12 rounded-xl overflow-hidden shrink-0" style={{ background: 'var(--bg-secondary)' }}>
                              {item.product_image && (
                                <img src={item.product_image} alt="" className="w-full h-full object-cover" />
                              )}
                            </div>
                            <div className="flex-1">
                              <p className="text-sm font-medium" style={{ color: 'var(--text)' }}>
                                {lang === 'vi' ? item.product_name_vi : item.product_name_en}
                              </p>
                              <p className="text-xs" style={{ color: 'var(--text-secondary)' }}>
                                {item.quantity} × {formatVND(item.unit_price)}
                              </p>
                            </div>
                            <p className="text-sm font-bold" style={{ color: 'var(--text)' }}>
                              {formatVND(item.total_price)}
                            </p>
                          </div>
                        ))}
                      </div>
                    )}

                    {/* Footer */}
                    <div className="px-5 py-4 flex justify-between items-center"
                         style={{ background: 'var(--bg-secondary)', borderTop: '1px solid var(--border)' }}>
                      <span className="text-sm" style={{ color: 'var(--text-secondary)' }}>
                        {order.payment_method === 'cod' ? t('order.payment_cod') : t('order.payment_banking')}
                      </span>
                      <span className="font-black text-lg" style={{ color: 'var(--accent)' }}>
                        {formatVND(order.total_amount)}
                      </span>
                    </div>
                  </div>
                );
              })}
            </div>
          )
        )}
      </div>

      <Footer />
    </div>
  );
}
