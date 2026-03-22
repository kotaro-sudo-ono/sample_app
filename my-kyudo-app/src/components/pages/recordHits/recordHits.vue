<script setup lang="ts">
import RecordSession from '@/components/ui/recordSession/recordSession.vue';
import { useRecordHits } from './composable';

const { savedMessage, handleAddSession } = useRecordHits();
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
