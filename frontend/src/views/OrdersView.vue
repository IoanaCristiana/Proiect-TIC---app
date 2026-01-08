<template>
  <v-container class="py-10">
    <h1 class="text-h4 mb-6 text-deep-purple-darken-1">Istoricul Comenzilor Tale</h1>

    <div v-if="loading" class="text-center mt-10">
      <v-progress-circular indeterminate color="deep-purple"></v-progress-circular>
    </div>

    <div v-else-if="comenzi.length === 0" class="text-center mt-10">
      <v-icon size="80" color="grey-lighten-2">mdi-history</v-icon>
      <h2 class="text-h5 text-grey mt-4">Nu ai plasat nicio comandă încă.</h2>
      <v-btn to="/" color="deep-purple" variant="text" class="mt-4">Vezi Produsele</v-btn>
    </div>

    <v-expansion-panels v-else variant="popout" class="mt-4">
      <v-expansion-panel v-for="comanda in comenzi" :key="comanda.id">
        
        <v-expansion-panel-title>
          <v-row no-gutters align="center">
            <v-col cols="12" sm="4">
              <strong>Data:</strong> {{ formateazaData(comanda.data) }}
            </v-col>
            <v-col cols="6" sm="4" class="text-deep-purple font-weight-bold">
              {{ comanda.total }} RON
            </v-col>
            <v-col cols="6" sm="4" class="text-right">
              <v-chip :color="culoareStatus(comanda.status)" size="small" class="font-weight-bold">
                {{ comanda.status || 'Nouă' }}
              </v-chip>
            </v-col>
          </v-row>
        </v-expansion-panel-title>

        <v-expansion-panel-text>
          <v-divider class="mb-4"></v-divider>
          
          <h4 class="text-subtitle-2 mb-2">Produse comandate:</h4>
          <v-list density="compact">
            <v-list-item v-for="(prod, idx) in comanda.produse" :key="idx" class="px-0">
              <template v-slot:prepend>
                <v-avatar size="40" rounded="lg" class="mr-3">
                  <v-img :src="prod.image" cover></v-img>
                </v-avatar>
              </template>
              <v-list-item-title class="font-weight-bold">{{ prod.name }}</v-list-item-title>
              <v-list-item-subtitle>
                {{ prod.quantity }} buc x {{ prod.price }} RON
              </v-list-item-subtitle>
            </v-list-item>
          </v-list>

          <v-divider class="my-3"></v-divider>
          
          <div class="text-caption text-grey">
            <strong>Detalii livrare:</strong><br>
            {{ comanda.client.nume }}<br>
            {{ comanda.client.adresa }}<br>
            Tel: {{ comanda.client.telefon }}
          </div>
        </v-expansion-panel-text>

      </v-expansion-panel>
    </v-expansion-panels>

  </v-container>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { useAuthStore } from '@/stores/auth'

const authStore = useAuthStore()
const comenzi = ref([])
const loading = ref(true)

onMounted(async () => {
  if (!authStore.user) return 

  try {
    const response = await fetch(`http://localhost:3000/api/comenzi-client/${authStore.user.id}`)
    if (response.ok) {
      comenzi.value = await response.json()
    }
  } catch (error) {
    console.error("Eroare istoric:", error)
  } finally {
    loading.value = false
  }
})

function formateazaData(dataISO) {
  if (!dataISO) return '-'
  return new Date(dataISO).toLocaleDateString('ro-RO', { 
    year: 'numeric', month: 'long', day: 'numeric', hour: '2-digit', minute:'2-digit' 
  })
}

function culoareStatus(status) {
    if (!status || status === 'Nouă') return 'orange'
    if (status === 'Expediată') return 'blue'
    if (status === 'Livrată') return 'green'
    if (status === 'Anulată') return 'red'
    return 'grey'
}
</script>