import axios from 'axios';
import API_URL from '../api/apiConfig';

const API = axios.create({
  baseURL: API_URL,
  withCredentials: true,
});

const PROGRESS_URL = '/progress';

const createLog = async (logData) => {
  const response = await API.post(PROGRESS_URL, logData);
  return response.data;
};

const getLogs = async (params) => {
  const response = await API.get(PROGRESS_URL, { params });
  return response.data;
};

const getHistory = async (page = 1, extraParams = {}) => {
  const response = await API.get(PROGRESS_URL, { params: { page, ...extraParams } });
  return response.data;
};

const getStats = async () => {
  const response = await API.get(`${PROGRESS_URL}/stats`);
  return response.data;
};

const deleteLog = async (id) => {
  await API.delete(`${PROGRESS_URL}/${id}`);
};

const progressService = {
  createLog,
  getLogs,
  getHistory,
  getStats,
  deleteLog,
};

export default progressService;
