import { defineStore } from 'pinia';
import api from './http.js';

export const useAuthStore = defineStore('auth', {
  state: () => ({ user: null }),
  actions: {
    async login(credentials) {
      const { data } = await api.post('/auth/login', credentials);
      this.user = data;
    },
    async logout() {
      await api.post('/auth/logout');
      this.user = null;
    },
    async fetchCurrentUser() {
      try {
        const { data } = await api.get('/auth/me');
        console.log('fetchCurrentUser response:', data);
        this.user = data.user;
      } catch (err) { this.user = null; 
        console.log('fetchCurrentUser error:', err.response);
      }
    }
  },
  getters: { isLoggedIn: (state) => !!state.user }
});