// reference:
// https://www.bezkoder.com/node-express-mongodb-crud-rest-api/

import http from "../http.js";

class ListingService {
    getAll() {
        return http.get("/listings");
    }

    get(id) {
        return http.get(`/listings/${id}`);
    }

    create(data) {
        return http.post("/listings", data);
    }

    update(id, data) {
        return http.put(`/listings/${id}`, data);
    }

    delete(id) {
        return http.delete(`/listings/${id}`);
    }

    deleteAll() {
        return http.delete(`/listings`);
    }

    findByTitle(title) {
        return http.get(`/listings?title=${title}`);
    }
}

export default new ListingService();