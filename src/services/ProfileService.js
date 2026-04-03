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
}

export default new ProfileService();