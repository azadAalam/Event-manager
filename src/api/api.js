import axios from 'axios';

const api = axios.create({
  baseURL: 'https://event-manager-backend-mu.vercel.app/api',
});

// Add a request interceptor to add the auth token
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Auth endpoints
export const auth = {
  signup: (data) => api.post('/auth/signup', data),
  login: (data) => api.post('/auth/login', data),
};

// Events endpoints
export const events = {
  getAll: () => api.get('/events'),
  getById: (id) => api.get(`/events/${id}`),
  create: (data) => api.post('/events', data, {
    headers: {
      'Content-Type': 'application/json'
    }
  }),
  uploadImage: (formData) => api.post('/events/upload', formData, {
    headers: {
      'Content-Type': 'multipart/form-data'
    }
  }),
  update: (id, data) => api.put(`/events/${id}`, data),
  delete: (id) => api.delete(`/events/${id}`),
  register: (id, accessCode) => api.post(`/events/${id}/register`, accessCode ? { accessCode } : {}),
};

export default api; 