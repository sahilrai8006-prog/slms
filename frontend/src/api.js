import axios from 'axios';

const API_URL = import.meta.env.VITE_BACKEND_URL || '/api';

const api = axios.create({
    baseURL: API_URL,
});

api.interceptors.request.use(
    (config) => {
        const token = localStorage.getItem('token');
        if (token) {
            config.headers.Authorization = `Bearer ${token}`;
        }
        return config;
    },
    (error) => Promise.reject(error)
);

api.interceptors.response.use(
    (response) => response,
    async (error) => {
        const originalRequest = error.config;
        if (error.response && error.response.status === 401 && !originalRequest._retry) {
            originalRequest._retry = true;
            try {
                const refreshToken = localStorage.getItem('refresh');
                if (refreshToken) {
                    const res = await axios.post(`${API_URL}/token/refresh/`, {
                        refresh: refreshToken
                    });
                    if (res.status === 200) {
                        localStorage.setItem('token', res.data.access);
                        api.defaults.headers.common['Authorization'] = `Bearer ${res.data.access}`;
                        originalRequest.headers['Authorization'] = `Bearer ${res.data.access}`;
                        return api(originalRequest);
                    }
                }
            } catch (refreshError) {
                console.error("Token refresh failed", refreshError);
                localStorage.removeItem('token');
                localStorage.removeItem('refresh');
                localStorage.removeItem('role');
                localStorage.removeItem('username');
                window.location.href = '/login';
            }
        }
        return Promise.reject(error);
    }
);

export default api;
