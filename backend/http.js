import axios from "axios";

// fuck my life

// require('dotenv').config();
// console.log(`${process.env.PORT}`);
const api = axios.create({
    baseURL: `http://localhost:${3000}/api`,
    headers: {
        "Content-type": "application/json"
    }
});

export default api;