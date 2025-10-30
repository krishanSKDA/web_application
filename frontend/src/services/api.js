import axios from 'axios';

// Base API URL
const API_BASE_URL = process.env.REACT_APP_API_URL;

// Create axios instance
const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Add token to requests if available
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

//COURSE APIs

/**
 * Get all courses with filters
 * @param {Object} params - Query parameters (page, limit, category, level, etc.)
 */
export const getCourses = async (params = {}) => {
  try {
    const response = await api.get('/api/courses', { params });
    return response.data;
  } catch (error) {
    console.error('Error fetching courses:', error);
    throw error;
  }
};

/**
 * Get single course by ID
 * @param {string} courseId - Course ID
 */
export const getCourseById = async (courseId) => {
  try {
    const response = await api.get(`/api/courses/${courseId}`);
    return response.data;
  } catch (error) {
    console.error('Error fetching course:', error);
    throw error;
  }
};

/**
 * Create new course (requires authentication)
 * @param {Object} courseData - Course data
 */
export const createCourse = async (courseData) => {
  try {
    const response = await api.post('/api/courses', courseData);
    return response.data;
  } catch (error) {
    console.error('Error creating course:', error);
    throw error;
  }
};

/**
 * Update course (requires authentication)
 * @param {string} courseId - Course ID
 * @param {Object} courseData - Updated course data
 */
export const updateCourse = async (courseId, courseData) => {
  try {
    const response = await api.put(`/api/courses/${courseId}`, courseData);
    return response.data;
  } catch (error) {
    console.error('Error updating course:', error);
    throw error;
  }
};

/**
 * Delete course (requires authentication)
 * @param {string} courseId - Course ID
 */
export const deleteCourse = async (courseId) => {
  try {
    await api.delete(`/api/courses/${courseId}`);
    return true;
  } catch (error) {
    console.error('Error deleting course:', error);
    throw error;
  }
};

/**
 * Get user's courses (requires authentication)
 */
export const getMyCourses = async () => {
  try {
    const response = await api.get('/api/courses/user/my-courses');
    return response.data;
  } catch (error) {
    console.error('Error fetching user courses:', error);
    throw error;
  }
};

//AUTH APIs 

/**
 * Register new user
 * @param {Object} userData - User registration data
 */
export const register = async (userData) => {
  try {
    const response = await api.post('/api/auth/register', userData);
    return response.data;
  } catch (error) {
    console.error('Error registering user:', error);
    throw error;
  }
};

/**
 * Login user - FIXED VERSION
 * @param {Object} credentials - Username and password {email, password} or {username, password}
 */
export const login = async (credentials) => {
  try {
    
    const formData = new URLSearchParams();
    
    
    formData.append('username', credentials.email || credentials.username);
    formData.append('password', credentials.password);
    
    const response = await api.post('/api/auth/login', formData, {
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
      },
    });
    
    if (response.data.access_token) {
      localStorage.setItem('token', response.data.access_token);
    }
    return response.data;
  } catch (error) {
    console.error('Error logging in:', error);
    throw error;
  }
};

/**
 * Logout user
 */
export const logout = () => {
  localStorage.removeItem('token');
  window.location.href = '/';
};

/**
 * Get current user info (requires authentication)
 */
export const getCurrentUser = async () => {
  try {
    const response = await api.get('/api/auth/me');
    return response.data;
  } catch (error) {
    console.error('Error fetching current user:', error);
    throw error;
  }
};

/**
 * Update user profile (requires authentication)
 * @param {Object} userData - Updated user data
 */
export const updateProfile = async (userData) => {
  try {
    const response = await api.put('/api/auth/profile', userData);
    return response.data;
  } catch (error) {
    console.error('Error updating profile:', error);
    throw error;
  }
};



/**
 * Check if user is authenticated
 */
export const isAuthenticated = () => {
  return !!localStorage.getItem('token');
};

/**
 * Get stored token
 */
export const getToken = () => {
  return localStorage.getItem('token');
};

export default api;