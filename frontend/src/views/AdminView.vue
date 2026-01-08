<template>
  <v-container class="py-8 bg-grey-lighten-5 h-100" fluid>
    
    <div class="d-flex justify-space-between align-center mb-6">
      <h1 class="text-h4 font-weight-bold text-grey-darken-3">Panou Administrare</h1>
    </div>

    <v-tabs v-model="tab" color="deep-purple-accent-4" align-tabs="center" class="mb-6">
      <v-tab value="produse">📦 Produse</v-tab>
      <v-tab value="comenzi">🚚 Comenzi Clienți</v-tab>
    </v-tabs>

    <v-window v-model="tab">
      
      <v-window-item value="produse">
        <v-row class="mb-8">
          <v-col cols="12" sm="6" md="3">
            <v-card elevation="2" class="rounded-lg">
              <v-card-text class="d-flex align-center">
                <v-avatar color="deep-purple-lighten-4" size="50" class="mr-4">
                  <v-icon color="deep-purple" size="30">mdi-package-variant</v-icon>
                </v-avatar>
                <div>
                  <div class="text-caption text-grey font-weight-bold">TOTAL PRODUSE</div>
                  <div class="text-h5 font-weight-black">{{ stats.totalProduse }}</div>
                </div>
              </v-card-text>
            </v-card>
          </v-col>

          <v-col cols="12" sm="6" md="3">
            <v-card elevation="2" class="rounded-lg">
              <v-card-text class="d-flex align-center">
                <v-avatar color="green-lighten-4" size="50" class="mr-4">
                  <v-icon color="green" size="30">mdi-cash-multiple</v-icon>
                </v-avatar>
                <div>
                  <div class="text-caption text-grey font-weight-bold">VALOARE STOC</div>
                  <div class="text-h5 font-weight-black">{{ stats.valoareTotala }} RON</div>
                </div>
              </v-card-text>
            </v-card>
          </v-col>
        </v-row>

        <v-card elevation="1" class="rounded-lg border">
          <div class="d-flex justify-space-between align-center pa-4 border-b">
            <h2 class="text-h6 mb-0">Listă Produse</h2>
            <v-btn color="deep-purple-darken-1" prepend-icon="mdi-plus" elevation="2" @click="deschideDialogAdaugare">
              Adaugă Produs
            </v-btn>
          </div>

          <v-table hover>
            <thead>
              <tr class="bg-grey-lighten-4">
                <th class="text-left font-weight-bold pl-6">Imagine</th>
                <th class="text-left font-weight-bold">Nume</th>
                <th class="text-left font-weight-bold">Preț</th>
                <th class="text-left font-weight-bold">Stoc</th>
                <th class="text-center font-weight-bold pr-6">Acțiuni</th>
              </tr>
            </thead>
            <tbody>
              <tr v-for="produs in products" :key="produs.id">
                <td class="py-2 pl-6">
                  <v-avatar size="40" rounded="lg"><v-img :src="produs.image" cover></v-img></v-avatar>
                </td>
                <td class="font-weight-medium">{{ produs.name }}</td>
                <td>{{ produs.price }} RON</td>
                <td>
                  <v-chip :color="produs.stoc < 3 ? 'red' : 'green'" size="small" variant="flat">{{ produs.stoc }} buc</v-chip>
                </td>
                <td class="text-center pr-6">
                  <v-btn icon="mdi-pencil" size="small" color="blue" variant="text" @click="editeazaProdus(produs)"></v-btn>
                  <v-btn icon="mdi-delete" size="small" color="red" variant="text" @click="stergeProdus(produs.id)"></v-btn>
                </td>
              </tr>
            </tbody>
          </v-table>
        </v-card>
      </v-window-item>

      <v-window-item value="comenzi">
        <v-card elevation="1" class="rounded-lg border">
          <div class="d-flex justify-space-between align-center pa-4 border-b">
            <h2 class="text-h6 mb-0">Istoric Comenzi</h2>
            <v-btn icon="mdi-refresh" variant="text" @click="incarcaComenzi"></v-btn>
          </div>

          <v-table hover>
            <thead>
              <tr class="bg-grey-lighten-4">
                <th class="text-left font-weight-bold pl-6">Data</th>
                <th class="text-left font-weight-bold">Client</th>
                <th class="text-left font-weight-bold">Total</th>
                <th class="text-left font-weight-bold">Status</th>
                <th class="text-center font-weight-bold pr-6">Acțiuni</th>
              </tr>
            </thead>
            <tbody>
              <tr v-for="comanda in comenzi" :key="comanda.id">
                <td class="py-3 pl-6 text-caption">{{ formateazaData(comanda.data) }}</td>
                <td>
                  <div class="font-weight-bold">{{ comanda.client.nume }}</div>
                  <div class="text-caption text-grey">{{ comanda.client.telefon }}</div>
                </td>
                <td class="font-weight-bold text-deep-purple">{{ comanda.total }} RON</td>
                <td>
                  <v-chip 
                    :color="culoareStatus(comanda.status)" 
                    size="small" 
                    class="font-weight-bold"
                  >
                    {{ comanda.status || 'Nouă' }}
                  </v-chip>
                </td>
                <td class="text-center pr-6">
                  <v-btn 
                    color="deep-purple" 
                    variant="tonal" 
                    size="small" 
                    prepend-icon="mdi-eye"
                    @click="deschideDetaliiComanda(comanda)"
                  >
                    Detalii
                  </v-btn>
                </td>
              </tr>
              <tr v-if="comenzi.length === 0">
                <td colspan="5" class="text-center py-8 text-grey">Nu există comenzi încă.</td>
              </tr>
            </tbody>
          </v-table>
        </v-card>
      </v-window-item>
    </v-window>

    <v-dialog v-model="dialog" max-width="500px">
      <v-card class="rounded-lg">
        <v-card-title class="bg-deep-purple text-white">Produs</v-card-title>
        <v-card-text class="pt-4">
          <v-text-field v-model="form.name" label="Nume" variant="outlined"></v-text-field>
          <v-row>
             <v-col cols="6"><v-text-field v-model="form.price" label="Pret" type="number" variant="outlined"></v-text-field></v-col>
             <v-col cols="6"><v-text-field v-model="form.stoc" label="Stoc" type="number" variant="outlined"></v-text-field></v-col>
          </v-row>
          <v-text-field v-model="form.image" label="Imagine URL" variant="outlined"></v-text-field>
          <v-textarea v-model="form.description" label="Descriere" variant="outlined" rows="2"></v-textarea>
        </v-card-text>
        <v-card-actions class="justify-end pa-4">
          <v-btn @click="dialog = false">Anulează</v-btn>
          <v-btn color="deep-purple" variant="flat" @click="salveazaProdus">Salvează</v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>

    <v-dialog v-model="dialogComanda" max-width="600px">
      <v-card v-if="comandaSelectata" class="rounded-lg">
        <v-toolbar color="deep-purple-darken-3" dark dense>
            <v-toolbar-title>Comanda #{{ comandaSelectata.id.slice(0, 6) }}...</v-toolbar-title>
            <v-btn icon="mdi-close" variant="text" @click="dialogComanda = false"></v-btn>
        </v-toolbar>

        <v-card-text class="pa-4">
            <h3 class="text-subtitle-1 font-weight-bold mb-2">📦 Informații Livrare</h3>
            <v-sheet border rounded class="pa-3 mb-4 bg-grey-lighten-5">
                <div><strong>Nume:</strong> {{ comandaSelectata.client.nume }}</div>
                <div><strong>Telefon:</strong> {{ comandaSelectata.client.telefon }}</div>
                <div><strong>Adresa:</strong> {{ comandaSelectata.client.adresa }}</div>
            </v-sheet>

            <h3 class="text-subtitle-1 font-weight-bold mb-2">🛒 Produse Comandate</h3>
            <v-table density="compact" class="border rounded mb-4">
                <thead><tr><th>Produs</th><th>Cant.</th><th>Preț</th></tr></thead>
                <tbody>
                    <tr v-for="(prod, idx) in comandaSelectata.produse" :key="idx">
                        <td>{{ prod.name }}</td>
                        <td>x{{ prod.quantity }}</td>
                        <td>{{ prod.price * prod.quantity }} RON</td>
                    </tr>
                </tbody>
            </v-table>
            <div class="text-right text-h6 font-weight-bold mb-4">Total: {{ comandaSelectata.total }} RON</div>

            <v-divider class="mb-4"></v-divider>
            <h3 class="text-subtitle-1 font-weight-bold mb-2">Status Comandă</h3>
            <v-btn-toggle v-model="statusTemporar" color="deep-purple" mandatory divided class="w-100 mb-4">
                <v-btn value="Nouă" class="flex-grow-1">Nouă</v-btn>
                <v-btn value="Expediată" class="flex-grow-1">Expediată</v-btn>
                <v-btn value="Livrată" class="flex-grow-1">Livrată</v-btn>
                <v-btn value="Anulată" class="flex-grow-1">Anulată</v-btn>
            </v-btn-toggle>

            <v-btn block color="green" size="large" @click="actualizeazaStatus">
                Salvează Statusul
            </v-btn>
        </v-card-text>
      </v-card>
    </v-dialog>

  </v-container>
</template>

<script setup>
import { ref, onMounted, computed, watch } from 'vue'

const tab = ref('produse') // Controleaza ce tab e deschis
const products = ref([])
const comenzi = ref([]) // Lista comenzi

// Variabile Produse
const dialog = ref(false)
const esteEditare = ref(false)
const produsIdEditat = ref(null)
const form = ref({ name: '', price: '', stoc: '', category: 'Lumanari', description: '', image: '' })

const dialogComanda = ref(false)
const comandaSelectata = ref(null)
const statusTemporar = ref('Nouă')

const stats = computed(() => {
  if (products.value.length === 0) return { totalProduse: 0, valoareTotala: 0 }
  return {
    totalProduse: products.value.length,
    valoareTotala: products.value.reduce((total, p) => total + (Number(p.price) * Number(p.stoc)), 0),
  }
})

async function incarcaProduse() {
  try {
    const res = await fetch('http://localhost:3000/api/products')
    if (res.ok) products.value = await res.json()
  } catch (e) { console.error(e) }
}
function deschideDialogAdaugare() { esteEditare.value = false; form.value = {}; dialog.value = true }
function editeazaProdus(produs) { esteEditare.value = true; produsIdEditat.value = produs.id; form.value = {...produs}; dialog.value = true }
async function salveazaProdus() {
    // ... Logica de salvare produs existenta (simplificata aici pt claritate) ...
    const url = esteEditare.value ? `http://localhost:3000/api/products/${produsIdEditat.value}` : 'http://localhost:3000/api/products'
    const method = esteEditare.value ? 'PUT' : 'POST'
    await fetch(url, { method, headers: {'Content-Type': 'application/json'}, body: JSON.stringify(form.value) })
    await incarcaProduse(); dialog.value = false
}
async function stergeProdus(id) {
    if(confirm('Stergi produsul?')) { await fetch(`http://localhost:3000/api/products/${id}`, {method: 'DELETE'}); await incarcaProduse() }
}

async function incarcaComenzi() {
    try {
        const res = await fetch('http://localhost:3000/api/comenzi')
        if (res.ok) comenzi.value = await res.json()
    } catch (e) { console.error("Eroare comenzi:", e) }
}

function formateazaData(dataISO) {
    if(!dataISO) return '-'
    return new Date(dataISO).toLocaleString('ro-RO')
}

function culoareStatus(status) {
    if (!status || status === 'Nouă') return 'orange'
    if (status === 'Expediată') return 'blue'
    if (status === 'Livrată') return 'green'
    if (status === 'Anulată') return 'red'
    return 'grey'
}

function deschideDetaliiComanda(comanda) {
    comandaSelectata.value = comanda
    statusTemporar.value = comanda.status || 'Nouă'
    dialogComanda.value = true
}

async function actualizeazaStatus() {
    if(!comandaSelectata.value) return
    
    try {
        await fetch(`http://localhost:3000/api/comenzi/${comandaSelectata.value.id}`, {
            method: 'PUT',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ status: statusTemporar.value })
        })
        
        alert("Status actualizat!")
        dialogComanda.value = false
        await incarcaComenzi() 
    } catch (error) {
        alert("Eroare la actualizare.")
    }
}

watch(tab, (newVal) => {
    if (newVal === 'comenzi') {
        incarcaComenzi()
    }
})

onMounted(() => {
  incarcaProduse()
})
</script>