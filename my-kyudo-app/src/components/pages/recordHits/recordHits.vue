<script setup lang="ts">
import RecordSession from '@/components/ui/recordSession/recordSession.vue';
import AiCoachDialog from '@/components/ui/aiCoachDialog/aiCoachDialog.vue';
import { useRecordHits } from './composable';

const { handleAddSession, isAiCoachDialogOpen, openAiCoachDialog } = useRecordHits();
</script>

<template>
  <div class="score-page">
    <RecordSession @add-session="handleAddSession" />
    <v-btn class="ai-coach-btn" color="primary" variant="tonal" @click="openAiCoachDialog">
      AIコーチに相談
    </v-btn>
  </div>
  <AiCoachDialog v-model="isAiCoachDialogOpen" />
</template>

<style scoped>
.score-page {
  padding: 2%;
  display: flex;
  width: 100%;
  height: 100%;
  flex-direction: column;
}

.ai-coach-btn {
  margin-top: 12px;
  font-weight: bold;
}
</style>
