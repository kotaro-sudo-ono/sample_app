<script setup lang="ts">
import { useRecordHistory } from './composable';
import RecordCalender from '@/components/pages/recordCalender/recordCalender.vue';

const {
  view,
  selectedMonth,
  monthlySummaries,
  loading,
  errorMessage,
  periodOptions,
  selectedPeriod,
  fetchSummary,
  formatMonth,
  formatHitRate,
  onMonthClick,
  backToSummary,
} = useRecordHistory();
</script>

<template>
  <div class="record-history">
    <!-- カレンダービュー -->
    <template v-if="view === 'calendar'">
      <div class="back-bar pa-2">
        <v-btn variant="text" prepend-icon="mdi-chevron-left" @click="backToSummary">
          サマリーに戻る
        </v-btn>
      </div>
      <RecordCalender :initial-month="selectedMonth" />
    </template>

    <!-- サマリービュー -->
    <template v-else>
      <div class="pa-4">
        <v-select
          v-model="selectedPeriod"
          :items="periodOptions"
          item-title="label"
          item-value="value"
          label="表示期間"
          variant="outlined"
          density="comfortable"
          hide-details
          class="mb-4"
          @update:model-value="fetchSummary"
        />

        <div v-if="loading" class="text-center pa-8">
          <v-progress-circular indeterminate color="primary" />
        </div>
        <div v-else-if="errorMessage" class="text-center pa-4 text-error">
          {{ errorMessage }}
        </div>
        <div v-else-if="monthlySummaries.length === 0" class="text-center pa-8 text-grey">
          <v-icon size="48">mdi-note-off-outline</v-icon>
          <p>記録がありません</p>
        </div>
        <div v-else>
          <div
            v-for="item in monthlySummaries"
            :key="item.month"
            class="summary-row mb-4"
            @click="onMonthClick(item.month)"
          >
            <div class="d-flex justify-space-between align-center mb-1">
              <span class="month-label">{{ formatMonth(item.month) }}</span>
              <span class="hit-label">
                {{ item.hitCount }}/{{ item.totalShots }}本
                &nbsp;{{ formatHitRate(item.hitRate) }}
              </span>
              <v-icon size="20" color="grey">mdi-chevron-right</v-icon>
            </div>
            <v-progress-linear
              :model-value="item.hitRate * 100"
              color="green"
              bg-color="grey-lighten-3"
              rounded
              height="12"
            />
          </div>
        </div>
      </div>
    </template>
  </div>
</template>

<style scoped>
.record-history {
  width: 100%;
  max-width: 600px;
  margin: 0 auto;
}

.back-bar {
  border-bottom: 1px solid #e0e0e0;
}

.summary-row {
  cursor: pointer;
  padding: 8px;
  border-radius: 8px;
  transition: background-color 0.15s;
}

.summary-row:hover {
  background-color: #f5f5f5;
}

.month-label {
  font-weight: bold;
  font-size: 1rem;
}

.hit-label {
  font-size: 0.95rem;
  color: #555;
}
</style>
