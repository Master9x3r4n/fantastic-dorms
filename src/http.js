import axios from "axios";

axios.defaults.baseURL = import.meta.env.VITE_API_URL || 'http://localhost:3000';
axios.defaults.withCredentials = true; 

const api = axios.create({
    baseURL: `${import.meta.env.VITE_API_URL || 'http://localhost:3000'}/api`,
    headers: {
        "Content-type": "application/json"
    }
});

export default api;