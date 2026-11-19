import axios from 'axios';
import { getToken } from './authService';

const API_URL = 'http://localhost:8088/api/employees';

// Axios instance
const api = axios.create();

api.interceptors.request.use(config => {
  const token = getToken();
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// ---------------- Employee APIs ----------------
export const getAllEmployees = async () => {
  const res = await api.get(API_URL);
  return res.data;
};

export const getEmployeeById = async id => {
  const res = await api.get(`${API_URL}/${id}`);
  return res.data;
};

export const addEmployee = async employee => {
  const res = await api.post(API_URL, employee);
  return res.data;
};

export const updateEmployee = async (id, employee) => {
  const res = await api.put(`${API_URL}/${id}`, employee);
  return res.data;
};

export const deleteEmployee = async id => {
  const res = await api.delete(`${API_URL}/${id}`);
  return res.data;
};