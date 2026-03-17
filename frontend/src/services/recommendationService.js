import axios from 'axios';

const API_URL = '/api/recommendations';

const api = axios.create({
  baseURL: 'http://localhost:5000',
  withCredentials: true,
});

const getRecommendations = async () => {
  const response = await api.get(API_URL);
  return response.data;
};

const recommendationService = {
  getRecommendations,
};

export default recommendationService;
