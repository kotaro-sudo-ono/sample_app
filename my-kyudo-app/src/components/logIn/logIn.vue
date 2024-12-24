<script setup>
import { ref } from 'vue';
import Dialog from '../Dialog.vue';
import PageTemplate from '../PageTemplate.vue';
import Button from '../Button.vue';

const visible = ref(false); // ダイアログの表示状態
const openDialog = () => {
  console.log('Button clicked');
  visible.value = !visible.value;
};
</script>

<template>
  <PageTemplate>
    <template #top-left>
      <Button @click="openDialog" :text="'ダイアログを使用する'" />
    </template>
    <template #content-center>
      <Dialog v-if="visible" />
    </template>
  </PageTemplate>
</template>

<style scoped></style>
