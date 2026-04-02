import { defineStore } from 'pinia';
import axios from 'axios';

export const useAuthStore = defineStore('auth', {
  state: () => ({ user: null }),
  actions: {
    async login(credentials) {
      const { data } = await axios.post('/auth/login', credentials);
      this.user = data;
    },
    async logout() {
      await axios.post('/auth/logout');
      this.user = null;
    },
    async fetchCurrentUser() {
      try {
        const { data } = await axios.get('/auth/me');
        this.user = data.user;
      } catch { this.user = null; }
    }
  },
  getters: { isLoggedIn: (state) => !!state.user }
});