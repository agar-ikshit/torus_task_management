import axios from 'axios';

const API = axios.create({ baseURL: 'https://torus-backend-xr0w.onrender.com/api' });

export const loginUser = (credentials) => API.post('/auth/login', credentials);
export const registerUser = (userData) => API.post('/auth/register', userData);
export const fetchTasks = () => API.get('/tasks');
export const createTask = (taskData) => API.post('/tasks', taskData);
export const deleteTask = (taskId) => API.delete(`/tasks/${taskId}`);
