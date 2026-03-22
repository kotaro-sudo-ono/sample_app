<script setup lang="ts">
import Button from '@/components/ui/button/Button.vue';
import { useRoutePage } from './composable';

const { toRecordCalender, toRecordHits, toRecordHistory } = useRoutePage();
</script>

<template>
  <v-container>
    <v-row>
      <v-col cols="12" sm="6" md="4">
        <Button class="big-btn" text="記録確認" @click-button="toRecordCalender" />
      </v-col>

      <v-col cols="12" sm="6" md="4">
        <Button class="big-btn" text="記録入力" @click-button="toRecordHits" />
      </v-col>

      <v-col cols="12" sm="6" md="4">
        <Button class="big-btn" text="記録を見る" @click-button="toRecordHistory" />
      </v-col>
    </v-row>
  </v-container>
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
  height: 80px; /* デカい高さ */
  font-size: larger;
  font-weight: bold;
  display: flex;
  justify-content: center;
  align-items: center;
}
</style>
