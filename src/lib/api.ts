import axios from 'axios';

const API_BASE = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api';

// Axios instance with defaults
const api = axios.create({
  baseURL: API_BASE,
  timeout: 15000,
  headers: { 'Content-Type': 'application/json' },
  withCredentials: true, // Send cookies
});

// Request interceptor - attach admin JWT token
api.interceptors.request.use((config) => {
  if (typeof window !== 'undefined') {
    try {
      const adminData = localStorage.getItem('rtshop-admin');
      if (adminData) {
        const { state } = JSON.parse(adminData);
        if (state?.token) {
          config.headers.Authorization = `Bearer ${state.token}`;
        }
      }
    } catch (e) {}
  }
  return config;
});

// Response interceptor - handle 401s globally
api.interceptors.response.use(
  (res) => res,
  (err) => {
    if (err.response?.status === 401) {
      if (typeof window !== 'undefined' && window.location.pathname.startsWith('/admin')) {
        localStorage.removeItem('rtshop-admin');
        window.location.href = `/${process.env.NEXT_PUBLIC_ADMIN_SECRET_PATH || 'admin-login-secret-xyz'}`;
      }
    }
    return Promise.reject(err);
  }
);

// ─── Product API ──────────────────────────────────────────────────────────────

export const productApi = {
  getAll: (params?: Record<string, any>) => api.get('/products', { params }),
  getBySlug: (slug: string) => api.get(`/products/${slug}`),
  search: (q: string) => api.get('/products/search', { params: { q } }),
  // Admin
  adminGetAll: (params?: Record<string, any>) => api.get('/admin/products', { params }),
  adminGetOne: (id: number) => api.get(`/admin/products/${id}`),
  create: (data: any) => api.post('/admin/products', data),
  update: (id: number, data: any) => api.put(`/admin/products/${id}`, data),
  delete: (id: number) => api.delete(`/admin/products/${id}`),
};

// ─── Category API ─────────────────────────────────────────────────────────────

export const categoryApi = {
  getAll: () => api.get('/categories'),
  // Admin
  create: (data: any) => api.post('/admin/categories', data),
  update: (id: number, data: any) => api.put(`/admin/categories/${id}`, data),
  delete: (id: number) => api.delete(`/admin/categories/${id}`),
};

// ─── Order API ────────────────────────────────────────────────────────────────

export const orderApi = {
  create: (data: any) => api.post('/orders', data),
  track: (params: { order_number?: string; email?: string; phone?: string }) =>
    api.get('/orders/track', { params }),
  // Admin
  adminGetAll: (params?: Record<string, any>) => api.get('/admin/orders', { params }),
  adminGetOne: (id: number) => api.get(`/admin/orders/${id}`),
  updateStatus: (id: number, data: { order_status: string; admin_notes?: string }) =>
    api.patch(`/admin/orders/${id}/status`, data),
};

export const customOrderApi = {
  create: (data: {
    name: string;
    phone: string;
    facebook?: string;
    email?: string;
    services: string;
    description: string;
  }) => api.post('/custom-orders', data),
  adminGetAll: (params?: Record<string, any>) => api.get('/admin/custom-orders', { params }),
};

// ─── Auth API ─────────────────────────────────────────────────────────────────

export const authApi = {
  adminLogin: (email: string, password: string) =>
    api.post('/auth/admin/login', { email, password }),
  googleLogin: (credential: string) =>
    api.post('/auth/google', { credential }),
  logout: () => api.post('/auth/admin/logout'),
  me: () => api.get('/auth/admin/me'),
};

// ─── Dashboard API ────────────────────────────────────────────────────────────

export const dashboardApi = {
  getStats: () => api.get('/admin/dashboard/stats'),
};

// ─── Newsletter API ───────────────────────────────────────────────────────────

export const newsletterApi = {
  subscribe: (email: string) => api.post('/newsletter/subscribe', { email }),
};

// ─── Helpers ──────────────────────────────────────────────────────────────────

export const formatVND = (amount: number): string =>
  new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(amount);

export const getProductName = (product: any, locale: string): string =>
  locale === 'en' ? product.name_en : product.name_vi;

export const getProductDesc = (product: any, locale: string): string =>
  locale === 'en' ? product.description_en : product.description_vi;

export const getCategoryName = (category: any, locale: string): string =>
  locale === 'en' ? category.name_en : category.name_vi;

export const getProductImage = (product: any): string =>
  product?.images?.[0] || '/images/placeholder.png';

export default api;
