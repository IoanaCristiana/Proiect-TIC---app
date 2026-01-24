<template>
  <div class="bg-grey-lighten-5 h-100">
    
    <v-container fluid class="bg-white py-10 text-center border-b">
      <h1 class="text-h3 font-weight-bold text-deep-purple-darken-2 mb-2">Colectia Aromaterapie</h1>
      <p class="text-grey-darken-1 mb-6">Lucrate manual din ceara de soia 100% naturala</p>

      <v-responsive max-width="600" class="mx-auto mb-4">
        <v-text-field
          v-model="cautare"
          placeholder="Cauta aroma preferata (ex: Lavanda)..."
          prepend-inner-icon="mdi-magnify"
          variant="solo" 
          rounded="pill"
          density="comfortable"
          hide-details
          elevation="3"
          bg-color="deep-purple-lighten-5"
        ></v-text-field>
      </v-responsive>
    </v-container>

    <v-container class="py-10">
      
      <div v-if="produseFiltrate.length === 0" class="text-center py-10">
        <v-icon size="60" color="grey-lighten-2">mdi-emoticon-sad-outline</v-icon>
        
        <h3 class="text-h6 text-grey mt-4">
          <span v-if="cautare">Nu am gasit produse pentru "{{ cautare }}"</span>
          <span v-else>Nu exista produse momentan.</span>
        </h3>
        
        <v-btn v-if="cautare" color="deep-purple" variant="text" @click="cautare = ''" class="mt-2">
            Sterge cautarea
        </v-btn>
      </div>

      <v-row v-else>
        <v-col
          v-for="product in produseFiltrate"
          :key="product.id"
          cols="12"
          sm="6"
          md="4"
          lg="3"
        >
          <v-card hover elevation="2" class="rounded-lg h-100 d-flex flex-column transition-swing">
            <v-img
              :src="product.image"
              height="250"
              cover
              class="bg-grey-lighten-4"
            >
              <template v-slot:placeholder>
                <div class="d-flex align-center justify-center fill-height">
                  <v-progress-circular indeterminate color="grey-lighten-4"></v-progress-circular>
                </div>
              </template>
              
              <v-chip
                v-if="product.stoc > 0 && product.stoc < 5"
                color="red"
                size="x-small"
                class="font-weight-bold ma-2"
                variant="flat"
              >
                STOC LIMITAT
              </v-chip>

               <div v-if="product.stoc == 0" class="d-flex align-center justify-center fill-height bg-grey-darken-3 opacity-60" style="opacity: 0.8">
                  <span class="text-white font-weight-bold text-h6 border px-4 py-1">STOC EPUIZAT</span>
               </div>
            </v-img>

            <v-card-item class="pt-4">
              <div class="text-overline text-deep-purple mb-1">{{ product.category || 'General' }}</div>
              <div class="text-h6 font-weight-bold mb-1 text-truncate">{{ product.name }}</div>
              <div class="text-h6 text-deep-purple font-weight-black">{{ product.price }} RON</div>
            </v-card-item>

            <v-card-text class="text-caption text-grey pt-0 flex-grow-1">
              {{ product.description ? product.description.substring(0, 60) + '...' : 'Fara descriere' }}
            </v-card-text>

            <v-divider></v-divider>

            <v-card-actions class="pa-4">
              <v-btn
                block
                :color="product.stoc > 0 ? 'deep-purple-darken-1' : 'grey'"
                :variant="product.stoc > 0 ? 'flat' : 'outlined'"
                size="large"
                prepend-icon="mdi-cart-plus"
                @click="adaugaInCos(product)"
                :disabled="product.stoc == 0"
              >
                {{ product.stoc > 0 ? 'Adauga in Cos' : 'Indisponibil' }}
              </v-btn>
            </v-card-actions>
          </v-card>
        </v-col>
      </v-row>
    </v-container>
  </div>
</template>

<script setup>
import { ref, onMounted, computed } from 'vue'
import { useCartStore } from '@/stores/cart'
import { useAlertStore } from '@/stores/alert'

const cartStore = useCartStore()
const alertStore = useAlertStore()
const products = ref([])
const cautare = ref('')

onMounted(async () => {
  try {
    const response = await fetch('http://localhost:3000/api/products')
    products.value = await response.json()
  } catch (error) {
    console.error(error)
  }
})

const produseFiltrate = computed(() => {
  return products.value.filter(produs => {
    const textCautat = cautare.value.toLowerCase()
    const sePotrivesteNumele = produs.name.toLowerCase().includes(textCautat)
    return sePotrivesteNumele
  })
})

function adaugaInCos(product) {
  cartStore.addToCart(product)
  alertStore.triggerAlert(`${product.name} adaugat in cos!`, 'success')
}
</script>

<style scoped>
.v-card {
  transition: transform 0.2s, box-shadow 0.2s;
}
.v-card:hover {
  transform: translateY(-5px);
  box-shadow: 0 10px 20px rgba(0,0,0,0.1) !important;
}
</style>