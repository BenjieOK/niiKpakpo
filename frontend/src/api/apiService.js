import axios from 'axios';

const API_BASE = 'http://localhost:8000/api';

const api = axios.create({ baseURL: API_BASE });

api.interceptors.request.use((config) => {
  const token = localStorage.getItem('access_token');
  if (token) config.headers.Authorization = `Bearer ${token}`;
  return config;
});

api.interceptors.response.use(
  (res) => res,
  async (err) => {
    if (err.response?.status === 401) {
      const refresh = localStorage.getItem('refresh_token');
      if (refresh) {
        try {
          const { data } = await axios.post(`${API_BASE}/token/refresh/`, { refresh });
          localStorage.setItem('access_token', data.access);
          err.config.headers.Authorization = `Bearer ${data.access}`;
          return api.request(err.config);
        } catch {
          localStorage.clear();
          window.location.href = '/admin/login';
        }
      }
    }
    return Promise.reject(err);
  }
);

export const login = (username, password) =>
  axios.post(`${API_BASE}/token/`, { username, password });

export const getHeroSlides = () => api.get('/hero-slides/');
export const getExpertiseCards = () => api.get('/expertise-cards/');
export const getSiteSettings = () => api.get('/settings/');
export const getProjects = () => api.get('/projects/');
export const getTimeline = () => api.get('/timeline/');
export const getBlogPosts = (category) =>
  api.get('/blog-posts/', { params: category && category !== 'all' ? { category } : {} });
export const sendContactMessage = (data) => api.post('/messages/', data);

// Admin
export const adminGetStats = () => api.get('/admin-stats/');
export const adminGetMessages = () => api.get('/messages/');
export const adminMarkRead = (id) => api.patch(`/messages/${id}/read/`);
export const adminDeleteMessage = (id) => api.delete(`/messages/${id}/`);

export const adminGetHeroSlides = () => api.get('/hero-slides/');
export const adminCreateHeroSlide = (data) => api.post('/hero-slides/', data);
export const adminUpdateHeroSlide = (id, data) => api.put(`/hero-slides/${id}/`, data);
export const adminDeleteHeroSlide = (id) => api.delete(`/hero-slides/${id}/`);

export const adminGetBlogPosts = () => api.get('/blog-posts/');
export const adminCreateBlogPost = (data) => api.post('/blog-posts/', data);
export const adminUpdateBlogPost = (id, data) => api.put(`/blog-posts/${id}/`, data);
export const adminDeleteBlogPost = (id) => api.delete(`/blog-posts/${id}/`);

export const adminGetProjects = () => api.get('/projects/');
export const adminCreateProject = (data) => api.post('/projects/', data);
export const adminUpdateProject = (id, data) => api.put(`/projects/${id}/`, data);
export const adminDeleteProject = (id) => api.delete(`/projects/${id}/`);

export const adminGetExpertiseCards = () => api.get('/expertise-cards/');
export const adminUpdateExpertiseCard = (id, data) => api.put(`/expertise-cards/${id}/`, data);

export const adminUpdateSettings = (data) => api.patch('/settings/', data);

// Categories
export const getCategories = () => api.get('/categories/');
export const adminGetCategories = () => api.get('/categories/');
export const adminCreateCategory = (data) => api.post('/categories/', data);
export const adminUpdateCategory = (id, data) => api.put(`/categories/${id}/`, data);
export const adminDeleteCategory = (id) => api.delete(`/categories/${id}/`);

// Users
export const adminGetUsers = () => api.get('/users/');
export const adminCreateUser = (data) => api.post('/users/', data);
export const adminUpdateUser = (id, data) => api.put(`/users/${id}/`, data);
export const adminDeleteUser = (id) => api.delete(`/users/${id}/`);

export default api;
