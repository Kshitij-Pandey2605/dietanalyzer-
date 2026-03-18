import axios from 'axios';
import API_URL from '../api/apiConfig';

const API = axios.create({
  baseURL: API_URL,
  withCredentials: true,
});

const REC_URL = 'recommendations';

const getRecommendations = async () => {
  const response = await API.get(REC_URL);
  return response.data;
};

const recommendationService = {
  getRecommendations,
};

export default recommendationService;
