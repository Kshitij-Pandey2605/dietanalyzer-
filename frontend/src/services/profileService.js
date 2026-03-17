import axios from 'axios';

const API_URL = '/api/profile';

const api = axios.create({
  baseURL: 'http://localhost:5000',
  withCredentials: true,
});

const updateProfile = async (profileData) => {
  const response = await api.put(API_URL, profileData);
  return response.data;
};

const getMetrics = async () => {
  const response = await api.get(`${API_URL}/metrics`);
  return response.data;
};

const profileService = {
  updateProfile,
  getMetrics,
};

export default profileService;
