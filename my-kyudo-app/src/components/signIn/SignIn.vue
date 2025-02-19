<script setup>
import { ref } from 'vue';
import DialogTemplate from '../shared/dialogTemplate/DialogTemplate.vue';
import PageTemplate from '../shared/pageTemplate/PageTemplate.vue';
import Button from '../shared/button/Button.vue';

const visible = ref(false);
const showDialog = () => {
  console.log('Button clicked');
  visible.value = !visible.value;
};
</script>

<template>
  <PageTemplate>
    <template #top-left>
      <Button @click="showDialog" :text="'Sing Inダイアログを開く'" />
    </template>
    <template #content-center>
      <DialogTemplate v-if="visible" :model-value="visible" dialog-title="Sign In" @cancel="showDialog"/>
    </template>
  </PageTemplate>
</template>

<style scoped></style>
