import axios from 'axios';

/**
 * Centralized Axios instance configured for API services.
 */
const api = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL || '/api',
  headers: {
    'Content-Type': 'application/json',
  },
});

export default api;
