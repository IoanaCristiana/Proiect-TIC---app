<template>
  <v-container class="py-10">
    <h1 class="text-h4 mb-6">Coșul Meu</h1>

    <v-row v-if="cartStore.items.length > 0">
      <v-col cols="12" md="8">
        <v-card class="mb-4" v-for="item in cartStore.items" :key="item.id" elevation="2">
          <div class="d-flex align-center pa-3">
            
            <v-avatar size="80" rounded="lg" class="mr-4">
              <v-img :src="item.image" cover></v-img>
            </v-avatar>

            <div class="flex-grow-1">
              <div class="text-h6 font-weight-bold">{{ item.name }}</div>
              <div class="text-subtitle-2 text-deep-purple">{{ item.price }} RON / buc</div>
            </div>

            <div class="d-flex align-center bg-grey-lighten-4 rounded-pill px-2 py-1 mx-4">
              <v-btn 
                icon="mdi-minus" 
                variant="text" 
                density="compact" 
                size="small" 
                color="grey-darken-2"
                @click="cartStore.updateQuantity(item.id, -1)"
              ></v-btn>
              
              <span class="mx-3 font-weight-bold text-body-1">{{ item.quantity }}</span>
              
              <v-btn 
                icon="mdi-plus" 
                variant="text" 
                density="compact" 
                size="small" 
                :color="item.quantity >= item.stoc ? 'grey-lighten-1' : 'deep-purple'"
                :disabled="item.quantity >= item.stoc"
                @click="cartStore.updateQuantity(item.id, 1)"
              ></v-btn>

               <div v-if="item.quantity >= item.stoc" class="text-caption text-red position-absolute mt-6">
                Max
              </div>
            </div> 

            <v-btn icon="mdi-delete-outline" variant="text" color="red-lighten-2" @click="cartStore.removeFromCart(item.id)"></v-btn>
          
          </div> 
        </v-card>
      </v-col>

      <v-col cols="12" md="4">
        <v-card class="pa-6" elevation="3">
          <h3 class="text-h6 mb-4 font-weight-bold">Sumar Comandă</h3>
          
          <div class="d-flex justify-space-between mb-2 text-grey-darken-1">
            <span>Produse:</span>
            <span>{{ cartStore.itemsCount }} buc.</span>
          </div>

          <v-divider class="my-3"></v-divider>

          <div class="d-flex justify-space-between mb-6 align-center">
            <span class="text-h6">Total:</span>
            <span class="text-h5 font-weight-bold text-deep-purple">{{ cartStore.totalPrice }} RON</span>
          </div>
          
          <v-form @submit.prevent="trimiteComanda">
            <v-text-field v-model="detalii.nume" label="Numele tău" variant="outlined" density="compact" required></v-text-field>
            <v-text-field v-model="detalii.telefon" label="Telefon" variant="outlined" density="compact" required></v-text-field>
            <v-textarea v-model="detalii.adresa" label="Adresa de livrare" variant="outlined" rows="3" density="compact" required></v-textarea>
            
            <v-btn type="submit" color="deep-purple-darken-1" block size="large" class="mt-2" :loading="loading">
              Trimite Comanda
            </v-btn>
          </v-form>
        </v-card>
      </v-col>
    </v-row>

    <div v-else class="text-center mt-10">
      <v-icon size="80" color="grey-lighten-2">mdi-cart-off</v-icon>
      <h2 class="text-h5 text-grey mt-4">Coșul este gol</h2>
      <p class="text-grey mb-6">Nu ai adăugat încă nicio aromă minunată.</p>
      <v-btn to="/" color="deep-purple" variant="flat" size="large" rounded="pill">Vezi Produsele</v-btn>
    </div>
  </v-container>
</template>

<script setup>
import { ref } from 'vue'
import { useCartStore } from '@/stores/cart'
import { useAuthStore } from '@/stores/auth' 
import { useRouter } from 'vue-router'

const cartStore = useCartStore()
const authStore = useAuthStore()
const router = useRouter()
const loading = ref(false)

const detalii = ref({
  nume: '',
  telefon: '',
  adresa: ''
})

async function trimiteComanda() {
  if (cartStore.items.length === 0) return
  loading.value = true

  const comandaNoua = {
    client: detalii.value,
    produse: cartStore.items, 
    total: cartStore.totalPrice,
    data: new Date().toISOString(),
    userId: authStore.user ? authStore.user.id : null,
    status: 'Nouă'
  }

  try {
    const response = await fetch('http://localhost:3000/api/comenzi', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(comandaNoua)
    })

    const data = await response.json() 

    if (response.ok) {
      alert('Comanda a fost trimisă cu succes! 🎉')
      cartStore.clearCart() 
      router.push('/') 
    } else {
      alert(data.message || 'A apărut o eroare la trimitere.')
    }
  } catch (error) {
    console.error(error)
    alert('Eroare conexiune server.')
  } finally {
    loading.value = false
  }
}
</script>