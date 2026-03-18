import axios from 'axios';
import API_URL from '../api/apiConfig';

const API = axios.create({
  baseURL: API_URL,
  withCredentials: true,
});

const DIET_URL = 'diet';

const getDietPlan = async () => {
  const response = await API.get(DIET_URL);
  return response.data;
};

const updateDietPlan = async (id, data) => {
    const response = await API.put(`${DIET_URL}/${id}`, data);
    return response.data;
};

const regenerateMeal = async (mealType) => {
    const response = await API.put(`${DIET_URL}/regenerate/${mealType}`);
    return response.data;
};

const dietService = {
  getDietPlan,
  updateDietPlan,
  regenerateMeal
};

export default dietService;
