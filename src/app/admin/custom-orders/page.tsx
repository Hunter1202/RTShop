'use client';

import { useCallback, useEffect, useState } from 'react';
import { customOrderApi } from '@/lib/api';
import toast from 'react-hot-toast';

const STATUS = ['all', 'new', 'contacted', 'closed'];

type CustomOrder = {
  id: number;
  customer_name: string;
  phone: string;
  facebook: string | null;
  email: string | null;
  services: string;
  description: string;
  status: 'new' | 'contacted' | 'closed';
  created_at: string;
};

export default function AdminCustomOrdersPage() {
  const [rows, setRows] = useState<CustomOrder[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [status, setStatus] = useState('all');
  const [page, setPage] = useState(1);
  const [pagination, setPagination] = useState({ total: 0, pages: 1, page: 1 });

  const load = useCallback(async () => {
    setLoading(true);
    try {
      const res = await customOrderApi.adminGetAll({
        page,
        limit: 20,
        search: search || undefined,
        status: status !== 'all' ? status : undefined,
      });
      setRows(res.data.data || []);
      setPagination(res.data.pagination || { total: 0, pages: 1, page: 1 });
    } catch {
      toast.error('Failed to load custom orders');
    } finally {
      setLoading(false);
    }
  }, [page, search, status]);

  useEffect(() => {
    load();
  }, [load]);

  return (
    <div className="p-8">
      <div className="mb-6">
        <h1 className="text-2xl font-black" style={{ color: 'var(--text)', fontFamily: 'Playfair Display, serif' }}>
          Custom Orders
        </h1>
        <p className="text-sm mt-1" style={{ color: 'var(--text-secondary)' }}>
          {pagination.total} total requests
        </p>
      </div>

      <div className="card p-4 mb-6 flex flex-wrap gap-3 items-center">
        <input
          value={search}
          onChange={(e) => {
            setSearch(e.target.value);
            setPage(1);
          }}
          className="input-field flex-1 min-w-48"
          placeholder="Search name, phone, email, services..."
        />
        <div className="flex gap-1.5 flex-wrap">
          {STATUS.map((s) => (
            <button
              key={s}
              onClick={() => {
                setStatus(s);
                setPage(1);
              }}
              className="px-3 py-2 rounded-xl text-xs font-semibold capitalize"
              style={
                status === s
                  ? { background: 'var(--accent)', color: 'white' }
                  : { background: 'var(--bg-secondary)', color: 'var(--text-secondary)', border: '1px solid var(--border)' }
              }
            >
              {s}
            </button>
          ))}
        </div>
      </div>

      <div className="card overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr style={{ borderBottom: '1px solid var(--border)', background: 'var(--bg-secondary)' }}>
                {['Name', 'Phone', 'Facebook', 'Email', 'Services', 'Description', 'Date'].map((h) => (
                  <th key={h} className="text-left px-4 py-3 text-xs font-semibold uppercase" style={{ color: 'var(--text-secondary)' }}>
                    {h}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {loading ? (
                Array.from({ length: 8 }).map((_, i) => (
                  <tr key={i} style={{ borderBottom: '1px solid var(--border)' }}>
                    {Array.from({ length: 7 }).map((__, j) => (
                      <td key={j} className="px-4 py-3">
                        <div className="skeleton h-4 w-full rounded" />
                      </td>
                    ))}
                  </tr>
                ))
              ) : rows.length === 0 ? (
                <tr>
                  <td colSpan={7} className="px-4 py-10 text-center" style={{ color: 'var(--text-secondary)' }}>
                    No custom orders found
                  </td>
                </tr>
              ) : (
                rows.map((r) => (
                  <tr key={r.id} style={{ borderBottom: '1px solid var(--border)' }}>
                    <td className="px-4 py-3 text-sm font-semibold" style={{ color: 'var(--text)' }}>
                      {r.customer_name}
                    </td>
                    <td className="px-4 py-3 text-sm" style={{ color: 'var(--text-secondary)' }}>
                      {r.phone}
                    </td>
                    <td className="px-4 py-3 text-sm" style={{ color: 'var(--text-secondary)' }}>
                      {r.facebook || '-'}
                    </td>
                    <td className="px-4 py-3 text-sm" style={{ color: 'var(--text-secondary)' }}>
                      {r.email || '-'}
                    </td>
                    <td className="px-4 py-3 text-sm" style={{ color: 'var(--text)' }}>
                      {r.services}
                    </td>
                    <td className="px-4 py-3 text-sm max-w-xs" style={{ color: 'var(--text-secondary)' }}>
                      {r.description}
                    </td>
                    <td className="px-4 py-3 text-xs" style={{ color: 'var(--text-secondary)' }}>
                      {new Date(r.created_at).toLocaleString()}
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

        {pagination.pages > 1 && (
          <div className="flex items-center justify-between px-4 py-3 border-t" style={{ borderColor: 'var(--border)' }}>
            <p className="text-sm" style={{ color: 'var(--text-secondary)' }}>
              Page {page} of {pagination.pages}
            </p>
            <div className="flex gap-2">
              <button
                disabled={page <= 1}
                onClick={() => setPage((p) => Math.max(1, p - 1))}
                className="px-3 py-1.5 rounded-lg text-sm disabled:opacity-40"
                style={{ background: 'var(--bg-secondary)', color: 'var(--text)', border: '1px solid var(--border)' }}
              >
                Prev
              </button>
              <button
                disabled={page >= pagination.pages}
                onClick={() => setPage((p) => Math.min(pagination.pages, p + 1))}
                className="px-3 py-1.5 rounded-lg text-sm disabled:opacity-40"
                style={{ background: 'var(--bg-secondary)', color: 'var(--text)', border: '1px solid var(--border)' }}
              >
                Next
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
