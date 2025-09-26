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

    <v-list-item title="ルーター"></v-list-item>
    <v-divider></v-divider>
    <v-list-item link :title="'ホーム'" :to="{ name: 'homeGuest' }"></v-list-item>
    <v-list-item link :title="'ログイン'" :to="{ name: 'signIn' }"></v-list-item>
    <v-list-item link :title="'新規登録'" :to="{ name: 'signUp' }"></v-list-item>
  </v-navigation-drawer>
</template>
