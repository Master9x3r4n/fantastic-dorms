import http from "../http-common";

class ProfileService {
    getAll() {
        return http.get("/profiles");
    }

    get(id) {
        return http.get(`/profiles/${id}`);
    }

    create(data) {
        return http.post("/profiles", data);
    }

    update(id, data) {
        return http.put(`/profiles/${id}`, data);
    }

    delete(id) {
        return http.delete(`/profiles/${id}`);
    }

    deleteAll() {
        return http.delete(`/profiles`);
    }

    findByTitle(title) {
        return http.get(`/profiles?title=${title}`);
    }
}

export default new ProfileService();