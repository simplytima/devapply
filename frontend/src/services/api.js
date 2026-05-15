// Use different URLs based on environment
const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

const getToken = () => localStorage.getItem('token');

const apiRequest = async (endpoint, method = 'GET', data = null) => {
  const headers = {
    'Content-Type': 'application/json',
  };
  
  const token = getToken();
  if (token) {
    headers['Authorization'] = `Bearer ${token}`;
  }
  
  const config = {
    method,
    headers,
  };
  
  if (data) {
    config.body = JSON.stringify(data);
  }
  
  const response = await fetch(`${API_URL}${endpoint}`, config);
  const result = await response.json();
  
  if (!response.ok) {
    throw new Error(result.error || 'Something went wrong');
  }
  
  return result;
};

// Auth API
export const registerUser = (userData) => apiRequest('/auth/register', 'POST', userData);
export const loginUser = (userData) => apiRequest('/auth/login', 'POST', userData);

// Applications API
export const getApplications = () => apiRequest('/applications');
export const createApplication = (data) => apiRequest('/applications', 'POST', data);
export const updateApplication = (id, data) => apiRequest(`/applications/${id}`, 'PUT', data);
export const deleteApplication = (id) => apiRequest(`/applications/${id}`, 'DELETE');