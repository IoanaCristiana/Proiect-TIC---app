<template>
  <v-card class="mx-auto" elevation="2" max-width="350">
    <v-img :src="image" height="250" cover></v-img>

    <v-card-item>
      <v-card-title class="text-h6 font-weight-bold">{{ title }}</v-card-title>
      <v-card-subtitle class="text-uppercase">{{ category }}</v-card-subtitle>
    </v-card-item>

    <v-card-text>
      <div class="text-h6 text-primary mb-2">{{ price }} RON</div>
      <div class="text-body-2 text-grey-darken-1">{{ description }}</div>
    </v-card-text>

    <v-card-actions>
      <v-btn block color="deep-purple-lighten-2" variant="flat" @click="adaugaInCos">
        Adaugă în Coș
      </v-btn>
    </v-card-actions>
  </v-card>
</template>

<script setup>
import { useCartStore } from '@/stores/cart'


const props = defineProps({
  id: Number,
  title: String,
  price: Number,
  category: String,
  description: String,
  image: String
})

//pinia
const cartStore = useCartStore()


function adaugaInCos() {
  cartStore.addToCart({
    id: props.id,
    name: props.title,
    price: props.price,
    image: props.image
  })
}
</script>