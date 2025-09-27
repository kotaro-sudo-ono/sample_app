<script setup lang="ts">
import { defineProps, withDefaults } from 'vue';

interface Props {
  text?: string;
  disable?: boolean;
  color?: string; // テーマカラー切り替え
}

const props = withDefaults(defineProps<Props>(), {
  text: '',
  disable: false,
  color: 'primary',
});

const emit = defineEmits<{
  (e: 'clickButton'): void;
}>();

const clickButton = () => {
  if (!props.disable) {
    emit('clickButton');
    console.log('clickButton');
  }
};
</script>

<template>
  <v-btn
    block
    rounded="lg"
    :color="props.color"
    :disabled="props.disable"
    class="main-btn"
    @click="clickButton"
  >
    {{ props.text }}
  </v-btn>
</template>

<style scoped>
.main-btn {
  font-weight: bold;
  padding: 10px;
}

.main-btn:active {
  transform: scale(0.97);
  transition: transform 0.1s;
}
</style>
