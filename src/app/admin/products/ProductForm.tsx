'use client';

import { useState, useEffect } from 'react';
import { useRouter, useParams } from 'next/navigation';
import Link from 'next/link';
import { productApi, categoryApi } from '@/lib/api';
import toast from 'react-hot-toast';

interface ProductForm {
  name_vi: string;
  name_en: string;
  description_vi: string;
  description_en: string;
  price: string;
  original_price: string;
  stock_quantity: string;
  category_id: string;
  images: string[];
  is_featured: boolean;
  is_active: boolean;
}

const EMPTY_FORM: ProductForm = {
  name_vi: '', name_en: '', description_vi: '', description_en: '',
  price: '', original_price: '', stock_quantity: '0', category_id: '',
  images: [''], is_featured: false, is_active: true,
};

export default function ProductFormPage({ isEdit = false }: { isEdit?: boolean }) {
  const router = useRouter();
  const params = useParams();
  const productId = params?.id as string;

  const [form, setForm] = useState<ProductForm>(EMPTY_FORM);
  const [categories, setCategories] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    categoryApi.getAll().then(res => setCategories(res.data.data || [])).catch(() => {});

    if (isEdit && productId) {
      setLoading(true);
      productApi.adminGetOne(parseInt(productId))
        .then((res) => {
          const p = res.data?.data;
          if (!p) return;
          setForm({
            name_vi: p.name_vi || '',
            name_en: p.name_en || '',
            description_vi: p.description_vi || '',
            description_en: p.description_en || '',
            price: p.price?.toString?.() || '',
            original_price: p.original_price?.toString?.() || '',
            stock_quantity: p.stock_quantity?.toString?.() || '0',
            category_id: p.category_id ? String(p.category_id) : '',
            images: Array.isArray(p.images) && p.images.length ? p.images : [''],
            is_featured: Number(p.is_featured) === 1 || p.is_featured === true,
            is_active: Number(p.is_active) === 1 || p.is_active === true,
          });
        })
        .catch(() => { toast.error('Failed to load product'); })
        .finally(() => setLoading(false));
    }
  }, [isEdit, productId]);

  const handleImageChange = (i: number, val: string) => {
    const imgs = [...form.images];
    imgs[i] = val;
    setForm({ ...form, images: imgs });
  };

  const addImage = () => setForm({ ...form, images: [...form.images, ''] });
  const removeImage = (i: number) => setForm({ ...form, images: form.images.filter((_, idx) => idx !== i) });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.name_vi || !form.name_en || !form.price) {
      toast.error('Please fill required fields');
      return;
    }

    setSubmitting(true);
    try {
      const payload = {
        ...form,
        price: parseInt(form.price),
        original_price: form.original_price ? parseInt(form.original_price) : null,
        stock_quantity: parseInt(form.stock_quantity),
        category_id: form.category_id ? parseInt(form.category_id) : null,
        images: form.images.filter(img => img.trim()),
      };

      if (isEdit && productId) {
        await productApi.update(parseInt(productId), payload);
        toast.success('Product updated!');
      } else {
        await productApi.create(payload);
        toast.success('Product created!');
      }
      router.push('/admin/products');
    } catch (err: any) {
      const resData = err.response?.data;
      const validationErrors = Array.isArray(resData?.errors) ? resData.errors : [];
      if (validationErrors.length) {
        validationErrors.forEach((e: any) => {
          toast.error(`${e.field}: ${e.message}`);
        });
      } else {
        toast.error(resData?.message || 'Failed to save product');
      }
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="p-8 max-w-4xl">
      <div className="flex items-center gap-4 mb-8">
        <Link href="/admin/products" className="p-2 rounded-xl transition-colors hover:bg-gray-100 dark:hover:bg-dark-700">
          <svg className="w-5 h-5" style={{ color: 'var(--text-secondary)' }} fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
          </svg>
        </Link>
        <h1 className="text-2xl font-black" style={{ color: 'var(--text)', fontFamily: 'Playfair Display, serif' }}>
          {isEdit ? 'Edit Product' : 'New Product'}
        </h1>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="grid md:grid-cols-2 gap-6">
          {/* Vietnamese Name */}
          <div className="card p-6">
            <h2 className="font-bold text-sm uppercase tracking-wider mb-4" style={{ color: 'var(--text-secondary)' }}>
              🇻🇳 Vietnamese
            </h2>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium mb-1.5" style={{ color: 'var(--text)' }}>Name (VI) *</label>
                <input type="text" value={form.name_vi} onChange={e => setForm({ ...form, name_vi: e.target.value })}
                       className="input-field" placeholder="Tên sản phẩm" required />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1.5" style={{ color: 'var(--text)' }}>Description (VI)</label>
                <textarea value={form.description_vi} onChange={e => setForm({ ...form, description_vi: e.target.value })}
                          className="input-field resize-none" rows={4} placeholder="Mô tả sản phẩm..." />
              </div>
            </div>
          </div>

          {/* English Name */}
          <div className="card p-6">
            <h2 className="font-bold text-sm uppercase tracking-wider mb-4" style={{ color: 'var(--text-secondary)' }}>
              🇺🇸 English
            </h2>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium mb-1.5" style={{ color: 'var(--text)' }}>Name (EN) *</label>
                <input type="text" value={form.name_en} onChange={e => setForm({ ...form, name_en: e.target.value })}
                       className="input-field" placeholder="Product name" required />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1.5" style={{ color: 'var(--text)' }}>Description (EN)</label>
                <textarea value={form.description_en} onChange={e => setForm({ ...form, description_en: e.target.value })}
                          className="input-field resize-none" rows={4} placeholder="Product description..." />
              </div>
            </div>
          </div>
        </div>

        {/* Pricing & Inventory */}
        <div className="card p-6">
          <h2 className="font-bold text-sm uppercase tracking-wider mb-4" style={{ color: 'var(--text-secondary)' }}>
            💰 Pricing & Inventory
          </h2>
          <div className="grid sm:grid-cols-3 gap-4">
            <div>
              <label className="block text-sm font-medium mb-1.5" style={{ color: 'var(--text)' }}>
                Price (VND) *
              </label>
              <input type="number" value={form.price} onChange={e => setForm({ ...form, price: e.target.value })}
                     className="input-field" placeholder="299000" min="0" required />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1.5" style={{ color: 'var(--text)' }}>
                Original Price (for discount)
              </label>
              <input type="number" value={form.original_price} onChange={e => setForm({ ...form, original_price: e.target.value })}
                     className="input-field" placeholder="399000" min="0" />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1.5" style={{ color: 'var(--text)' }}>Stock Quantity *</label>
              <input type="number" value={form.stock_quantity} onChange={e => setForm({ ...form, stock_quantity: e.target.value })}
                     className="input-field" placeholder="100" min="0" required />
            </div>
          </div>
        </div>

        {/* Category & Settings */}
        <div className="card p-6">
          <h2 className="font-bold text-sm uppercase tracking-wider mb-4" style={{ color: 'var(--text-secondary)' }}>
            🗂️ Category & Settings
          </h2>
          <div className="grid sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium mb-1.5" style={{ color: 'var(--text)' }}>Category</label>
              <select value={form.category_id} onChange={e => setForm({ ...form, category_id: e.target.value })}
                      className="input-field">
                <option value="">— No category —</option>
                {categories.map(cat => (
                  <option key={cat.id} value={cat.id}>{cat.name_en} / {cat.name_vi}</option>
                ))}
              </select>
            </div>
            <div className="flex flex-col gap-3 justify-center">
              <label className="flex items-center gap-3 cursor-pointer">
                <div className={`relative w-11 h-6 rounded-full transition-colors ${form.is_active ? 'bg-green-500' : 'bg-gray-300'}`}
                     onClick={() => setForm({ ...form, is_active: !form.is_active })}>
                  <div className={`absolute top-0.5 left-0.5 w-5 h-5 bg-white rounded-full shadow transition-transform ${form.is_active ? 'translate-x-5' : ''}`} />
                </div>
                <span className="text-sm font-medium" style={{ color: 'var(--text)' }}>Active (visible to customers)</span>
              </label>
              <label className="flex items-center gap-3 cursor-pointer">
                <div className={`relative w-11 h-6 rounded-full transition-colors ${form.is_featured ? 'bg-yellow-400' : 'bg-gray-300'}`}
                     onClick={() => setForm({ ...form, is_featured: !form.is_featured })}>
                  <div className={`absolute top-0.5 left-0.5 w-5 h-5 bg-white rounded-full shadow transition-transform ${form.is_featured ? 'translate-x-5' : ''}`} />
                </div>
                <span className="text-sm font-medium" style={{ color: 'var(--text)' }}>Featured product ⭐</span>
              </label>
            </div>
          </div>
        </div>

        {/* Images */}
        <div className="card p-6">
          <div className="flex items-center justify-between mb-4">
            <h2 className="font-bold text-sm uppercase tracking-wider" style={{ color: 'var(--text-secondary)' }}>
              🖼️ Images (URLs)
            </h2>
            <button type="button" onClick={addImage}
                    className="text-sm px-3 py-1.5 rounded-lg font-medium"
                    style={{ background: 'var(--bg-secondary)', color: 'var(--accent)', border: '1px solid var(--border)' }}>
              + Add Image
            </button>
          </div>
          <div className="space-y-3">
            {form.images.map((img, i) => (
              <div key={i} className="flex gap-3 items-start">
                <div className="w-16 h-16 rounded-xl overflow-hidden shrink-0 border" style={{ borderColor: 'var(--border)', background: 'var(--bg-secondary)' }}>
                  {img && <img src={img} alt="" className="w-full h-full object-cover" onError={e => (e.currentTarget.style.display = 'none')} />}
                </div>
                <input
                  type="text"
                  value={img}
                  onChange={e => handleImageChange(i, e.target.value)}
                  className="input-field flex-1"
                  placeholder="https://images.example.com/product.jpg or data:image/webp;base64,..."
                />
                {form.images.length > 1 && (
                  <button type="button" onClick={() => removeImage(i)}
                          className="p-2 rounded-lg text-red-400 hover:bg-red-50 dark:hover:bg-red-900/20 transition-colors">
                    ✕
                  </button>
                )}
              </div>
            ))}
          </div>
        </div>

        {/* Submit */}
        <div className="flex gap-4">
          <button type="submit" disabled={submitting} className="btn-primary px-10">
            {submitting ? 'Saving...' : isEdit ? 'Update Product' : 'Create Product'}
          </button>
          <Link href="/admin/products" className="btn-secondary px-8">
            Cancel
          </Link>
        </div>
      </form>
    </div>
  );
}
