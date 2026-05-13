'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { dashboardApi, formatVND } from '@/lib/api';

const STATUS_COLORS: Record<string, string> = {
  pending: '#f59e0b',
  confirmed: '#3b82f6',
  shipped: '#8b5cf6',
  delivered: '#22c55e',
  cancelled: '#ef4444',
};

export default function AdminDashboard() {
  const [stats, setStats] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    dashboardApi.getStats()
      .then(res => setStats(res.data.data))
      .catch(console.error)
      .finally(() => setLoading(false));
  }, []);

  const statCards = stats ? [
    { label: 'Total Revenue', value: formatVND(stats.revenue), icon: '💰', color: '#1d4ed8', sub: 'All time' },
    { label: 'Total Orders', value: stats.total_orders, icon: '📦', color: '#3b82f6', sub: 'All time' },
    { label: "Today's Orders", value: stats.today_orders, icon: '🌅', color: '#0f172a', sub: 'Last 24h' },
    { label: 'Pending', value: stats.pending_orders, icon: '⏳', color: '#f59e0b', sub: 'Needs attention' },
    { label: 'Products', value: stats.total_products, icon: '🛍️', color: '#8b5cf6', sub: 'Active' },
    { label: 'Out of Stock', value: stats.out_of_stock, icon: '⚠️', color: '#ef4444', sub: 'Needs restocking' },
  ] : [];

  // Simple bar chart using CSS
  const maxRevenue = stats?.revenue_chart
    ? Math.max(...stats.revenue_chart.map((d: any) => d.revenue || 0), 1)
    : 1;

  return (
    <div className="p-8">
      {/* Header */}
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-2xl font-black" style={{ color: 'var(--text)', fontFamily: 'Playfair Display, serif' }}>
            Dashboard
          </h1>
          <p className="text-sm mt-1" style={{ color: 'var(--text-secondary)' }}>
            {new Date().toLocaleDateString('en-US', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}
          </p>
        </div>
        <Link href="/admin/products/new" className="btn-primary text-sm">
          + Add Product
        </Link>
      </div>

      {/* Stat Cards */}
      {loading ? (
        <div className="grid grid-cols-2 lg:grid-cols-3 gap-5 mb-8">
          {Array.from({ length: 6 }).map((_, i) => (
            <div key={i} className="card p-6">
              <div className="skeleton h-5 w-1/3 rounded mb-3" />
              <div className="skeleton h-8 w-1/2 rounded" />
            </div>
          ))}
        </div>
      ) : (
        <div className="grid grid-cols-2 lg:grid-cols-3 gap-5 mb-8">
          {statCards.map((card) => (
            <div key={card.label} className="card p-6">
              <div className="flex items-start justify-between mb-3">
                <span className="text-2xl">{card.icon}</span>
                <span className="text-xs font-medium px-2 py-1 rounded-full"
                      style={{ background: card.color + '15', color: card.color }}>
                  {card.sub}
                </span>
              </div>
              <p className="text-2xl font-black mb-1" style={{ color: 'var(--text)' }}>{card.value}</p>
              <p className="text-sm" style={{ color: 'var(--text-secondary)' }}>{card.label}</p>
            </div>
          ))}
        </div>
      )}

      <div className="grid lg:grid-cols-2 gap-6">
        {/* Revenue Chart */}
        <div className="card p-6">
          <h2 className="text-lg font-bold mb-6" style={{ color: 'var(--text)' }}>Revenue (Last 7 Days)</h2>
          {loading ? (
            <div className="space-y-3">
              {Array.from({ length: 7 }).map((_, i) => (
                <div key={i} className="flex items-center gap-3">
                  <div className="skeleton h-4 w-16 rounded" />
                  <div className="skeleton h-8 rounded flex-1" style={{ width: `${Math.random() * 80 + 20}%` }} />
                </div>
              ))}
            </div>
          ) : stats?.revenue_chart?.length > 0 ? (
            <div className="space-y-3">
              {stats.revenue_chart.map((d: any) => (
                <div key={d.date} className="flex items-center gap-3">
                  <span className="text-xs w-14 shrink-0 text-right" style={{ color: 'var(--text-secondary)' }}>
                    {new Date(d.date).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}
                  </span>
                  <div className="flex-1 h-8 rounded-lg overflow-hidden" style={{ background: 'var(--bg-secondary)' }}>
                    <div
                      className="h-full rounded-lg flex items-center px-3 transition-all duration-700"
                      style={{
                        width: `${Math.max((d.revenue / maxRevenue) * 100, 4)}%`,
                        background: 'linear-gradient(90deg, #1d4ed8, #0f172a)',
                      }}
                    >
                      <span className="text-xs text-white font-semibold whitespace-nowrap">
                        {d.orders} orders
                      </span>
                    </div>
                  </div>
                  <span className="text-xs w-24 shrink-0 font-semibold text-right" style={{ color: 'var(--text)' }}>
                    {formatVND(d.revenue)}
                  </span>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-center py-8" style={{ color: 'var(--text-secondary)' }}>No data yet</p>
          )}
        </div>

        {/* Recent Orders */}
        <div className="card p-6">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-lg font-bold" style={{ color: 'var(--text)' }}>Recent Orders</h2>
            <Link href="/admin/orders" className="text-sm font-semibold" style={{ color: 'var(--accent)' }}>
              View all →
            </Link>
          </div>

          {loading ? (
            <div className="space-y-4">
              {Array.from({ length: 5 }).map((_, i) => (
                <div key={i} className="flex gap-3">
                  <div className="skeleton h-10 w-10 rounded-full" />
                  <div className="flex-1 space-y-2">
                    <div className="skeleton h-4 w-3/4 rounded" />
                    <div className="skeleton h-3 w-1/2 rounded" />
                  </div>
                </div>
              ))}
            </div>
          ) : stats?.recent_orders?.length > 0 ? (
            <div className="space-y-4">
              {stats.recent_orders.map((order: any) => (
                <Link key={order.order_number} href={`/admin/orders?search=${order.order_number}`}
                      className="flex items-center gap-3 group">
                  <div className="w-10 h-10 rounded-full flex items-center justify-center text-sm font-bold shrink-0"
                       style={{ background: 'var(--bg-secondary)', color: 'var(--accent)' }}>
                    {order.customer_name?.[0]?.toUpperCase()}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-semibold truncate group-hover:text-accent transition-colors"
                       style={{ color: 'var(--text)' }}>
                      {order.customer_name}
                    </p>
                    <p className="text-xs" style={{ color: 'var(--text-secondary)' }}>
                      {order.order_number}
                    </p>
                  </div>
                  <div className="text-right shrink-0">
                    <p className="text-sm font-bold" style={{ color: 'var(--text)' }}>
                      {formatVND(order.total_amount)}
                    </p>
                    <span className="text-xs px-2 py-0.5 rounded-full font-medium"
                          style={{
                            background: (STATUS_COLORS[order.order_status] || '#94a3b8') + '20',
                            color: STATUS_COLORS[order.order_status] || '#94a3b8',
                          }}>
                      {order.order_status}
                    </span>
                  </div>
                </Link>
              ))}
            </div>
          ) : (
            <p className="text-center py-8" style={{ color: 'var(--text-secondary)' }}>No orders yet</p>
          )}
        </div>
      </div>
    </div>
  );
}

