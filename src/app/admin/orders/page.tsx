'use client';

import { useState, useEffect, useCallback } from 'react';
import { orderApi, formatVND } from '@/lib/api';
import toast from 'react-hot-toast';

const STATUS_OPTIONS = ['all', 'pending', 'confirmed', 'shipped', 'delivered', 'cancelled'];

const STATUS_STYLES: Record<string, { bg: string; text: string; label: string }> = {
  pending:   { bg: '#fef3c7', text: '#92400e', label: '⏳ Pending' },
  confirmed: { bg: '#dbeafe', text: '#1e40af', label: '✅ Confirmed' },
  shipped:   { bg: '#ede9fe', text: '#5b21b6', label: '🚚 Shipped' },
  delivered: { bg: '#dcfce7', text: '#14532d', label: '🎉 Delivered' },
  cancelled: { bg: '#fee2e2', text: '#991b1b', label: '❌ Cancelled' },
};

export default function AdminOrdersPage() {
  const [orders, setOrders] = useState<any[]>([]);
  const [pagination, setPagination] = useState({ total: 0, pages: 1, page: 1 });
  const [loading, setLoading] = useState(true);
  const [status, setStatus] = useState('all');
  const [search, setSearch] = useState('');
  const [page, setPage] = useState(1);
  const [selected, setSelected] = useState<any>(null);
  const [updatingId, setUpdatingId] = useState<number | null>(null);

  const load = useCallback(async () => {
    setLoading(true);
    try {
      const res = await orderApi.adminGetAll({
        page, limit: 20,
        status: status !== 'all' ? status : undefined,
        search: search || undefined,
      });
      setOrders(res.data.data || []);
      setPagination(res.data.pagination);
    } catch { toast.error('Failed to load orders'); }
    finally { setLoading(false); }
  }, [page, status, search]);

  useEffect(() => { load(); }, [load]);

  const handleStatusChange = async (orderId: number, newStatus: string) => {
    setUpdatingId(orderId);
    try {
      await orderApi.updateStatus(orderId, { order_status: newStatus });
      toast.success('Status updated');
      load();
      if (selected?.id === orderId) {
        setSelected({ ...selected, order_status: newStatus });
      }
    } catch { toast.error('Update failed'); }
    finally { setUpdatingId(null); }
  };

  const openDetail = async (order: any) => {
    try {
      const res = await orderApi.adminGetOne(order.id);
      setSelected(res.data.data);
    } catch { setSelected(order); }
  };

  return (
    <div className="p-8">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-2xl font-black" style={{ color: 'var(--text)', fontFamily: 'Playfair Display, serif' }}>
            Orders
          </h1>
          <p className="text-sm mt-1" style={{ color: 'var(--text-secondary)' }}>
            {pagination.total} total orders
          </p>
        </div>
      </div>

      {/* Filters */}
      <div className="card p-4 mb-6 flex flex-wrap gap-3 items-center">
        <input
          type="text"
          value={search}
          onChange={e => { setSearch(e.target.value); setPage(1); }}
          placeholder="Search order, email, phone..."
          className="input-field flex-1 min-w-48"
        />
        <div className="flex gap-1.5 flex-wrap">
          {STATUS_OPTIONS.map(s => (
            <button
              key={s}
              onClick={() => { setStatus(s); setPage(1); }}
              className="px-3 py-2 rounded-xl text-xs font-semibold capitalize transition-all"
              style={status === s
                ? { background: 'var(--accent)', color: 'white' }
                : { background: 'var(--bg-secondary)', color: 'var(--text-secondary)', border: '1px solid var(--border)' }}
            >
              {s}
            </button>
          ))}
        </div>
      </div>

      <div className="flex gap-6">
        {/* Order list */}
        <div className="flex-1">
          <div className="card overflow-hidden">
            <table className="w-full">
              <thead>
                <tr style={{ borderBottom: '1px solid var(--border)', background: 'var(--bg-secondary)' }}>
                  {['Order #', 'Customer', 'Amount', 'Payment', 'Status', 'Date', 'Actions'].map(h => (
                    <th key={h} className="text-left px-4 py-3.5 text-xs font-semibold uppercase tracking-wider"
                        style={{ color: 'var(--text-secondary)' }}>{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {loading ? (
                  Array.from({ length: 8 }).map((_, i) => (
                    <tr key={i} style={{ borderBottom: '1px solid var(--border)' }}>
                      {Array.from({ length: 7 }).map((_, j) => (
                        <td key={j} className="px-4 py-4"><div className="skeleton h-4 w-full rounded" /></td>
                      ))}
                    </tr>
                  ))
                ) : orders.length === 0 ? (
                  <tr>
                    <td colSpan={7} className="px-4 py-12 text-center" style={{ color: 'var(--text-secondary)' }}>
                      No orders found
                    </td>
                  </tr>
                ) : orders.map(order => {
                  const s = STATUS_STYLES[order.order_status] || STATUS_STYLES.pending;
                  return (
                    <tr key={order.id}
                        className="transition-colors hover:bg-primary-50/30 dark:hover:bg-dark-700/30 cursor-pointer"
                        style={{ borderBottom: '1px solid var(--border)' }}
                        onClick={() => openDetail(order)}>
                      <td className="px-4 py-4">
                        <span className="text-sm font-mono font-bold" style={{ color: 'var(--accent)' }}>
                          {order.order_number}
                        </span>
                      </td>
                      <td className="px-4 py-4">
                        <p className="text-sm font-medium" style={{ color: 'var(--text)' }}>{order.customer_name}</p>
                        <p className="text-xs" style={{ color: 'var(--text-secondary)' }}>{order.customer_phone}</p>
                      </td>
                      <td className="px-4 py-4">
                        <span className="text-sm font-bold" style={{ color: 'var(--text)' }}>
                          {formatVND(order.total_amount)}
                        </span>
                      </td>
                      <td className="px-4 py-4">
                        <span className="text-xs font-medium uppercase px-2 py-1 rounded"
                              style={{ background: 'var(--bg-secondary)', color: 'var(--text-secondary)' }}>
                          {order.payment_method}
                        </span>
                      </td>
                      <td className="px-4 py-4">
                        <span className="px-2.5 py-1 rounded-full text-xs font-semibold"
                              style={{ background: s.bg, color: s.text }}>
                          {s.label}
                        </span>
                      </td>
                      <td className="px-4 py-4">
                        <span className="text-xs" style={{ color: 'var(--text-secondary)' }}>
                          {new Date(order.created_at).toLocaleDateString()}
                        </span>
                      </td>
                      <td className="px-4 py-4" onClick={e => e.stopPropagation()}>
                        <select
                          value={order.order_status}
                          onChange={e => handleStatusChange(order.id, e.target.value)}
                          disabled={updatingId === order.id}
                          className="text-xs rounded-lg px-2 py-1.5 outline-none border disabled:opacity-50"
                          style={{ background: 'var(--bg-secondary)', color: 'var(--text)', borderColor: 'var(--border)' }}
                        >
                          {['pending', 'confirmed', 'shipped', 'delivered', 'cancelled'].map(s => (
                            <option key={s} value={s}>{s}</option>
                          ))}
                        </select>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>

            {pagination.pages > 1 && (
              <div className="flex items-center justify-between px-4 py-4 border-t" style={{ borderColor: 'var(--border)' }}>
                <p className="text-sm" style={{ color: 'var(--text-secondary)' }}>Page {page} of {pagination.pages}</p>
                <div className="flex gap-2">
                  <button onClick={() => setPage(p => Math.max(1, p - 1))} disabled={page <= 1}
                          className="px-3 py-1.5 rounded-lg text-sm disabled:opacity-40"
                          style={{ background: 'var(--bg-secondary)', color: 'var(--text)', border: '1px solid var(--border)' }}>
                    ← Prev
                  </button>
                  <button onClick={() => setPage(p => Math.min(pagination.pages, p + 1))} disabled={page >= pagination.pages}
                          className="px-3 py-1.5 rounded-lg text-sm disabled:opacity-40"
                          style={{ background: 'var(--bg-secondary)', color: 'var(--text)', border: '1px solid var(--border)' }}>
                    Next →
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Order detail panel */}
        {selected && (
          <div className="w-80 shrink-0">
            <div className="card p-5 sticky top-8">
              <div className="flex items-center justify-between mb-4">
                <h3 className="font-bold" style={{ color: 'var(--text)' }}>Order Detail</h3>
                <button onClick={() => setSelected(null)} className="p-1 rounded-lg hover:bg-gray-100 dark:hover:bg-dark-700">✕</button>
              </div>

              <div className="space-y-3 text-sm">
                <div>
                  <p className="font-bold text-base" style={{ color: 'var(--accent)' }}>{selected.order_number}</p>
                  <span className="px-2 py-0.5 rounded-full text-xs font-semibold"
                        style={{ background: (STATUS_STYLES[selected.order_status]?.bg || '#f3f4f6'), color: (STATUS_STYLES[selected.order_status]?.text || '#6b7280') }}>
                    {STATUS_STYLES[selected.order_status]?.label || selected.order_status}
                  </span>
                </div>

                <div className="border-t pt-3 space-y-2" style={{ borderColor: 'var(--border)' }}>
                  <p style={{ color: 'var(--text)' }}><strong>👤</strong> {selected.customer_name}</p>
                  <p style={{ color: 'var(--text-secondary)' }}>📧 {selected.customer_email}</p>
                  <p style={{ color: 'var(--text-secondary)' }}>📞 {selected.customer_phone}</p>
                  <p style={{ color: 'var(--text-secondary)' }}>📍 {selected.customer_address}</p>
                  {selected.notes && <p style={{ color: 'var(--text-secondary)' }}>📝 {selected.notes}</p>}
                </div>

                {selected.items?.length > 0 && (
                  <div className="border-t pt-3" style={{ borderColor: 'var(--border)' }}>
                    <p className="font-semibold mb-2" style={{ color: 'var(--text)' }}>Items:</p>
                    {selected.items.map((item: any, i: number) => (
                      <div key={i} className="flex justify-between text-xs mb-1">
                        <span style={{ color: 'var(--text-secondary)' }}>{item.product_name_en} × {item.quantity}</span>
                        <span style={{ color: 'var(--text)' }}>{formatVND(item.total_price)}</span>
                      </div>
                    ))}
                  </div>
                )}

                <div className="border-t pt-3" style={{ borderColor: 'var(--border)' }}>
                  <div className="flex justify-between">
                    <span style={{ color: 'var(--text-secondary)' }}>Subtotal</span>
                    <span style={{ color: 'var(--text)' }}>{formatVND(selected.subtotal)}</span>
                  </div>
                  <div className="flex justify-between">
                    <span style={{ color: 'var(--text-secondary)' }}>Shipping</span>
                    <span style={{ color: 'var(--text)' }}>{formatVND(selected.shipping_fee)}</span>
                  </div>
                  <div className="flex justify-between font-bold mt-1">
                    <span style={{ color: 'var(--text)' }}>Total</span>
                    <span style={{ color: 'var(--accent)' }}>{formatVND(selected.total_amount)}</span>
                  </div>
                </div>

                <div className="border-t pt-3" style={{ borderColor: 'var(--border)' }}>
                  <p className="text-xs font-medium mb-2" style={{ color: 'var(--text-secondary)' }}>Update Status:</p>
                  <select
                    value={selected.order_status}
                    onChange={e => handleStatusChange(selected.id, e.target.value)}
                    className="w-full text-sm rounded-xl px-3 py-2.5 outline-none border"
                    style={{ background: 'var(--bg-secondary)', color: 'var(--text)', borderColor: 'var(--border)' }}
                  >
                    {['pending', 'confirmed', 'shipped', 'delivered', 'cancelled'].map(s => (
                      <option key={s} value={s}>{s}</option>
                    ))}
                  </select>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
