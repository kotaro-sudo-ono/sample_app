<script setup lang="ts">
import RecordSession from '@/components/ui/recordSession/recordSession.vue';
import { useRecordHits } from './composable';

const { handleAddSession } = useRecordHits();
</script>

<template>
  <div class="score-page">
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
