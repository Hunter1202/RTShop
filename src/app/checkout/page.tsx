'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { useTranslation } from 'react-i18next';
import Navbar from '@/components/layout/Navbar';
import Footer from '@/components/layout/Footer';
import { useCartStore } from '@/store';
import { orderApi, formatVND, getProductName } from '@/lib/api';
import i18n from '@/i18n/config';
import toast from 'react-hot-toast';

export default function CheckoutPage() {
  const { t } = useTranslation('common');
  const lang = i18n.language || 'vi';
  const router = useRouter();
  const { items, getSubtotal, getShipping, getTotal, clearCart } = useCartStore();

  const [form, setForm] = useState({
    customer_name: '',
    customer_email: '',
    customer_phone: '',
    customer_address: '',
    notes: '',
    payment_method: 'cod' as 'cod' | 'banking',
  });
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [submitting, setSubmitting] = useState(false);

  const subtotal = getSubtotal();
  const shipping = getShipping();
  const total = getTotal();

  const validate = () => {
    const newErrors: Record<string, string> = {};
    if (!form.customer_name.trim() || form.customer_name.length < 2)
      newErrors.customer_name = lang === 'vi' ? 'Nhập họ tên (ít nhất 2 ký tự)' : 'Name required (min 2 chars)';
    if (!form.customer_email.trim() || !/\S+@\S+\.\S+/.test(form.customer_email))
      newErrors.customer_email = lang === 'vi' ? 'Email không hợp lệ' : 'Invalid email';
    if (!form.customer_phone.trim() || form.customer_phone.replace(/\D/g, '').length < 8)
      newErrors.customer_phone = lang === 'vi' ? 'Số điện thoại không hợp lệ' : 'Invalid phone number';
    if (!form.customer_address.trim() || form.customer_address.length < 10)
      newErrors.customer_address = lang === 'vi' ? 'Địa chỉ ít nhất 10 ký tự' : 'Address min 10 chars';
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validate()) return;
    if (items.length === 0) {
      toast.error(lang === 'vi' ? 'Giỏ hàng trống' : 'Cart is empty');
      return;
    }

    setSubmitting(true);
    try {
      const res = await orderApi.create({
        ...form,
        items: items.map(i => ({ product_id: i.id, quantity: i.quantity })),
      });

      const { order_number, total_amount } = res.data.data;
      clearCart();

      router.push(`/order-success?order=${order_number}&total=${total_amount}&method=${form.payment_method}`);
    } catch (err: any) {
      const msg = err.response?.data?.message;
      toast.error(msg || (lang === 'vi' ? 'Đặt hàng thất bại' : 'Order failed'));
    } finally {
      setSubmitting(false);
    }
  };

  if (items.length === 0) {
    return (
      <div style={{ background: 'var(--bg)' }}>
        <Navbar />
        <div className="max-w-md mx-auto px-4 pt-32 pb-20 text-center">
          <div className="text-6xl mb-4">🛒</div>
          <h2 className="text-2xl font-bold mb-2" style={{ color: 'var(--text)' }}>{t('cart.empty')}</h2>
          <p className="mb-6" style={{ color: 'var(--text-secondary)' }}>{t('cart.empty_desc')}</p>
          <Link href="/products" className="btn-primary">{t('cart.continue_shopping')}</Link>
        </div>
        <Footer />
      </div>
    );
  }

  return (
    <div style={{ background: 'var(--bg)' }}>
      <Navbar />

      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 pt-28 pb-20">
        <h1 className="section-title mb-10">{t('checkout.title')}</h1>

        <div className="grid lg:grid-cols-5 gap-10">
          {/* Form */}
          <form onSubmit={handleSubmit} className="lg:col-span-3 space-y-8">
            {/* Customer Info */}
            <div className="card p-6">
              <h2 className="text-lg font-bold mb-6" style={{ color: 'var(--text)' }}>
                {t('checkout.customer_info')}
              </h2>
              <div className="grid sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium mb-1.5" style={{ color: 'var(--text)' }}>
                    {t('checkout.full_name')} *
                  </label>
                  <input
                    type="text"
                    value={form.customer_name}
                    onChange={e => setForm({ ...form, customer_name: e.target.value })}
                    className="input-field"
                    placeholder="Nguyễn Văn A"
                  />
                  {errors.customer_name && <p className="text-red-500 text-xs mt-1">{errors.customer_name}</p>}
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1.5" style={{ color: 'var(--text)' }}>
                    {t('checkout.phone')} *
                  </label>
                  <input
                    type="tel"
                    value={form.customer_phone}
                    onChange={e => setForm({ ...form, customer_phone: e.target.value })}
                    className="input-field"
                    placeholder="0901 234 567"
                  />
                  {errors.customer_phone && <p className="text-red-500 text-xs mt-1">{errors.customer_phone}</p>}
                </div>
                <div className="sm:col-span-2">
                  <label className="block text-sm font-medium mb-1.5" style={{ color: 'var(--text)' }}>
                    {t('checkout.email')} *
                  </label>
                  <input
                    type="email"
                    value={form.customer_email}
                    onChange={e => setForm({ ...form, customer_email: e.target.value })}
                    className="input-field"
                    placeholder="example@email.com"
                  />
                  {errors.customer_email && <p className="text-red-500 text-xs mt-1">{errors.customer_email}</p>}
                </div>
                <div className="sm:col-span-2">
                  <label className="block text-sm font-medium mb-1.5" style={{ color: 'var(--text)' }}>
                    {t('checkout.address')} *
                  </label>
                  <textarea
                    value={form.customer_address}
                    onChange={e => setForm({ ...form, customer_address: e.target.value })}
                    className="input-field resize-none"
                    rows={3}
                    placeholder={lang === 'vi' ? '123 Đường ABC, Phường XYZ, Quận 1, TP.HCM' : '123 Street, District, City'}
                  />
                  {errors.customer_address && <p className="text-red-500 text-xs mt-1">{errors.customer_address}</p>}
                </div>
                <div className="sm:col-span-2">
                  <label className="block text-sm font-medium mb-1.5" style={{ color: 'var(--text)' }}>
                    {t('checkout.notes')}
                  </label>
                  <textarea
                    value={form.notes}
                    onChange={e => setForm({ ...form, notes: e.target.value })}
                    className="input-field resize-none"
                    rows={2}
                    placeholder={lang === 'vi' ? 'Giao giờ hành chính, gọi trước 30p...' : 'Delivery instructions...'}
                  />
                </div>
              </div>
            </div>

            {/* Payment Method */}
            <div className="card p-6">
              <h2 className="text-lg font-bold mb-6" style={{ color: 'var(--text)' }}>
                {t('checkout.payment_method')}
              </h2>
              <div className="grid sm:grid-cols-2 gap-4">
                {[
                  {
                    value: 'cod',
                    icon: '💵',
                    title: t('checkout.cod'),
                    desc: lang === 'vi' ? 'Trả tiền mặt khi nhận hàng' : 'Pay cash upon delivery',
                  },
                  {
                    value: 'banking',
                    icon: '🏦',
                    title: t('checkout.banking'),
                    desc: lang === 'vi' ? 'Chuyển khoản qua QR code' : 'Transfer via QR code',
                  },
                ].map((method) => (
                  <button
                    key={method.value}
                    type="button"
                    onClick={() => setForm({ ...form, payment_method: method.value as 'cod' | 'banking' })}
                    className={`p-5 rounded-2xl border-2 text-left transition-all ${
                      form.payment_method === method.value ? 'border-accent shadow-glow-sm' : ''
                    }`}
                    style={{
                      borderColor: form.payment_method === method.value ? 'var(--accent)' : 'var(--border)',
                      background: form.payment_method === method.value ? 'rgba(29,78,216,0.08)' : 'var(--bg-secondary)',
                    }}
                  >
                    <div className="text-2xl mb-2">{method.icon}</div>
                    <p className="font-semibold text-sm" style={{ color: 'var(--text)' }}>{method.title}</p>
                    <p className="text-xs mt-0.5" style={{ color: 'var(--text-secondary)' }}>{method.desc}</p>
                  </button>
                ))}
              </div>

              {/* Banking QR Info */}
              {form.payment_method === 'banking' && (
                <div className="mt-5 p-5 rounded-2xl text-center animate-fade-in"
                     style={{ background: 'var(--bg-secondary)', border: '1px dashed var(--border)' }}>
                  <p className="text-sm font-semibold mb-3" style={{ color: 'var(--text)' }}>
                    {t('order.banking_info')}
                  </p>
                  {/* QR placeholder */}
                  <div className="w-32 h-32 mx-auto rounded-xl mb-3 flex items-center justify-center"
                       style={{ background: 'var(--border)' }}>
                    <span className="text-4xl">📱</span>
                  </div>
                  <p className="text-xs" style={{ color: 'var(--text-secondary)' }}>
                    {lang === 'vi'
                      ? 'QR code sẽ hiển thị sau khi đặt hàng'
                      : 'QR code will be shown after placing order'}
                  </p>
                  <div className="mt-3 text-left text-sm space-y-1" style={{ color: 'var(--text)' }}>
                    <p><strong>VietcomBank</strong></p>
                    <p>STK: 1234567890</p>
                    <p>{lang === 'vi' ? 'Chủ TK' : 'Account'}: RTSHOP CO LTD</p>
                  </div>
                </div>
              )}
            </div>

            <button
              type="submit"
              disabled={submitting}
              className="btn-primary w-full py-4 text-base"
            >
              {submitting ? t('checkout.processing') : t('checkout.place_order')}
            </button>
          </form>

          {/* Order Summary */}
          <div className="lg:col-span-2">
            <div className="card p-6 sticky top-28">
              <h2 className="text-lg font-bold mb-6" style={{ color: 'var(--text)' }}>
                {t('checkout.order_summary')}
              </h2>

              <div className="space-y-4 mb-6 max-h-80 overflow-y-auto pr-1">
                {items.map((item) => (
                  <div key={item.id} className="flex gap-3 items-center">
                    <div className="w-14 h-14 rounded-xl overflow-hidden shrink-0" style={{ background: 'var(--bg-secondary)' }}>
                      {item.images?.[0] && (
                        <img src={item.images[0]} alt={getProductName(item, lang)} className="w-full h-full object-cover" />
                      )}
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium truncate" style={{ color: 'var(--text)' }}>
                        {getProductName(item, lang)}
                      </p>
                      <p className="text-xs" style={{ color: 'var(--text-secondary)' }}>
                        {item.quantity} × {formatVND(item.price)}
                      </p>
                    </div>
                    <p className="text-sm font-semibold shrink-0" style={{ color: 'var(--text)' }}>
                      {formatVND(item.price * item.quantity)}
                    </p>
                  </div>
                ))}
              </div>

              <div className="space-y-3 border-t pt-4" style={{ borderColor: 'var(--border)' }}>
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
                <div className="flex justify-between font-bold text-lg pt-2 border-t" style={{ borderColor: 'var(--border)', color: 'var(--text)' }}>
                  <span>{t('cart.total')}</span>
                  <span style={{ color: 'var(--accent)' }}>{formatVND(total)}</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <Footer />
    </div>
  );
}
