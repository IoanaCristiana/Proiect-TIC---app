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
        <v-btn icon="mdi-magnify" color="grey-darken-2"></v-btn>
        
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

const drawer = ref(false)
const cartStore = useCartStore() 
</script>