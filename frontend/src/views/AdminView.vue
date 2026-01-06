<template>
  <v-container class="py-10">
    <h1 class="text-h4 mb-6 text-deep-purple-darken-1">Panou Administrare</h1>

    <v-card elevation="3">
      <v-card-title>Lista Comenzi Primite</v-card-title>
      
      <v-table density="comfortable">
        <thead>
          <tr class="bg-deep-purple-lighten-5">
            <th class="text-left font-weight-bold">Data</th>
            <th class="text-left font-weight-bold">Client</th>
            <th class="text-left font-weight-bold">Produse Comandate</th>
            <th class="text-left font-weight-bold">Total</th>
            <th class="text-left font-weight-bold">Adresă</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="comanda in comenzi" :key="comanda.id">
            <td class="text-caption">{{ formateazaData(comanda.data) }}</td>
            
            <td>
              <div class="font-weight-bold">{{ comanda.client.nume }}</div>
              <div class="text-caption text-grey">{{ comanda.client.telefon }}</div>
            </td>

            <td>
              <div v-for="produs in comanda.produse" :key="produs.id" class="text-body-2">
                • {{ produs.name }} ({{ produs.price }} RON)
              </div>
            </td>

            <td>
              <v-chip color="green" size="small" variant="flat">
                {{ comanda.total }} RON
              </v-chip>
            </td>

            <td class="text-caption" style="max-width: 200px;">
              {{ comanda.client.adresa }}
            </td>
          </tr>
        </tbody>
      </v-table>

      <div v-if="comenzi.length === 0" class="text-center py-5 text-grey">
        Nu exista comenzi momentan.
      </div>
    </v-card>
  </v-container>
</template>

<script setup>
import { ref, onMounted } from 'vue'

const comenzi = ref([])

function formateazaData(isoString) {
  if (!isoString) return '-'
  return new Date(isoString).toLocaleString('ro-RO')
}

onMounted(async () => {
  try {
    const response = await fetch('http://localhost:3000/api/comenzi')
    if (response.ok) {
      comenzi.value = await response.json()
    }
  } catch (error) {
    console.error("Nu am putut incarca comenzile", error)
  }
})
</script>