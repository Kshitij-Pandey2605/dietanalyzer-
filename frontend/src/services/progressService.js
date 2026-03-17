import axios from 'axios';

const API_URL = '/api/progress';

const api = axios.create({
  baseURL: 'http://localhost:5000',
  withCredentials: true,
});

const createLog = async (logData) => {
  const response = await api.post(API_URL, logData);
  return response.data;
};

const getLogs = async (params) => {
  const response = await api.get(API_URL, { params });
  return response.data;
};

const getStats = async () => {
  const response = await api.get(`${API_URL}/stats`);
  return response.data;
};

const deleteLog = async (id) => {
  await api.delete(`${API_URL}/${id}`);
};

const progressService = {
  createLog,
  getLogs,
  getStats,
  deleteLog,
};

export default progressService;
