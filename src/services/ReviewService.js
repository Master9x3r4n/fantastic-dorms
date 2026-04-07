import http from "../http.js";

class ReviewService {
	// Something to think about
	// findAll(queries) {
	// 	let queryString = '';
	// 	let count = 0;
	// 	for (q in Object.keys(queries)) {
	// 		if (count == 0)
	// 			queryString += `?${q}=${queries[q]}`;
	// 		else
	// 			queryString += `&${q}=${queries[q]}`;
	// 		count++;
	// 	}
	// 	return http.get(`/r` + queryString);
	// }
	
	findAll() {
		return http.get(`/r`);
	}

	find(id) {
		return http.get(`/r/${id}`);
	}

	findAllByUser(username) {
		return http.get(`/r?username=${username}&isAnonymous=false`);
	}
	
	findAllFromListing(listingId) {
		return http.get(`/r?listingId=${listingId}`);
	}

	findAllByTitle(title) {
		return http.get(`/r?title=${title}`);
	}

	findAllByTitleFromListing(listingId, title) {
		return http.get(`/r?listingId=${listingId}&title=${title}`);
	}

	create(data) {
		return http.post(`/r`, data, {
			headers: { 'Content-Type': 'multipart/form-data' }
		});
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

	updateScore(id, { userId: userId, direction: direction }) {
		return http.patch(`/r/${id}/vote`, { userId: userId, direction: direction });
	}
}

export default new ReviewService();