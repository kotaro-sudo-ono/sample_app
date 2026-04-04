<script setup lang="ts">
import { ref } from 'vue';
import { useRouter } from 'vue-router';
import RecordSession from '@/components/ui/recordSession/recordSession.vue';
import Button from '@/components/ui/button/Button.vue';
import AiCoachDialog from '@/components/ui/aiCoachDialog/aiCoachDialog.vue';
import { useRecordHits } from './composable';

const router = useRouter();

const props = defineProps<{ sessionId?: string }>();

const activeTab = ref('edit');

const {
  editingSession,
  handleAddSession,
  handleUpdateSession,
  selectedStandIndices,
  toggleStand,
  diagnosisLoading,
  diagnosisAdviceText,
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
      <v-btn variant="text" color="primary" class="back-btn" @click="router.back()">
        <v-icon start>mdi-chevron-left</v-icon>
        戻る
      </v-btn>
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
            <!-- ローディング -->
            <div v-if="diagnosisLoading" class="diagnosis-loading">
              <v-progress-circular indeterminate color="primary" size="48" />
              <p>分析中...</p>
            </div>

            <!-- 結果 -->
            <template v-else-if="diagnosisAdviceText">
              <p class="advice-text">{{ diagnosisAdviceText }}</p>
              <Button text="再診断" color="secondary" @click-button="handleReDiagnose" />
            </template>

            <!-- 立選択（エラー時も含む） -->
            <template v-else>
              <p class="diagnosis-desc">診断に使う立を選択してください</p>
              <div class="stand-list">
                <div
                  v-for="(stand, index) in editingSession.stands"
                  :key="index"
                  class="stand-item"
                  @click="toggleStand(index)"
                >
                  <v-checkbox
                    :model-value="selectedStandIndices.includes(index)"
                    hide-details
                    density="compact"
                    color="primary"
                    @click.stop="toggleStand(index)"
                  />
                  <span class="stand-label">
                    第{{ index + 1 }}立
                    （{{ stand.arrows.filter((arrow) => arrow.hit).length }}/{{ stand.arrows.length }}中）
                  </span>
                </div>
              </div>
              <Button
                text="診断する"
                :disable="selectedStandIndices.length === 0"
                @click-button="handleDiagnose"
              />
            </template>
          </div>
        </v-tabs-window-item>
      </v-tabs-window>
    </template>

    <!-- 新規入力モード -->
    <template v-else>
      <RecordSession @add-session="handleAddSession" />
      <div class="ai-coach-btn-wrapper">
        <Button text="AIコーチに相談" color="secondary" @click-button="openAiCoachDialog" />
      </div>
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

.back-btn {
  align-self: flex-start;
  margin-bottom: 4px;
}

.diagnosis-panel {
  padding: 16px 8px;
  display: flex;
  flex-direction: column;
  gap: 16px;
}

.diagnosis-desc {
  color: #555;
  font-size: 0.9rem;
}

.stand-list {
  display: flex;
  flex-direction: column;
  gap: 4px;
}

.stand-item {
  display: flex;
  align-items: center;
  cursor: pointer;
  padding: 4px;
  border-radius: 4px;
}

.stand-item:hover {
  background-color: #f5f5f5;
}

.stand-label {
  font-size: 0.9rem;
  color: #333;
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
}

.ai-coach-btn-wrapper {
  padding: 8px 0;
}
</style>
