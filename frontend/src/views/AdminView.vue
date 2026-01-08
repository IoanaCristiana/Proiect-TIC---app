<template>
  <v-container class="py-10">
    <h1 class="text-h4 text-deep-purple-darken-1 mb-6">Panou Administrare</h1>

    <v-tabs v-model="tab" color="deep-purple-darken-1" bg-color="deep-purple-lighten-5">
      <v-tab value="comenzi">📦 Comenzi</v-tab>
      <v-tab value="produse">🕯️ Gestiune Produse</v-tab>
    </v-tabs>

    <v-window v-model="tab" class="mt-6">
      
      <v-window-item value="comenzi">
        <v-row class="mb-6">
          <v-col cols="12" sm="6" md="4">
            <v-card color="deep-purple-lighten-4" class="pa-4">
              <div class="text-caption font-weight-bold">TOTAL COMENZI</div>
              <div class="text-h4 font-weight-bold">{{ comenzi.length }}</div>
            </v-card>
          </v-col>
          <v-col cols="12" sm="6" md="4">
            <v-card color="teal-lighten-4" class="pa-4">
              <div class="text-caption font-weight-bold">TOTAL VÂNZĂRI</div>
              <div class="text-h4 font-weight-bold">{{ totalVanzari }} RON</div>
            </v-card>
          </v-col>
        </v-row>

        <v-card elevation="3">
          <v-table>
            <thead>
              <tr class="bg-grey-lighten-3">
                <th>Data</th>
                <th>Client</th>
                <th>Produse</th>
                <th>Total</th>
                <th>Acțiuni</th>
              </tr>
            </thead>
            <tbody>
              <tr v-for="comanda in comenzi" :key="comanda.id">
                <td>{{ formateazaData(comanda.data) }}</td>
                <td>{{ comanda.client.nume }}<br><span class="text-caption text-grey">{{ comanda.client.telefon }}</span></td>
                <td><div v-for="p in comanda.produse" :key="p.id" class="text-caption">• {{ p.name }}</div></td>
                <td>{{ comanda.total }} RON</td>
                <td><v-btn icon="mdi-delete" size="small" color="red" variant="text" @click="stergeComanda(comanda.id)"></v-btn></td>
              </tr>
            </tbody>
          </v-table>
        </v-card>
      </v-window-item>


      <v-window-item value="produse">
        
        <v-card class="mb-8 pa-4 border-s-lg border-deep-purple" elevation="2">
          <h3 class="text-h6 mb-4">Adaugă Produs Nou</h3>
          <v-form @submit.prevent="adaugaProdus">
            <v-row>
              <v-col cols="12" md="3"><v-text-field v-model="produsNou.name" label="Nume Produs" variant="outlined" density="compact"></v-text-field></v-col>
              <v-col cols="12" md="2"><v-text-field v-model="produsNou.price" label="Preț (RON)" type="number" variant="outlined" density="compact"></v-text-field></v-col>
              <v-col cols="12" md="2"><v-text-field v-model="produsNou.stoc" label="Stoc (buc)" type="number" variant="outlined" density="compact"></v-text-field></v-col>
              <v-col cols="12" md="3"><v-text-field v-model="produsNou.category" label="Categorie" variant="outlined" density="compact"></v-text-field></v-col>
              <v-col cols="12" md="2"><v-btn type="submit" color="deep-purple" block height="40">Adaugă</v-btn></v-col>
            </v-row>
             <v-text-field v-model="produsNou.description" label="Descriere" variant="outlined" density="compact"></v-text-field>
            <v-text-field v-model="produsNou.image" label="Link Imagine (URL)" placeholder="https://..." variant="outlined" density="compact"></v-text-field>
          </v-form>
        </v-card>

        <v-card elevation="3">
          <v-table>
            <thead>
              <tr class="bg-amber-lighten-4">
                <th>Imagine</th>
                <th>Nume</th>
                <th style="width: 120px;">Preț (RON)</th>
                <th style="width: 120px;">Stoc (buc)</th>
                <th>Acțiuni</th>
              </tr>
            </thead>
            <tbody>
              <tr v-for="produs in produse" :key="produs.id">
                <td><v-img :src="produs.image" width="40" height="40" cover class="rounded"></v-img></td>
                <td>{{ produs.name }}</td>
                
                <td>
                  <v-text-field 
                    v-model="produs.price" 
                    type="number" density="compact" variant="underlined" hide-details 
                    @change="actualizeazaProdus(produs)"
                  ></v-text-field>
                </td>
                <td>
                  <v-text-field 
                    v-model="produs.stoc" 
                    type="number" density="compact" variant="underlined" hide-details 
                    @change="actualizeazaProdus(produs)"
                    :color="produs.stoc < 5 ? 'red' : 'primary'"
                  ></v-text-field>
                </td>
                
                <td>
                  <v-btn icon="mdi-delete" size="small" color="grey" variant="text" @click="stergeProdus(produs.id)"></v-btn>
                </td>
              </tr>
            </tbody>
          </v-table>
        </v-card>

      </v-window-item>
    </v-window>

  </v-container>
</template>

<script setup>
import { ref, onMounted, computed } from 'vue'

const tab = ref('comenzi')
const comenzi = ref([])
const produse = ref([])

// Date pentru formularul nou
const produsNou = ref({
  name: '', price: '', stoc: 10, category: '', description: '', image: 'https://via.placeholder.com/150'
})


const totalVanzari = computed(() => comenzi.value.reduce((s, c) => s + c.total, 0))
function formateazaData(isoString) { return isoString ? new Date(isoString).toLocaleString('ro-RO') : '-' }

async function incarcaDate() {

  const resComenzi = await fetch('http://localhost:3000/api/comenzi')
  if (resComenzi.ok) comenzi.value = await resComenzi.json()

 
  const resProduse = await fetch('http://localhost:3000/api/products')
  if (resProduse.ok) produse.value = await resProduse.json()
}

async function stergeComanda(id) {
  if(confirm('Stergi comanda?')) {
    await fetch(`http://localhost:3000/api/comenzi/${id}`, { method: 'DELETE' })
    incarcaDate()
  }
}


async function adaugaProdus() {
  await fetch('http://localhost:3000/api/products', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(produsNou.value)
  })
  // Reset form
  produsNou.value = { name: '', price: '', stoc: 10, category: '', description: '', image: 'https://via.placeholder.com/150' }
  incarcaDate() // Refresh la lista
}

async function actualizeazaProdus(produs) {
  await fetch(`http://localhost:3000/api/products/${produs.id}`, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ price: produs.price, stoc: produs.stoc })
  })
  console.log('Produs actualizat!')
}

async function stergeProdus(id) {
  if(confirm('Stergi acest produs definitiv?')) {
    await fetch(`http://localhost:3000/api/products/${id}`, { method: 'DELETE' })
    incarcaDate()
  }
}

onMounted(incarcaDate)
</script>