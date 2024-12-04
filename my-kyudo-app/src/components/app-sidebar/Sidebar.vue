<script setup lang="ts">
const drawe = defineModel<boolean>();
</script>

<template>
  s
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
    <v-list-item link title="login" to="/login"></v-list-item>
  </v-navigation-drawer>
</template>
