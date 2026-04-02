import axios from "axios";
const port = import.meta.env.VITE_PORT;

axios.defaults.withCredentials = true; //bruh i cant believe miro was hiding this line of code from me - stephy
const api = axios.create({
    baseURL: `http://localhost:${port}/api`,
    headers: {
        "Content-type": "application/json"
    }
});

export default api;