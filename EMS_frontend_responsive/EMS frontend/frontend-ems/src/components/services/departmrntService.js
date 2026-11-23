import axios from 'axios';
import { getToken } from './authService';

// const API_URL = 'http://localhost:8088/api/departments';
const API_URL = `${import.meta.env.VITE_API_URL || 'http://localhost:8088'}/api/departments`;

// Axios instance with JWT
const api = axios.create();

api.interceptors.request.use(config => {
  const token = getToken();
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// ---------------- Department APIs ----------------
export const getAllDepartments = async () => {
  const res = await api.get(API_URL);
  return res.data;
};

export const getDepartmentById = async id => {
  const res = await api.get(`${API_URL}/${id}`);
  return res.data;
};

export const addDepartment = async department => {
  const res = await api.post(API_URL, department);
  return res.data;
};

export const updateDepartment = async (id, department) => {
  const res = await api.put(`${API_URL}/${id}`, department);
  return res.data;
};

export const deleteDepartment = async id => {
  const res = await api.delete(`${API_URL}/${id}`);
  return res.data;
};