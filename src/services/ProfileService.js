import http from "../http.js";

class ProfileService {
	findAll() {
		return http.get('/p');
	}

	find(username) {
		return http.get(`/p/${username}`);
	}

	create(data) {
		return http.post('/p', data);
	}

	login(username) {
		return http.post('/auth/login', username);
	}

	updatePassword(username, data) {
		return http.patch(`/p/${username}/password`, data);
	}
	
	update(username, data) {
		return http.patch(`/p/${username}`, data, {
			headers: { 'Content-Type': 'multipart/form-data' }
		});
	}
}

export default new ProfileService();