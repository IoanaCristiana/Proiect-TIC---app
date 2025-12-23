<template>
  <v-app class="bg-grey-lighten-5">
    <v-app-bar flat color="white" class="border-b">
      <template v-slot:prepend>
        <v-app-bar-nav-icon color="grey-darken-2" @click="drawer = !drawer"></v-app-bar-nav-icon>
      </template>

      <v-app-bar-title class="text-uppercase font-weight-bold cursor-pointer" style="letter-spacing: 2px; color: #5E35B1;">
        Glow & Scent
      </v-app-bar-title>

      <template v-slot:append>
        <v-btn icon="mdi-magnify" color="grey-darken-2"></v-btn>
        
        <v-btn icon="mdi-cart-outline" color="grey-darken-2">
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
        <v-list-item prepend-icon="mdi-shape" title="Produse"></v-list-item>
      </v-list>
    </v-navigation-drawer>

    <v-main>
      <RouterView />
    </v-main>
  </v-app>
</template>

<script setup>
import { ref } from 'vue'
import { useCartStore } from '@/stores/cart' // Importam magazia

const drawer = ref(false)
const cartStore = useCartStore() // O activam
</script>