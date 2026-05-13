'use client';

import { useState, useEffect } from 'react';
import { categoryApi } from '@/lib/api';
import toast from 'react-hot-toast';

interface Category {
  id: number;
  name_vi: string;
  name_en: string;
  slug: string;
  description_vi: string;
  description_en: string;
  product_count: number;
}

const EMPTY: Omit<Category, 'id' | 'product_count'> = {
  name_vi: '', name_en: '', slug: '', description_vi: '', description_en: '',
};

export default function AdminCategoriesPage() {
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [editing, setEditing] = useState<Category | null>(null);
  const [form, setForm] = useState(EMPTY);
  const [submitting, setSubmitting] = useState(false);

  const load = () => {
    setLoading(true);
    categoryApi.getAll()
      .then(res => setCategories(res.data.data || []))
      .catch(() => toast.error('Failed to load'))
      .finally(() => setLoading(false));
  };

  useEffect(() => { load(); }, []);

  const autoSlug = (name: string) =>
    name.toLowerCase().replace(/[^a-z0-9\s-]/g, '').replace(/\s+/g, '-').replace(/-+/g, '-').trim();

  const openCreate = () => {
    setEditing(null);
    setForm(EMPTY);
    setShowForm(true);
  };

  const openEdit = (cat: Category) => {
    setEditing(cat);
    setForm({ name_vi: cat.name_vi, name_en: cat.name_en, slug: cat.slug, description_vi: cat.description_vi, description_en: cat.description_en });
    setShowForm(true);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.name_vi || !form.name_en || !form.slug) {
      toast.error('All required fields must be filled');
      return;
    }
    setSubmitting(true);
    try {
      if (editing) {
        await categoryApi.update(editing.id, form);
        toast.success('Category updated!');
      } else {
        await categoryApi.create(form);
        toast.success('Category created!');
      }
      setShowForm(false);
      load();
    } catch (err: any) {
      toast.error(err.response?.data?.message || 'Failed to save');
    } finally {
      setSubmitting(false);
    }
  };

  const handleDelete = async (cat: Category) => {
    if (!confirm(`Delete "${cat.name_en}"? This cannot be undone.`)) return;
    try {
      await categoryApi.delete(cat.id);
      toast.success('Category deleted');
      load();
    } catch (err: any) {
      toast.error(err.response?.data?.message || 'Delete failed');
    }
  };

  return (
    <div className="p-8">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-2xl font-black" style={{ color: 'var(--text)', fontFamily: 'Playfair Display, serif' }}>
            Categories
          </h1>
          <p className="text-sm mt-1" style={{ color: 'var(--text-secondary)' }}>
            {categories.length} categories
          </p>
        </div>
        <button onClick={openCreate} className="btn-primary text-sm">+ New Category</button>
      </div>

      {/* Modal */}
      {showForm && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4" style={{ background: 'rgba(0,0,0,0.5)' }}>
          <div className="card w-full max-w-xl p-8 animate-scale-in">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xl font-bold" style={{ color: 'var(--text)' }}>
                {editing ? 'Edit Category' : 'New Category'}
              </h2>
              <button onClick={() => setShowForm(false)} className="p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-dark-700">
                ✕
              </button>
            </div>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="grid sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium mb-1.5" style={{ color: 'var(--text)' }}>Name (VI) *</label>
                  <input type="text" value={form.name_vi} onChange={e => setForm({ ...form, name_vi: e.target.value })}
                         className="input-field" placeholder="Tên danh mục" required />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1.5" style={{ color: 'var(--text)' }}>Name (EN) *</label>
                  <input type="text" value={form.name_en}
                         onChange={e => {
                           const val = e.target.value;
                           setForm({ ...form, name_en: val, slug: editing ? form.slug : autoSlug(val) });
                         }}
                         className="input-field" placeholder="Category name" required />
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium mb-1.5" style={{ color: 'var(--text)' }}>
                  Slug * <span className="text-xs font-normal" style={{ color: 'var(--text-secondary)' }}>(URL-friendly)</span>
                </label>
                <input type="text" value={form.slug} onChange={e => setForm({ ...form, slug: e.target.value })}
                       className="input-field font-mono" placeholder="category-slug" required />
              </div>
              <div className="grid sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium mb-1.5" style={{ color: 'var(--text)' }}>Description (VI)</label>
                  <textarea value={form.description_vi} onChange={e => setForm({ ...form, description_vi: e.target.value })}
                            className="input-field resize-none" rows={3} />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1.5" style={{ color: 'var(--text)' }}>Description (EN)</label>
                  <textarea value={form.description_en} onChange={e => setForm({ ...form, description_en: e.target.value })}
                            className="input-field resize-none" rows={3} />
                </div>
              </div>
              <div className="flex gap-3 pt-2">
                <button type="submit" disabled={submitting} className="btn-primary flex-1">
                  {submitting ? 'Saving...' : editing ? 'Update' : 'Create'}
                </button>
                <button type="button" onClick={() => setShowForm(false)} className="btn-secondary flex-1">
                  Cancel
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Grid */}
      {loading ? (
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {Array.from({ length: 6 }).map((_, i) => (
            <div key={i} className="card p-6">
              <div className="skeleton h-6 w-3/4 rounded mb-2" />
              <div className="skeleton h-4 w-1/2 rounded" />
            </div>
          ))}
        </div>
      ) : categories.length === 0 ? (
        <div className="text-center py-20">
          <div className="text-5xl mb-4">🗂️</div>
          <p className="font-semibold mb-4" style={{ color: 'var(--text)' }}>No categories yet</p>
          <button onClick={openCreate} className="btn-primary">Create First Category</button>
        </div>
      ) : (
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {categories.map(cat => (
            <div key={cat.id} className="card p-6">
              <div className="flex items-start justify-between mb-3">
                <div>
                  <h3 className="font-bold" style={{ color: 'var(--text)' }}>{cat.name_en}</h3>
                  <p className="text-sm" style={{ color: 'var(--text-secondary)' }}>{cat.name_vi}</p>
                </div>
                <span className="px-2 py-1 rounded-full text-xs font-medium"
                      style={{ background: 'rgba(29,78,216,0.12)', color: 'var(--accent)' }}>
                  {cat.product_count} items
                </span>
              </div>
              <code className="text-xs px-2 py-1 rounded" style={{ background: 'var(--bg-secondary)', color: 'var(--text-secondary)' }}>
                /{cat.slug}
              </code>
              {cat.description_en && (
                <p className="text-sm mt-3 line-clamp-2" style={{ color: 'var(--text-secondary)' }}>
                  {cat.description_en}
                </p>
              )}
              <div className="flex gap-2 mt-4">
                <button onClick={() => openEdit(cat)}
                        className="flex-1 py-2 rounded-lg text-sm font-medium transition-colors"
                        style={{ background: 'var(--bg-secondary)', color: 'var(--text)', border: '1px solid var(--border)' }}>
                  Edit
                </button>
                <button onClick={() => handleDelete(cat)}
                        className="flex-1 py-2 rounded-lg text-sm font-medium transition-colors bg-red-50 text-red-600 hover:bg-red-100 dark:bg-red-900/20 dark:text-red-400">
                  Delete
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

