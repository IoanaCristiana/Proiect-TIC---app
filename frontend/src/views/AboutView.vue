<template>
  <v-container class="py-12">
    <v-row justify="center" align="center">
      <v-col cols="12" md="6">
        <h1 class="text-h3 font-weight-bold text-deep-purple-darken-1 mb-4" style="font-family: serif !important;">
          Povestea Noastra
        </h1>
        <p class="text-body-1 text-grey-darken-1 mb-4">
          Bine ati venit la <strong>Glow & Scent</strong>, locul unde pasiunea pentru arome naturale se intalneste cu maiestria lucrului manual.
        </p>
        <p class="text-body-1 text-grey-darken-1 mb-6">
          Totul a inceput dintr-o mica bucatarie, din dorinta de a crea lumanari care nu doar lumineaza o camera, ci ii schimba complet atmosfera. Folosim exclusiv ceara de soia 100% naturala, fitile de bumbac organic si uleiuri esentiale pure.
        </p>
        <p class="text-body-1 text-grey-darken-1 mb-6">
          Fiecare lumanare este turnata manual, cu grija si rabdare, pentru a va oferi o experienta de relaxare autentica.
        </p>
        
        <v-btn color="deep-purple-darken-1" size="large" to="/" variant="flat" class="mt-4">
          Vezi Colectia
        </v-btn>
      </v-col>

      <v-col cols="12" md="5" offset-md="1">
        <v-img 
          :src="imagineDespre" 
          alt="Despre Noi" 
          cover 
          class="rounded-xl elevation-10"
          height="400"
        ></v-img>
      </v-col>
    </v-row>
  </v-container>
</template>

<script setup>

import imagineDespre from '@/assets/atelier.jpg'
</script>