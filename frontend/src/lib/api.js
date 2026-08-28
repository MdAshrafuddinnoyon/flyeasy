import axios from 'axios';

const API_BASE = import.meta.env.VITE_API_BASE_URL || 'http://localhost:4000/api';

export const api = axios.create({ baseURL: API_BASE });

api.interceptors.request.use((config) => {
  const token = localStorage.getItem('flyeasy_token');
  if (token) config.headers.Authorization = `Bearer ${token}`;
  return config;
});

// Simple resource helpers — one per entity, all thin wrappers over the REST API.
export const Entities = {
  airlines: crud('airlines'),
  announcements: crud('announcements'),
  hotels: crud('hotels'),
  packages: crud('packages'),
  flights: crud('flights'),
  promotions: crud('promotions'),
  testimonials: crud('testimonials'),
  paymentMethods: crud('payment-methods'),
  bookings: crud('bookings'),
  faqs: crud('faqs'),
  team: crud('team-members'),
  certifications: crud('certifications'),
  pages: crud('pages'),
  newsletter: crud('newsletter-subscribers'),
  package_reviews: crud('package-reviews'),
  notifications: crud('notifications'),
  email_templates: crud('email-templates'),
  partners: crud('partners'),
};

export const SiteContent = {
  get: () => api.get('/site-content').then((r) => r.data),
  update: (data) => api.put('/site-content', data).then((r) => r.data),
};

export const Reviews = {
  getMine: () => api.get('/reviews/mine').then((r) => r.data),
  create: (data) => api.post('/reviews', data).then((r) => r.data),
};

export const Auth = {
  login: (identifier, password) => api.post('/auth/login', { identifier, password }).then((r) => r.data),
  register: (name, email, phone, password) => api.post('/auth/register', { name, email, phone, password }).then((r) => r.data),
  me: () => api.get('/auth/me').then((r) => r.data),
  updateProfile: (data) => api.put('/auth/me', data).then((r) => r.data),
  updatePassword: (currentPassword, newPassword) => api.put('/auth/me/password', { currentPassword, newPassword }).then((r) => r.data),
};

export const Utils = {
  upload: (file) => {
    const formData = new FormData();
    formData.append('image', file);
    return api.post('/upload', formData, { headers: { 'Content-Type': 'multipart/form-data' } }).then((r) => r.data);
  }
};

function crud(path) {
  return {
    list: () => api.get(`/${path}`).then((r) => r.data),
    get: (id) => api.get(`/${path}/${id}`).then((r) => r.data),
    create: (data) => api.post(`/${path}`, data).then((r) => r.data),
    update: (id, data) => api.put(`/${path}/${id}`, data).then((r) => r.data),
    remove: (id) => api.delete(`/${path}/${id}`),
  };
}
