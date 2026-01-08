<template>
  <v-container class="fill-height bg-deep-purple-lighten-5" fluid>
    <v-row align="center" justify="center">
      <v-col cols="12" sm="8" md="4">
        <v-card class="elevation-12 rounded-lg overflow-hidden">
          <v-window v-model="step">
            
            <v-window-item :value="1">
              <v-row class="fill-height ma-0">
                <v-col cols="12" md="8" class="pa-8">
                  <h2 class="text-h4 font-weight-bold text-deep-purple-darken-1 mb-6">Autentificare</h2>
                  <v-form @submit.prevent="handleLogin">
                    <v-text-field 
                      v-model="formLogin.email" 
                      label="Email" 
                      prepend-inner-icon="mdi-email" 
                      variant="outlined" 
                      density="comfortable"
                      class="mb-2"
                    ></v-text-field>
                    <v-text-field 
                      v-model="formLogin.parola" 
                      label="Parola" 
                      prepend-inner-icon="mdi-lock" 
                      type="password" 
                      variant="outlined" 
                      density="comfortable"
                      class="mb-4"
                    ></v-text-field>
                    
                    <v-btn type="submit" color="deep-purple-darken-1" block size="large" :loading="loading">
                      Intră în Cont
                    </v-btn>
                  </v-form>
                  
                  <div class="text-center mt-6 d-md-none">
                    <p class="text-caption text-grey">Nu ai cont?</p>
                    <v-btn variant="text" color="deep-purple" @click="step++">Creează unul acum</v-btn>
                  </div>
                </v-col>
                
                <v-col cols="12" md="4" class="bg-deep-purple-darken-1 d-none d-md-flex align-center justify-center flex-column pa-6 text-center">
                  <v-icon size="60" color="white" class="mb-4">mdi-candle</v-icon>
                  <h3 class="text-white mb-2">Bine ai revenit!</h3>
                  <p class="text-white text-caption mb-6">Relaxează-te cu aromele noastre.</p>
                  <v-btn variant="outlined" color="white" rounded="pill" size="small" class="px-6" @click="step++">
                    Cont Nou
                  </v-btn>
                </v-col>
              </v-row>
            </v-window-item>

            <v-window-item :value="2">
              <v-row class="fill-height ma-0">
                
                <v-col cols="12" md="4" class="bg-teal-darken-1 d-none d-md-flex align-center justify-center flex-column pa-6 text-center">
                  <v-icon size="60" color="white" class="mb-4">mdi-account-plus</v-icon>
                  <h3 class="text-white mb-2">Salutare!</h3>
                  <p class="text-white text-caption mb-6">Ai deja un cont creat?</p>
                  
                  <v-btn 
                    variant="outlined" 
                    color="white" 
                    rounded="pill" 
                    size="small"
                    class="px-6"
                    @click="step--"
                  >
                    Login
                  </v-btn>
                </v-col>

                <v-col cols="12" md="8" class="pa-8">
                  
                  <h2 
                    class="text-h4 font-weight-bold text-teal-darken-1 mb-6 user-select-none cursor-pointer" 
                    @dblclick="vreauAdmin = !vreauAdmin"
                    title="Dublu click aici"
                  >
                    Înregistrare
                  </h2>

                  <v-form @submit.prevent="handleRegister">
                    <v-text-field 
                      v-model="formRegister.nume" 
                      label="Nume Complet" 
                      prepend-inner-icon="mdi-account" 
                      variant="outlined"
                      density="comfortable"
                      class="mb-2"
                    ></v-text-field>
                    <v-text-field 
                      v-model="formRegister.email" 
                      label="Email" 
                      prepend-inner-icon="mdi-email" 
                      variant="outlined"
                      density="comfortable"
                      class="mb-2"
                    ></v-text-field>
                    <v-text-field 
                      v-model="formRegister.parola" 
                      label="Parola" 
                      prepend-inner-icon="mdi-lock" 
                      type="password" 
                      variant="outlined"
                      density="comfortable"
                      class="mb-2"
                    ></v-text-field>

                    <v-expand-transition>
                      <div v-if="vreauAdmin">
                        <v-text-field 
                          v-model="formRegister.codSecret" 
                          label="Cheie Administrator" 
                          prepend-inner-icon="mdi-shield-key" 
                          type="password"
                          variant="outlined"
                          density="comfortable"
                          color="red"
                          class="mb-4"
                        ></v-text-field>
                      </div>
                    </v-expand-transition>

                    <v-btn type="submit" color="teal-darken-1" block size="large" :loading="loading" class="mt-4">
                      Creează Cont
                    </v-btn>
                  </v-form>

                   <div class="text-center mt-6 d-md-none">
                    <p class="text-caption text-grey">Ai deja cont?</p>
                    <v-btn variant="text" color="teal" @click="step--">Login</v-btn>
                  </div>

                </v-col>
              </v-row>
            </v-window-item>

          </v-window>
        </v-card>
      </v-col>
    </v-row>
  </v-container>
</template>

<script setup>
import { ref } from 'vue'
import { useAuthStore } from '@/stores/auth'
import { useRouter } from 'vue-router'

const step = ref(1) 
const loading = ref(false)
const vreauAdmin = ref(false) // Secretul

const authStore = useAuthStore()
const router = useRouter()

const formLogin = ref({ email: '', parola: '' })
const formRegister = ref({ nume: '', email: '', parola: '', codSecret: '' })

async function handleLogin() {
  loading.value = true
  const success = await authStore.login(formLogin.value)
  loading.value = false
  if (success) router.push('/')
  else alert("Email sau parolă greșite!")
}

async function handleRegister() {
  loading.value = true
  if (!vreauAdmin.value) formRegister.value.codSecret = '' // Resetam codul daca e ascuns

  const success = await authStore.register(formRegister.value)
  loading.value = false
  if (success) {
    alert("Cont creat cu succes!")
    router.push('/')
  } else {
    alert("Nu s-a putut crea contul.")
  }
}
</script>

<style scoped>
.user-select-none { user-select: none; }
</style>