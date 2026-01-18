import axios from 'axios';

// Create axios instance with base URL
const API = axios.create({
  baseURL: 'http://localhost:5000/api',
  headers: {
    'Content-Type': 'application/json',
  },
});

// Add token to requests if it exists
API.interceptors.request.use(
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

// Handle response errors
API.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      // Token expired or invalid
      localStorage.removeItem('token');
      localStorage.removeItem('user');
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);

// Auth API calls
export const authAPI = {
  register: (userData) => API.post('/auth/register', userData),
  login: (credentials) => API.post('/auth/login', credentials),
  getMe: () => API.get('/auth/me'),
};

// Admin API calls
export const adminAPI = {
  uploadCSV: (formData) => API.post('/admin/upload-csv', formData, {
    headers: {
      'Content-Type': 'multipart/form-data',
    },
  }),
  getCategories: () => API.get('/admin/categories'),
  clearData: () => API.delete('/admin/clear-data'),
  getAnalytics: () => API.get('/admin/analytics'),
};

// Category API calls (public)
export const categoryAPI = {
  getCategories: () => API.get('/categories'),
};

// User API calls
export const userAPI = {
  getProfile: () => API.get('/user/profile'),
  updateProfile: (data) => API.put('/user/profile', data),
  getSkillGap: (data) => API.post('/user/skill-gap', data),
  getFrameworks: (params) => API.get('/user/frameworks', { params }),
  getSkillsByDomain: (domain) => API.get('/user/skills-by-domain', { params: { domain } }),
  updateSkills: (skills) => API.put('/user/skills', { skills }),
  addProject: (projectData) => API.post('/user/projects', projectData),
  updateProject: (projectId, projectData) => API.put(`/user/projects/${projectId}`, projectData),
  deleteProject: (projectId) => API.delete(`/user/projects/${projectId}`),
};

// Framework API for getting specific framework details (public and admin)
export const frameworkAPI = {
  // Public endpoints
  getFramework: (id) => API.get(`/frameworks/${id}`),
  // Admin endpoints
  getFrameworks: (params) => API.get('/admin/frameworks', { params }),
  getFrameworkAdmin: (id) => API.get(`/admin/frameworks/${id}`),
  deleteFramework: (id) => API.delete(`/admin/frameworks/${id}`),
};

// Public Framework API calls
export const publicFrameworkAPI = {
  getFrameworks: (params) => API.get('/frameworks', { params }),
  getFramework: (id) => API.get(`/frameworks/${id}`),
  getFrameworksByDomain: (domain) => API.get(`/frameworks/domain/${domain}`),
};

// Helper functions for local storage
export const authHelpers = {
  setAuth: (token, user) => {
    localStorage.setItem('token', token);
    localStorage.setItem('user', JSON.stringify(user));
  },
  getAuth: () => {
    const token = localStorage.getItem('token');
    const user = JSON.parse(localStorage.getItem('user') || 'null');
    return { token, user };
  },
  clearAuth: () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
  },
  isAuthenticated: () => {
    return !!localStorage.getItem('token');
  },
};

// Recommendation API calls
export const recommendationAPI = {
  getRecommendations: (data) => API.post('/recommendations/recommend', data),
  getCourses: (params) => API.get('/recommendations/courses', { params }),
  getStats: () => API.get('/recommendations/stats'),
  getPersonalized: () => API.post('/recommendations/personalized'),
  generateRoadmap: (data) => API.post('/recommendations/roadmap', data),
  getProjectRecommendations: (data) => API.post('/recommendations/projects', data),
  getProjects: (params) => API.get('/recommendations/projects', { params }),
  getProjectById: (id) => API.get(`/recommendations/projects/${id}`),
  getProjectStats: () => API.get('/recommendations/projects-stats'),
};

// LinkedIn API calls
export const linkedinAPI = {
  parseJSON: (linkedinData) => API.post('/linkedin/parse-json', { linkedinData }),
  parseURL: (linkedinUrl) => API.post('/linkedin/parse-url', { linkedinUrl }),
  importData: (data) => API.post('/linkedin/import', data),
  getSampleData: () => API.get('/linkedin/sample-data'),
};

export default API;
