<template>
  <v-container class="fill-height d-flex align-center justify-center">
    <v-card width="400" elevation="4">
      <v-tabs v-model="tab" bg-color="deep-purple-lighten-4" grow>
        <v-tab value="login">Autentificare</v-tab>
        <v-tab value="register">Înregistrare</v-tab>
      </v-tabs>

      <v-card-text>
        <v-window v-model="tab">
          
          <v-window-item value="login">
            <v-form @submit.prevent="handleLogin">
              <v-text-field v-model="loginData.email" label="Email" prepend-inner-icon="mdi-email" variant="outlined"></v-text-field>
              <v-text-field v-model="loginData.parola" label="Parola" type="password" prepend-inner-icon="mdi-lock" variant="outlined"></v-text-field>
              <v-btn block color="deep-purple" type="submit" :loading="loading">Intră în cont</v-btn>
            </v-form>
          </v-window-item>

          <v-window-item value="register">
            <v-form @submit.prevent="handleRegister">
              <v-text-field v-model="registerData.nume" label="Numele Tău" prepend-inner-icon="mdi-account" variant="outlined"></v-text-field>
              <v-text-field v-model="registerData.email" label="Email" prepend-inner-icon="mdi-email" variant="outlined"></v-text-field>
              <v-text-field v-model="registerData.parola" label="Parola" type="password" prepend-inner-icon="mdi-lock" variant="outlined"></v-text-field>
              
              <v-text-field v-model="registerData.codSecret" label="Cod Secret (Opțional)" placeholder="Doar pentru admini" variant="plain" density="compact"></v-text-field>

              <v-btn block color="teal" type="submit" :loading="loading">Creează Cont</v-btn>
            </v-form>
          </v-window-item>

        </v-window>
        
        <p v-if="errorMsg" class="text-red text-center mt-3">{{ errorMsg }}</p>
      </v-card-text>
    </v-card>
  </v-container>
</template>

<script setup>
import { ref, reactive } from 'vue'
import { useAuthStore } from '@/stores/auth'
import { useRouter } from 'vue-router'

const authStore = useAuthStore()
const router = useRouter()

const tab = ref('login')
const loading = ref(false)
const errorMsg = ref('')

const loginData = reactive({ email: '', parola: '' })
const registerData = reactive({ nume: '', email: '', parola: '', codSecret: '' })

async function handleLogin() {
  loading.value = true
  errorMsg.value = ''
  
  try {
    const res = await fetch('http://localhost:3000/api/login', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(loginData)
    })
    const data = await res.json()

    if (res.ok) {
      authStore.login(data)
      // Daca e admin, il ducem la admin panel, altfel acasa
      router.push(data.rol === 'admin' ? '/admin' : '/')
    } else {
      errorMsg.value = data.message
    }
  } catch (err) {
    errorMsg.value = "Eroare de conexiune server."
  } finally {
    loading.value = false
  }
}

async function handleRegister() {
  loading.value = true
  errorMsg.value = ''

  try {
    const res = await fetch('http://localhost:3000/api/register', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(registerData)
    })
    const data = await res.json()

    if (res.ok) {
      // Dupa inregistrare, comutam pe tabul de login
      alert("Cont creat! Acum te poți autentifica.")
      tab.value = 'login'
    } else {
      errorMsg.value = data.message
    }
  } catch (err) {
    errorMsg.value = "Eroare server."
  } finally {
    loading.value = false
  }
}
</script>