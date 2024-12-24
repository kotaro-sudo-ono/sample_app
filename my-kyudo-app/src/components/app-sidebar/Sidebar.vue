<script setup lang="ts">
const drawe = defineModel<boolean>();
</script>

<template>
  <v-navigation-drawer
    v-model="drawe"
    :width="160"
    :location="$vuetify.display.mobile ? 'bottom' : undefined"
    temporary
  >
    <!-- <router-view /> -->

    <v-list-item title="My Application" subtitle="Vuetify"></v-list-item>
    <v-divider></v-divider>
    <v-list-item link title="hpme" to="/"></v-list-item>
    <v-list-item link title="logIn" to="/logIn"></v-list-item>
  </v-navigation-drawer>
</template>
