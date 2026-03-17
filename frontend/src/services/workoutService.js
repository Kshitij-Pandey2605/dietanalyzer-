import axios from 'axios';

const API_URL = '/api/workout';

const api = axios.create({
  baseURL: 'http://localhost:5000',
  withCredentials: true,
});

const getWorkoutPlan = async () => {
  const response = await api.get(API_URL);
  return response.data;
};

const updateWorkoutPlan = async (id, data) => {
    const response = await api.put(`${API_URL}/${id}`, data);
    return response.data;
};

const workoutService = {
  getWorkoutPlan,
  updateWorkoutPlan
};

export default workoutService;
