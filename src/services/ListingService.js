// reference:
// https://www.bezkoder.com/node-express-mongodb-crud-rest-api/

import http from "../http.js";

class ListingService {
    getAll() {
        return http.get("/l");
    }

    get(id) {
        return http.get(`/l/${id}`);
    }

    create(data) {
        return http.post("/l", data);
    }

    update(id, data) {
        return http.put(`/l/${id}`, data);
    }

    delete(id) {
        return http.delete(`/l/${id}`);
    }

    deleteAll() {
        return http.delete(`/l`);
    }

    findByTitle(title) {
        return http.get(`/l?title=${title}`);
    }
}

export default new ListingService();