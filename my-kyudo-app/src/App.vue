<script setup lang="ts">
import { ref, computed } from 'vue';
import { authStore } from './store/auth';
import Sidebar from './components/layout/sideBar/Sidebar.vue';
import { useRouter } from 'vue-router';

const useAuthStore = authStore();
const router = useRouter();

const drawer = ref(true);
const draw = () => (drawer.value = !drawer.value);

// Pinia の getter を computed で監視
const isLoggedIn = computed(() => useAuthStore.getIsLoggedIn);

// ログアウト処理
const logout = () => {
  router.push({ name: 'homeGuest' });
  useAuthStore.logout();
};
</script>

<template>
  <v-app>
    <v-app-bar color="primary">
      <template v-slot:prepend>
        <v-app-bar-nav-icon @click="draw" />
      </template>

      <v-app-bar-title>的中管理アプリ</v-app-bar-title>

      <template v-slot:append>
        <template v-if="!isLoggedIn">
          <v-btn :to="{ name: 'signUp' }">新規登録</v-btn>
          <v-btn :to="{ name: 'signIn' }">ログイン</v-btn>
          <v-btn :to="{ name: 'homeGuest' }">
            <v-icon>mdi-home</v-icon>
          </v-btn>
        </template>
        <template v-else>
          <v-btn @click="logout">ログアウト</v-btn>
          <v-btn :to="{ name: 'homeDashboard' }">
            <v-icon>mdi-home</v-icon>
          </v-btn>
        </template>
      </template>
    </v-app-bar>

    <Sidebar v-model="drawer" :is-logged-in="isLoggedIn"/>

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
