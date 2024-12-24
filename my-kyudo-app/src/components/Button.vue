<script setup lang="ts">
import { defineProps, withDefaults } from 'vue';

interface Props {
  text: string;
}

// `props` にデフォルト値を設定
const props = withDefaults(defineProps<Props>(), {
  disable: false,
  text: '',
});
const emit = defineEmits<{
  (e: 'clickButton'): void;
}>();
const clickButton = () => {
  emit('clickButton');
  console.log('clickButton');
};
</script>

<template>
  <div class="button">
    <button @click="clickButton">{{ props.text }}</button>
  </div>
</template>

<style scoped>
.button {
  border: 1px solid #1867c0;
  background-color: #1867c0;
  color: aliceblue;
  border-radius: 18px;
  display: flex;
  justify-content: center;
  padding: 5px;
}
</style>
