import axios from "axios";
const port = import.meta.env.VITE_PORT;

axios.defaults.baseURL = import.meta.env.VITE_API_URL || 'http://localhost:3000';
axios.defaults.withCredentials = true; 

const api = axios.create({
    baseURL: `http://localhost:${port}/api`,
    headers: {
        "Content-type": "application/json"
    }
});

export default api;