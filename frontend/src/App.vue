<template>
  <v-app class="bg-grey-lighten-5">
    <v-app-bar flat color="white" class="border-b">
      <template v-slot:prepend>
        <v-app-bar-nav-icon color="grey-darken-2" @click="drawer = !drawer"></v-app-bar-nav-icon>
      </template>

      <v-app-bar-title class="text-uppercase font-weight-bold cursor-pointer" style="letter-spacing: 2px; color: #5E35B1;" @click="$router.push('/')">
        Glow & Scent
      </v-app-bar-title>

      <template v-slot:append>
        <v-btn icon="mdi-magnify" color="grey-darken-2" class="mr-2"></v-btn>
        
        <div v-if="!authStore.isAuthenticated">
          <v-btn to="/login" color="deep-purple-darken-1" variant="text" prepend-icon="mdi-account-circle">
            Login / Cont Nou
          </v-btn>
        </div>

        <div v-else class="d-flex align-center mr-2">
          <div class="d-none d-sm-flex flex-column align-end mr-3">
            <span class="text-caption text-grey">Bine ai venit,</span>
            <span class="text-body-2 font-weight-bold text-deep-purple">{{ authStore.userName }}</span>
          </div>

          <v-tooltip text="Panou Administrator" location="bottom" v-if="authStore.isAdmin">
            <template v-slot:activator="{ props }">
              <v-btn 
                v-bind="props"
                icon="mdi-shield-crown" 
                color="amber-darken-2" 
                variant="tonal"
                to="/admin"
                class="mr-2"
              ></v-btn>
            </template>
          </v-tooltip>

          <v-tooltip text="Deconectare" location="bottom">
            <template v-slot:activator="{ props }">
              <v-btn 
                v-bind="props"
                icon="mdi-logout" 
                color="grey-darken-1" 
                variant="text"
                @click="authStore.logout()"
              ></v-btn>
            </template>
          </v-tooltip>
        </div>

        <v-divider vertical inset class="mx-2"></v-divider>

        <v-btn icon="mdi-cart-outline" color="grey-darken-2" to="/cart">
          <v-badge 
            :content="cartStore.itemsCount" 
            color="red" 
            size="x-small" 
            v-if="cartStore.itemsCount > 0"
          >
            <v-icon>mdi-cart-outline</v-icon>
          </v-badge>
          <v-icon v-else>mdi-cart-outline</v-icon>
        </v-btn>

      </template>
    </v-app-bar>

    <v-navigation-drawer v-model="drawer" temporary>
      <v-list>
        <v-list-item prepend-icon="mdi-home" title="Acasă" to="/"></v-list-item>
        <v-list-item prepend-icon="mdi-cart" title="Coșul Meu" to="/cart"></v-list-item>
        
        <v-divider class="my-2"></v-divider>
        
        <v-list-item v-if="!authStore.isAuthenticated" prepend-icon="mdi-login" title="Autentificare" to="/login"></v-list-item>
        <v-list-item v-if="authStore.isAdmin" prepend-icon="mdi-shield-crown" title="Admin Panel" to="/admin" active-color="deep-purple"></v-list-item>
        <v-list-item v-if="authStore.isAuthenticated" prepend-icon="mdi-logout" title="Ieșire Cont" @click="authStore.logout()"></v-list-item>
      </v-list>
    </v-navigation-drawer>

    <v-main>
      <RouterView />
    </v-main>

    <v-footer color="grey-lighten-4" class="d-flex flex-column mt-10">
      <div class="px-4 py-2 bg-grey-lighten-3 text-center w-100 text-caption">
        {{ new Date().getFullYear() }} — <strong>Glow & Scent Handmade</strong>
      </div>
    </v-footer>
  </v-app>
</template>

<script setup>
import { ref } from 'vue'
import { useCartStore } from '@/stores/cart'
import { useAuthStore } from '@/stores/auth' 
const drawer = ref(false)
const cartStore = useCartStore()
const authStore = useAuthStore() 
</script>