import axios from 'axios';

const API_URL = '/api/auth';

const api = axios.create({
  baseURL: 'http://localhost:5000',
  withCredentials: true,
});

const signup = async (userData) => {
  const response = await api.post(`${API_URL}/signup`, userData);
  return response.data;
};

const login = async (userData) => {
  const response = await api.post(`${API_URL}/login`, userData);
  return response.data;
};

const logout = async () => {
  const response = await api.post(`${API_URL}/logout`);
  return response.data;
};

const authService = {
  signup,
  login,
  logout,
};

export default authService;
