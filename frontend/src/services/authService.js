import axios from 'axios';
import API_URL from '../api/apiConfig';

const API = axios.create({
  baseURL: API_URL,
  withCredentials: true,
});

const AUTH_URL = '/auth';

const signup = async (userData) => {
  const response = await API.post(`${AUTH_URL}/signup`, userData);
  return response.data;
};

const login = async (userData) => {
  const response = await API.post(`${AUTH_URL}/login`, userData);
  return response.data;
};

const logout = async () => {
  const response = await API.post(`${AUTH_URL}/logout`);
  return response.data;
};

const authService = {
  signup,
  login,
  logout,
};

export default authService;
