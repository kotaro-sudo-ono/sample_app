<script setup lang="ts">
import { ref } from 'vue';
import Sidebar from './components/app-sidebar/Sidebar.vue';

const drawer = ref(true);
const draw = () => {
  drawer.value = !drawer.value;
  console.log(drawer.value);
};
</script>
<template>
  <v-app>
    <v-app-bar color="primary">
      <template v-slot:prepend>
        <v-icon></v-icon>
        <v-app-bar-nav-icon @click="draw"></v-app-bar-nav-icon>
      </template>

      <v-app-bar-title> 的中管理アプリ </v-app-bar-title>

      <template v-slot:append>
        <v-btn to="signUp"> signUp </v-btn>
        <v-btn to="signIn"> signIn</v-btn>

        <v-btn to="/">
          <v-icon> mdi-home </v-icon>
        </v-btn>
      </template>
    </v-app-bar>

    <Sidebar v-model="drawer" />

    <v-main class="content">
      <router-view />
    </v-main>
  </v-app>
</template>

<style scoped>
.content {
  justify-items: center;
}
</style>
