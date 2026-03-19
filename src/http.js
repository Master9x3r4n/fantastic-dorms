import axios from "axios";

const port = import.meta.env.VITE_PORT;
console.log(`PORT FROM http.js: ${port}`);
const api = axios.create({
    baseURL: `http://localhost:${port}/api`,
    headers: {
        "Content-type": "application/json"
    }
});

export default api;