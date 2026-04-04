<script setup lang="ts">
import DialogTemplate from '@/components/ui/dialogTemplate/DialogTemplate.vue';
import Button from '@/components/ui/button/Button.vue';
import { useAiCoachDialog } from './composable';
import { getTypeName, type PracticeType } from '@/types/practiceType';

const open = defineModel<boolean>({ default: false });

const {
  isLoading,
  adviceText,
  errorMessage,
  selectedSessionIds,
  allSessions,
  toggleSession,
  handleAnalyze,
  handleReAnalyze,
} = useAiCoachDialog(open);
</script>

<template>
  <DialogTemplate
    dialogTitle="AIコーチに相談"
    :model-value="open"
    :width="90"
    @cancel="open = false"
  >
    <template #content>
      <!-- セッション選択画面 -->
      <div v-if="!isLoading && !adviceText && !errorMessage">
        <div v-if="allSessions.length === 0" class="empty-message">
          <p>練習データがありません</p>
        </div>
        <div v-else>
          <p class="select-label">分析したい練習記録を選択してください</p>
          <div class="session-list">
            <div
              v-for="session in allSessions"
              :key="session.id"
              class="session-item"
              @click="toggleSession(session.id)"
            >
              <v-checkbox
                :model-value="selectedSessionIds.includes(session.id)"
                hide-details
                density="compact"
                @click.stop="toggleSession(session.id)"
              />
              <span class="session-info">
                {{ session.date.substring(0, 10) }}
                &nbsp;|&nbsp;
                {{ getTypeName(session.sessionTypeId as PracticeType) }}
                &nbsp;|&nbsp;
                {{ session.totalHits }}/{{ session.totalArrows }}中
                （{{ session.totalArrows > 0 ? Math.round((session.totalHits / session.totalArrows) * 100) : 0 }}%）
              </span>
            </div>
          </div>
        </div>
      </div>

      <!-- ローディング -->
      <div v-else-if="isLoading" class="loading-container">
        <v-progress-circular indeterminate color="primary" size="48" />
        <p class="loading-text">分析中...</p>
      </div>

      <!-- エラー -->
      <div v-else-if="errorMessage">
        <v-alert type="error" :text="errorMessage" />
      </div>

      <!-- 分析結果 -->
      <div v-else>
        <p class="advice-text">{{ adviceText }}</p>
      </div>
    </template>

    <template #close>
      <div class="close-buttons">
        <Button
          v-if="adviceText || errorMessage"
          text="再分析"
          color="secondary"
          @click-button="handleReAnalyze"
        />
        <Button
          v-if="!isLoading && !adviceText && !errorMessage"
          text="分析する"
          :disable="selectedSessionIds.length === 0"
          @click-button="handleAnalyze"
        />
        <Button text="閉じる" color="error" @click-button="open = false" />
      </div>
    </template>
  </DialogTemplate>
</template>

<style scoped>
.select-label {
  font-size: 0.9rem;
  color: #555;
  margin-bottom: 8px;
}

.session-list {
  max-height: 300px;
  overflow-y: auto;
}

.session-item {
  display: flex;
  align-items: center;
  cursor: pointer;
  padding: 2px 0;
}

.session-item:hover {
  background-color: #f5f5f5;
  border-radius: 4px;
}

.session-info {
  font-size: 0.85rem;
  color: #333;
}

.empty-message {
  padding: 16px 0;
  color: #888;
}

.loading-container {
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 24px 0;
  gap: 12px;
}

.loading-text {
  color: #555;
}

.advice-text {
  white-space: pre-wrap;
  text-align: left;
  font-size: 0.9rem;
  line-height: 1.6;
  padding: 4px;
}

.close-buttons {
  display: flex;
  flex-direction: column;
  gap: 8px;
  width: 100%;
  padding-top: 8px;
}
</style>
