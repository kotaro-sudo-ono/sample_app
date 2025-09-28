import { defineStore } from 'pinia';

export const authStore = defineStore('auth', {
  state: () => ({
    isLoggedIn: !!localStorage.getItem('jwt'),
    token: localStorage.getItem('jwt') || null,
  }),
  getters: {
    getIsLoggedIn: (state) => state.isLoggedIn,
    getToken: (state) => state.token,
  },
  actions: {
    login(token: string) {
      console.log('login called:', token);
      localStorage.setItem('jwt', token);
      this.token = token;
      this.isLoggedIn = true;
    },
    logout() {
      localStorage.removeItem('jwt');
      this.token = null;
      this.isLoggedIn = false;
      console.log('logout called');
    },
  },
});
