<script setup lang="ts">
import { ref } from 'vue';
import RecordSession from '@/components/ui/recordSession/recordSession.vue';
import AiCoachDialog from '@/components/ui/aiCoachDialog/aiCoachDialog.vue';
import Button from '@/components/ui/button/Button.vue';
import { useRecordHits } from './composable';

const activeTab = ref('edit');

const props = defineProps<{ sessionId?: string }>();

const {
  editingSession,
  handleAddSession,
  handleUpdateSession,
  diagnosisLoading,
  diagnosisAdviceText,
  diagnosisErrorMessage,
  handleDiagnose,
  handleReDiagnose,
  isAiCoachDialogOpen,
  openAiCoachDialog,
} = useRecordHits(props.sessionId);
</script>

<template>
  <div class="score-page">
    <!-- 編集モード: タブ（編集 | 診断） -->
    <template v-if="editingSession">
      <v-tabs v-model="activeTab" grow>
        <v-tab value="edit">編集</v-tab>
        <v-tab value="diagnosis">診断</v-tab>
      </v-tabs>
      <v-tabs-window v-model="activeTab">
        <v-tabs-window-item value="edit">
          <RecordSession :edit-session="editingSession" @update-session="handleUpdateSession" />
        </v-tabs-window-item>
        <v-tabs-window-item value="diagnosis">
          <div class="diagnosis-panel">
            <!-- 未診断 -->
            <div v-if="!diagnosisLoading && !diagnosisAdviceText && !diagnosisErrorMessage" class="diagnosis-start">
              <p class="diagnosis-desc">このセッションの的中パターンをAIが分析します</p>
              <Button text="診断する" @click-button="handleDiagnose" />
            </div>

            <!-- ローディング -->
            <div v-else-if="diagnosisLoading" class="diagnosis-loading">
              <v-progress-circular indeterminate color="primary" size="48" />
              <p>分析中...</p>
            </div>

            <!-- エラー -->
            <div v-else-if="diagnosisErrorMessage">
              <v-alert type="error" :text="diagnosisErrorMessage" class="mb-4" />
              <Button text="再診断" @click-button="handleReDiagnose" />
            </div>

            <!-- 結果 -->
            <div v-else>
              <p class="advice-text">{{ diagnosisAdviceText }}</p>
              <Button text="再診断" color="secondary" @click-button="handleReDiagnose" />
            </div>
          </div>
        </v-tabs-window-item>
      </v-tabs-window>
    </template>

    <!-- 新規入力モード -->
    <template v-else>
      <RecordSession @add-session="handleAddSession" />
      <v-btn class="ai-coach-btn" color="primary" variant="tonal" @click="openAiCoachDialog">
        AIコーチに相談
      </v-btn>
    </template>
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

.diagnosis-panel {
  padding: 16px 8px;
  display: flex;
  flex-direction: column;
  gap: 16px;
}

.diagnosis-start {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 16px;
  padding: 24px 0;
}

.diagnosis-desc {
  color: #555;
  font-size: 0.9rem;
}

.diagnosis-loading {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 12px;
  padding: 24px 0;
  color: #555;
}

.advice-text {
  white-space: pre-wrap;
  text-align: left;
  font-size: 0.9rem;
  line-height: 1.6;
  margin-bottom: 16px;
}
</style>
