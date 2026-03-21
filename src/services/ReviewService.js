import http from "../http.js";

class ReviewService {
    getAll() {
        return http.get(`/r`);
    }

    getAllByUser(username) {
        return http.get(`/r?username=${username}`)
    }
    
    getAllFromListing(listingId) {
        return http.get(`/r?listingId=${listingId}`);
    }

    get(id) {
        return http.get(`/r/${id}`);
    }

    findAllByTitle(title) {
        return http.get(`/r?title=${title}`);
    }

    findAllByTitleFromListing(listing, title) {
        return http.get(`/r?listingId=${listingId}&title=${title}`);
    }

    create(data) {
        return http.post(`/r`, data);
    }

    update(id, data) {
        return http.patch(`/r/${id}`, data);
    }

    delete(id) {
        return http.delete(`/r/${id}`);
    }

    deleteAllFromUser(username) {
        return http.delete(`/r?username=${username}`);
    }
}

export default new ReviewService();