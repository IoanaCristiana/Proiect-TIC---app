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
      <span v-if="products.length === 0">Nu exista produse momentan. Adauga-le din Admin!</span>
      <span v-else>Nu am găsit niciun produs cu acest nume. 🕯️</span>
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
          :stoc="lumanare.stoc" 
        />
      </v-col>
    </v-row>
  </v-container>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue' 
import ProductCard from '../components/ProductCard.vue'

const textCautat = ref('')
const products = ref([]) 

onMounted(async () => {
  try {
    const response = await fetch('http://localhost:3000/api/products')
    if (response.ok) {
      products.value = await response.json()
      console.log("Produse incarcate:", products.value)
    }
  } catch (error) {
    console.error("Eroare la încărcarea produselor:", error)
  }
})

const produseFiltrate = computed(() => {
  if (!textCautat.value) return products.value
  
  return products.value.filter(produs => 
    produs.name.toLowerCase().includes(textCautat.value.toLowerCase())
  )
})
</script>