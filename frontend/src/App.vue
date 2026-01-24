<template>
  <v-app>
    <v-navigation-drawer
      v-model="drawer"
      temporary
      location="left"
    >
      <v-list density="compact" nav>
        <v-list-subheader>MENU</v-list-subheader>
        
        <v-list-item prepend-icon="mdi-home" title="Acasa" value="home" to="/"></v-list-item>
        <v-list-item prepend-icon="mdi-cart" title="Cosul Meu" value="cart" to="/cart"></v-list-item>

       
        
        <v-list-item prepend-icon="mdi-information-outline" title="Despre Noi" value="about" to="/about"></v-list-item>
        
        <v-list-item 
          v-if="authStore.user"
          prepend-icon="mdi-history" 
          title="Istoric Comenzi" 
          value="istoric" 
          to="/istoric"
          color="deep-purple"
        ></v-list-item>

        <v-list-item 
          v-if="authStore.user && authStore.user.rol === 'admin'"
          prepend-icon="mdi-crown" 
          title="Admin Panel" 
          value="admin" 
          to="/admin"
          color="deep-purple"
        ></v-list-item>
      </v-list>

      <template v-slot:append>
        <div class="pa-4">
          <v-btn 
            v-if="authStore.user" 
            block 
            color="red-lighten-1" 
            variant="tonal" 
            @click="handleLogout"
          >
            Deconectare
          </v-btn>
          <v-btn 
            v-else 
            block 
            color="deep-purple" 
            to="/login"
          >
            Autentificare
          </v-btn>
        </div>
      </template>
    </v-navigation-drawer>

    <v-app-bar flat class="border-b" color="white" elevation="1">
      
      <v-app-bar-nav-icon @click="drawer = !drawer"></v-app-bar-nav-icon>

      <v-app-bar-title 
        class="text-uppercase font-weight-bold text-deep-purple-darken-2 cursor-pointer"
        @click="$router.push('/')"
        style="cursor: pointer;"
      >
        GLOW & SCENT
      </v-app-bar-title>

      <v-spacer></v-spacer>

      <div v-if="authStore.user" class="d-flex align-center">
        <div class="d-none d-sm-flex flex-column align-end mr-4">
          <span class="text-subtitle-2 font-weight-bold">Buna, {{ authStore.user.nume }}</span>
          <span class="text-caption text-grey">Cont Client</span>
        </div>

        <v-btn 
          v-if="authStore.user.rol === 'admin'" 
          to="/admin" 
          color="deep-purple" 
          variant="flat" 
          size="small" 
          class="mr-2 d-none d-sm-flex"
        >
          <v-icon start>mdi-crown</v-icon>
          Admin
        </v-btn>

        <v-btn icon color="grey-darken-1" class="d-none d-sm-flex" @click="handleLogout" title="Deconectare">
          <v-icon>mdi-logout</v-icon>
        </v-btn>
      </div>

      <div v-else class="d-none d-sm-flex">
        <v-btn 
          to="/login" 
          color="deep-purple-darken-1" 
          variant="text" 
          prepend-icon="mdi-account-circle"
        >
          LOGIN / CONT NOU
        </v-btn>
      </div>

      <v-divider vertical inset class="mx-2"></v-divider>

      <v-btn to="/cart" icon color="deep-purple-darken-1">
        <v-badge 
          :content="cartStore.itemsCount" 
          color="red" 
          v-if="cartStore.itemsCount > 0"
        >
          <v-icon>mdi-cart-outline</v-icon>
        </v-badge>
        <v-icon v-else>mdi-cart-outline</v-icon>
      </v-btn>
    </v-app-bar>

    <v-main>
      <router-view />
    </v-main>

    <v-snackbar
      v-model="alertStore.show"
      :color="alertStore.color"
      timeout="3000"
      location="bottom right"
    >
      {{ alertStore.text }}
      
      <template v-slot:actions>
        <v-btn variant="text" @click="alertStore.show = false">Inchide</v-btn>
      </template>
    </v-snackbar>

    <v-footer class="bg-grey-lighten-4 d-flex justify-center mt-10 py-4 text-caption text-grey">
      2026 - Glow & Scent Handmade
    </v-footer>
  </v-app>
</template>

<script setup>
import { ref } from 'vue'
import { useAuthStore } from '@/stores/auth'
import { useCartStore } from '@/stores/cart'
import { useAlertStore } from '@/stores/alert' 
import { useRouter } from 'vue-router'

const authStore = useAuthStore()
const cartStore = useCartStore()
const alertStore = useAlertStore() 
const router = useRouter()

const drawer = ref(false)

function handleLogout() {
  authStore.logout()
  drawer.value = false
  router.push('/')
}
</script>