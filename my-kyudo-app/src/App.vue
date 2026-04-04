<script setup lang="ts">
import { ref, computed } from 'vue';
import { authStore } from './store/auth';
import GlobalSnackbar from './components/ui/globalSnackbar/GlobalSnackbar.vue';
import { useRouter, useRoute } from 'vue-router';

const useAuthStore = authStore();
const router = useRouter();
const route = useRoute();

const isLoggedIn = computed(() => useAuthStore.getIsLoggedIn);
const hideAppBar = computed(() => !!route.meta.hideAppBar);

const logout = () => {
  router.push({ name: 'homeGuest' });
  useAuthStore.logout();
};

const bottomNavValue = ref(null);

const bottomNavItems = [
  { label: 'ホーム', icon: 'mdi-home', route: 'homeDashboard' },
  { label: 'カレンダー', icon: 'mdi-calendar-month', route: 'recordCalender' },
  { label: '入力', icon: 'mdi-bullseye', route: 'recordHits' },
  { label: '履歴', icon: 'mdi-chart-bar', route: 'recordHistory' },
];

const navigateTo = (routeName: string) => {
  router.push({ name: routeName });
};
</script>

<template>
  <v-app :style="{ fontFamily: '\'Noto Serif JP\', serif' }">
    <v-app-bar v-if="!hideAppBar" color="primary" elevation="2">
      <v-app-bar-title class="app-title">弓道記録</v-app-bar-title>

      <template v-slot:append>
        <template v-if="!isLoggedIn">
          <v-btn variant="text" :to="{ name: 'signIn' }" class="guest-btn">ログイン</v-btn>
          <v-btn variant="text" :to="{ name: 'signUp' }" class="guest-btn">新規登録</v-btn>
        </template>
        <template v-else>
          <v-btn icon variant="text" @click="logout" title="ログアウト">
            <v-icon>mdi-logout</v-icon>
          </v-btn>
        </template>
      </template>
    </v-app-bar>

    <v-main :class="{ 'with-bottom-nav': isLoggedIn }">
      <router-view />
    </v-main>

    <v-bottom-navigation
      v-if="isLoggedIn"
      color="primary"
      bg-color="surface"
      elevation="8"
      grow
    >
      <v-btn
        v-for="item in bottomNavItems"
        :key="item.route"
        :active="route.name === item.route"
        @click="navigateTo(item.route)"
      >
        <v-icon>{{ item.icon }}</v-icon>
        <span>{{ item.label }}</span>
      </v-btn>
    </v-bottom-navigation>

    <GlobalSnackbar />
  </v-app>
</template>

<style>
* {
  font-family: 'Noto Serif JP', serif;
}
</style>

<style scoped>
.app-title {
  font-weight: 700;
  letter-spacing: 0.05em;
}

.guest-btn {
  font-weight: 500;
  letter-spacing: 0.05em;
}

.with-bottom-nav {
  padding-bottom: 56px;
}
</style>
