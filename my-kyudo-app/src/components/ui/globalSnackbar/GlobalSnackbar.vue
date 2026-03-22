<script setup lang="ts">
import { notificationStore } from '@/store/notification';
import { storeToRefs } from 'pinia';

const store = notificationStore();
const { visible, message, type } = storeToRefs(store);
</script>

<template>
  <v-snackbar
    v-model="visible"
    :color="type"
    location="top"
    :timeout="4000"
    rounded="lg"
  >
    {{ message }}
    <template #actions>
      <v-btn variant="text" @click="store.hide()">閉じる</v-btn>
    </template>
  </v-snackbar>
</template>
