<template>
  <v-container class="py-10">
    <h1 class="text-h4 mb-6">Coșul de Cumpărături</h1>

    <div v-if="cartStore.items.length === 0" class="text-center py-10">
      <v-icon size="100" color="grey-lighten-2">mdi-cart-off</v-icon>
      <p class="text-h6 text-grey mt-4">Coșul tău este gol.</p>
      <v-btn color="deep-purple-lighten-2" to="/" class="mt-4">Înapoi la Produse</v-btn>
    </div>

    <v-row v-else>
      <v-col cols="12" md="8">
        <v-card elevation="2">
          <v-table>
            <thead>
              <tr>
                <th class="text-left">Produs</th>
                <th class="text-left">Preț</th>
                <th class="text-center">Acțiune</th>
              </tr>
            </thead>
            <tbody>
              <tr v-for="(item, index) in cartStore.items" :key="index">
                <td>
                  <div class="d-flex align-center py-2">
                    <v-avatar rounded="0" size="50" class="mr-3">
                      <v-img :src="item.image" cover></v-img>
                    </v-avatar>
                    {{ item.name }}
                  </div>
                </td>
                <td>{{ item.price }} RON</td>
                <td class="text-center">
                  <v-btn icon="mdi-delete" size="small" color="red-lighten-2" variant="text" @click="cartStore.removeFromCart(item.id)"></v-btn>
                </td>
              </tr>
            </tbody>
          </v-table>
          <v-divider></v-divider>
          <div class="pa-4 text-right text-h6">
            Total: <span class="text-deep-purple font-weight-bold">{{ cartStore.totalPrice }} RON</span>
          </div>
        </v-card>
      </v-col>

      <v-col cols="12" md="4">
        <v-card class="pa-4" elevation="2">
          <h3 class="text-h6 mb-4">Date Livrare</h3>
          <v-form @submit.prevent="trimiteComanda">
            <v-text-field v-model="client.nume" label="Nume Complet" variant="outlined" required></v-text-field>
            <v-text-field v-model="client.telefon" label="Telefon" variant="outlined" required></v-text-field>
            <v-textarea v-model="client.adresa" label="Adresa de Livrare" variant="outlined" rows="3" required></v-textarea>
            
            <v-divider class="my-4"></v-divider>
            
            <v-btn block color="deep-purple-darken-1" size="large" type="submit" :loading="loading">
              Trimite Comanda
            </v-btn>
          </v-form>
        </v-card>
      </v-col>
    </v-row>

    <v-snackbar v-model="snackbar" color="success">
      Comanda a fost trimisă cu succes!
      <template v-slot:actions>
        <v-btn variant="text" @click="snackbar = false">Închide</v-btn>
      </template>
    </v-snackbar>
  </v-container>
</template>

<script setup>
import { ref, reactive } from 'vue'
import { useCartStore } from '@/stores/cart'

const cartStore = useCartStore()
const loading = ref(false)
const snackbar = ref(false)

const client = reactive({
  nume: '',
  telefon: '',
  adresa: ''
})

async function trimiteComanda() {
  if (cartStore.items.length === 0) return
  
  loading.value = true
  const comanda = {
    client: client,
    produse: cartStore.items,
    total: cartStore.totalPrice,
    data: new Date().toISOString()
  }

  try {
    
  
    const response = await fetch('http://localhost:3000/api/comenzi', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(comanda)
    })

    if (response.ok) {
      //  golim cosul si aratam mesajul
      cartStore.emptyCart()
      snackbar.value = true
      // Resetam formularul
      client.nume = ''
      client.telefon = ''
      client.adresa = ''
    } else {
      alert('A aparut o eroare la server.')
    }
  } catch (error) {
    console.error(error)
    alert('Nu s-a putut conecta la server. Asigura-te ca backend-ul porneste!')
  } finally {
    loading.value = false
  }
}
</script>