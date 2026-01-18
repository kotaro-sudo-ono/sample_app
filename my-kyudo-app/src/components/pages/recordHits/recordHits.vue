<script setup lang="ts">
import recordSheet from './compnents/recordsheet/recordSheet.vue';
import { ref } from 'vue';
import RecordSession from '@/components/ui/recordSession/recordSession.vue';

// 状態（親で管理）
const dialogOpen = ref(false);
const savedPosition = ref<{ x: number; y: number } | undefined>(undefined);

// 子コンポーネントから選択結果を受け取る
const handleSelect = (pos: { x: number; y: number } | undefined) => {
  if (pos) {
    savedPosition.value = pos;
  }
};
</script>
<template>
  <div class="score-page">
    <RecordSession />
  </div>
</template>
<style scoped>
.score-page {
  padding: 2%;
  display: flex;
  width: 100%;
  height: 100%;
  flex-direction: column;
}
</style>
