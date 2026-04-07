// reference:
// https://www.bezkoder.com/node-express-mongodb-crud-rest-api/

import http from "../http.js";

class ListingService {
	findAll() {
		return http.get("/l");
	}

	find(id) {
		return http.get(`/l/${id}`);
	}

	findByTitle(title) {
		return http.get(`/l?title=${title}`);
	}

	create(data) {
		return http.post("/l", data, {
			headers: { 'Content-Type': 'multipart/form-data' }
		});
	}

	update(id, data) {
		return http.patch(`/l/${id}`, data, {
			headers: { 'Content-Type': 'multipart/form-data' }
		});
	}

	delete(id) {
		return http.delete(`/l/${id}`);
	}
}

export default new ListingService();