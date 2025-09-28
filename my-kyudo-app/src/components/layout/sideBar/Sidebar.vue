<script setup lang="ts">
const props = withDefaults(
  defineProps<{
    isLoggedIn?: boolean;
  }>(),
  {
    isLoggedIn: false,
  }
);
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

    <v-list-item title="ルーター"></v-list-item>
    <v-divider></v-divider>
    <template v-if="!props.isLoggedIn">
      <v-list-item link :title="'ホーム'" :to="{ name: 'homeGuest' }"></v-list-item>
      <v-list-item link :title="'ログイン'" :to="{ name: 'signIn' }"></v-list-item>
      <v-list-item link :title="'新規登録'" :to="{ name: 'signUp' }"></v-list-item>
    </template>
    <template v-else>
      <v-list-item link :title="'ホーム'" :to="{ name: 'homeDashboard' }" />
      <v-list-item link :title="'記録'" :to="{ name: 'recordCalender' }" />
      <v-list-item link :title="'入力'" :to="{ name: '' }" />
    </template>
  </v-navigation-drawer>
</template>
