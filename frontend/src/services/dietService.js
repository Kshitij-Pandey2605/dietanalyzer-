import axios from 'axios';

const API_URL = '/api/diet';

const api = axios.create({
  baseURL: 'http://localhost:5000',
  withCredentials: true,
});

const getDietPlan = async () => {
  const response = await api.get(API_URL);
  return response.data;
};

const updateDietPlan = async (id, data) => {
    const response = await api.put(`${API_URL}/${id}`, data);
    return response.data;
};

const dietService = {
  getDietPlan,
  updateDietPlan
};

export default dietService;
