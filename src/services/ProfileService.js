/*
    ProfileService

    Acts as an interface for the Vue frontend to interact with
    and receive data from the backend.
*/

import http from "../http.js";

class ProfileService {
    getAll() {
        return http.get(`/profiles`);
    }

    get(username) {
        return http.get(`/profiles/${username}`);
    }

    create(data) {
        return http.post("/profiles", data);
    }
}

export default new ProfileService();

// get(id) {
//     return http.get(`/profiles/${id}`);
// }

// create(data) {
//     return http.post("/profiles", data);
// }

// update(id, data) {
//     return http.put(`/profiles/${id}`, data);
// }

// delete(id) {
//     return http.delete(`/profiles/${id}`);
// }

// deleteAll() {
//     return http.delete(`/profiles`);
// }

// findByTitle(title) {
//     return http.get(`/profiles?title=${title}`);
// }