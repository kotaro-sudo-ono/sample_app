<script setup lang="ts">
import { ref } from 'vue';
import RecordSession from '@/components/ui/recordSession/recordSession.vue';
import { practiceStore } from '@/store/practice';

const store = practiceStore();
const savedMessage = ref('');

const handleAddSession = (session: {
  date: string;
  stands: { arrows: { hit: boolean; position?: { x: number; y: number } }[] }[];
  notes: string;
  sessionTypeId: number;
}) => {
  store.addSession(session);
  savedMessage.value = '記録を保存しました';
  setTimeout(() => (savedMessage.value = ''), 3000);
};
</script>
<template>
  <div class="score-page">
    <v-alert v-if="savedMessage" type="success" variant="tonal" closable class="mb-4">
      {{ savedMessage }}
    </v-alert>
    <RecordSession @add-session="handleAddSession" />
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
