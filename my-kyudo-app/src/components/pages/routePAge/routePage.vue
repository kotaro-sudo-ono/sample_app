<script setup lang="ts">
import Button from '@/components/ui/button/Button.vue';
import { useRouter } from 'vue-router';

const router = useRouter();

const toRecordCalender = () => {
  router.push({ name: 'recordCalender' });
};
</script>

<template>
  <div class="button-group">
    <Button class="big-btn" text="記録" @click-button="toRecordCalender" />
    <Button class="big-btn" text="入力" />
  </div>
</template>

<style scoped>
.button-group {
  display: flex;
  justify-content: center; /* 全体を中央寄せ */
  gap: 20%; /* ボタン同士の間隔を%で */
  margin: 10%; /* 外側の余白 */
}

.big-btn {
  flex: 1; /* 均等に広がる */
  max-width: 40%; /* 幅は最大40% */
  height: 160px; /* デカい高さ */
  font-size: 2rem;
  font-weight: bold;
  display: flex;
  justify-content: center;
  align-items: center;
}
</style>
