import { defineStore } from 'pinia'

export const useAuthStore = defineStore('auth', {
  state: () => ({
    user: JSON.parse(localStorage.getItem('user')) || null, 
  }),
  getters: {
    isAuthenticated: (state) => !!state.user,
    isAdmin: (state) => state.user?.rol === 'admin',
    userName: (state) => state.user?.nume || 'Vizitator'
  },
  actions: {
    login(userData) {
      this.user = userData
      localStorage.setItem('user', JSON.stringify(userData)) 
    },
    logout() {
      this.user = null
      localStorage.removeItem('user')
      window.location.href = '/'
    }
  }
})