import axios from 'axios';
import API_URL from '../api/apiConfig';

const API = axios.create({
  baseURL: API_URL,
  withCredentials: true,
});

const WORKOUT_URL = 'workout';

const getWorkoutPlan = async () => {
  const response = await API.get(WORKOUT_URL);
  return response.data;
};

const updateWorkoutPlan = async (id, data) => {
    const response = await API.put(`${WORKOUT_URL}/${id}`, data);
    return response.data;
};

const workoutService = {
  getWorkoutPlan,
  updateWorkoutPlan
};

export default workoutService;
