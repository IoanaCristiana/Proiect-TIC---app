import { defineStore } from 'pinia'
import { ref } from 'vue'

export const useAuthStore = defineStore('auth', () => {
  const user = ref(null)
  const token = ref(localStorage.getItem('token') || null)

  async function register(dateFormular) {
    try {
      console.log("Trimit cerere Register la server...", dateFormular) 
      
      const response = await fetch('http://localhost:3000/api/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(dateFormular)
      })

      if (response.ok) {
        const data = await response.json()
        user.value = data
        if (data.token) {
          token.value = data.token
          localStorage.setItem('token', data.token)
        }
        return true 
      } else {
        const errorData = await response.json()
        console.error("Eroare Backend:", errorData)
        return false 
      }
    } catch (error) {
      console.error("Eroare Retea:", error)
      return false
    }
  }

  async function login(dateFormular) {
    try {
      const response = await fetch('http://localhost:3000/api/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(dateFormular)
      })

      if (response.ok) {
        const data = await response.json()
        user.value = data
        return true
      } else {
        return false
      }
    } catch (error) {
      console.error("Eroare Login:", error)
      return false
    }
  }

  function logout() {
    user.value = null
    token.value = null
    localStorage.removeItem('token')
  }
  return { 
    user, 
    token, 
    register, 
    login, 
    logout 
  }
})