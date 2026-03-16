import axios from "axios";

export default axios.create({
    baseURL: `http://localhost:${process.env.PORT || 3000}/api`,
    headers: {
        "Content-type": "application/json"
    }
});