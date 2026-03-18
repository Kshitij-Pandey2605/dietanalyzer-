import axios from 'axios';
import API_URL from '../api/apiConfig';

const API = axios.create({
  baseURL: API_URL,
  withCredentials: true,
});

const PROFILE_URL = '/profile';

const getMetrics = async () => {
    const response = await API.get(`${PROFILE_URL}/metrics`);
    return response.data;
};

const updateProfile = async (profileData) => {
    const response = await API.put(PROFILE_URL, profileData);
    return response.data;
};

const profileService = {
  updateProfile,
  getMetrics,
};

export default profileService;
