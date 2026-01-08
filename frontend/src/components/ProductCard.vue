<template>
  <v-card class="mx-auto" max-width="344" elevation="4">
    <v-img :src="image" height="200px" cover>
      <div v-if="stoc <= 0" class="d-flex fill-height align-center justify-center" style="background: rgba(255, 255, 255, 0.7);">
        <span class="text-red font-weight-bold text-h6 border-md border-red px-2 py-1 transform-rotate">STOC EPUIZAT</span>
      </div>
    </v-img>

    <v-card-title>{{ title }}</v-card-title>

    <v-card-subtitle class="mb-2 d-flex justify-space-between">
      <span class="text-body-1 font-weight-bold">{{ price }} RON</span>
      
      <span v-if="stoc > 0 && stoc < 5" class="text-caption text-orange">
        Doar {{ stoc }} buc. ramase!
      </span>
    </v-card-subtitle>

    <v-card-text>
      <div class="text-caption text-grey mb-2">{{ category }}</div>
      <div>{{ description }}</div>
    </v-card-text>

    <v-card-actions>
      <v-btn 
        :color="stoc > 0 ? 'deep-purple-lighten-1' : 'grey'" 
        :variant="stoc > 0 ? 'tonal' : 'flat'"
        block 
        @click="emitAddToCart"
        :disabled="stoc <= 0"
      >
        {{ stoc > 0 ? 'Adauga in cos' : 'Stoc Epuizat' }}
      </v-btn>
    </v-card-actions>
  </v-card>
</template>

<script setup>
import { useCartStore } from '@/stores/cart'

const props = defineProps({
  id: String,
  title: String,
  price: Number,
  category: String,
  description: String,
  image: String,
  stoc: Number 
})

const cartStore = useCartStore()

function emitAddToCart() {
  const productToAdd = {
    id: props.id,
    name: props.title,
    price: props.price,
    image: props.image,
    stoc: props.stoc 
  }
  cartStore.addToCart(productToAdd)
}
</script>

<style scoped>

.transform-rotate {
  transform: rotate(-10deg);
  border: 2px solid red;
}
</style>