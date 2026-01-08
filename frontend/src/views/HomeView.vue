<template>
  <v-container class="py-10">
    <h1 class="text-center text-h4 font-weight-light mb-2 text-grey-darken-3" style="font-family: serif !important;">
      Colectia Aromaterapie
    </h1>
    <p class="text-center text-grey mb-8">Lucrate manual din ceara de soia 100% naturala</p>
    
    <v-row justify="center" class="mb-6">
      <v-col cols="12" sm="8" md="6">
        <v-text-field
          v-model="textCautat"
          label="Caută aroma preferată (ex: Lavandă)..."
          prepend-inner-icon="mdi-magnify"
          variant="outlined"
          rounded="xl"
          color="deep-purple"
          clearable
        ></v-text-field>
      </v-col>
    </v-row>

    <div v-if="produseFiltrate.length === 0" class="text-center text-grey mb-6">
      Nu am găsit niciun produs cu acest nume. 🕯️
    </div>

    <v-row>
      <v-col v-for="lumanare in produseFiltrate" :key="lumanare.id" cols="12" sm="6" md="4">
        <ProductCard 
          :id="lumanare.id"  
          :title="lumanare.name"
          :price="lumanare.price"
          :category="lumanare.category"
          :description="lumanare.description"
          :image="lumanare.image"
        />
      </v-col>
    </v-row>
  </v-container>
</template>

<script setup>
import { ref, computed } from 'vue' 
import ProductCard from '../components/ProductCard.vue'

import img1 from '@/assets/lavanda.jpg'
import img2 from '@/assets/pin+scortisoara.jpg'
import img3 from '@/assets/vanilie+caramel.jpg'

const textCautat = ref('')

// Logica ta e perfecta aici!
const produseFiltrate = computed(() => {
  if (!textCautat.value) return products.value
  
  return products.value.filter(produs => 
    produs.name.toLowerCase().includes(textCautat.value.toLowerCase())
  )
})

const products = ref([
  {
    id: 1,
    name: 'Lavanda & Eucalipt',
    price: 45,
    category: 'Relaxare',
    description: 'Perfecta pentru momentele de liniste. Calmeaza mintea si reduce stresul.',
    image: img1
  },
  {
    id: 2,
    name: 'Vanilie & Caramel',
    price: 55,
    category: 'Gourmet',
    description: 'O aroma dulce, calda si primitoare, ca o imbratisare în zilele reci.',
    image: img3
  },
  {
    id: 3,
    name: 'Pin & Scortisoara',
    price: 48,
    category: 'Sarbatori',
    description: 'Aduce mirosul proaspat de padure si magia iernii la tine in casa.',
    image: img2
  }
])
</script>