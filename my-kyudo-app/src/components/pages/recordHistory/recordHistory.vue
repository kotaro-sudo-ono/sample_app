<script setup lang="ts">
import { useRecordHistory } from './composable';

const {
  activeTab,
  monthlySummaries,
  records,
  loading,
  errorMessage,
  formatMonth,
  formatDate,
  formatHitRate,
} = useRecordHistory();
</script>

<template>
  <div class="record-history">
    <v-tabs v-model="activeTab" color="primary" align-tabs="center">
      <v-tab value="summary">サマリー</v-tab>
      <v-tab value="history">履歴</v-tab>
    </v-tabs>

    <v-window v-model="activeTab" class="tab-content">
      <!-- サマリータブ -->
      <v-window-item value="summary">
        <div class="pa-4">
          <div v-if="loading" class="text-center pa-8">
            <v-progress-circular indeterminate color="primary" />
          </div>
          <div v-else-if="errorMessage" class="text-center pa-4 text-error">
            {{ errorMessage }}
          </div>
          <div v-else>
            <div
              v-for="item in monthlySummaries"
              :key="item.month"
              class="summary-row mb-4"
            >
              <div class="d-flex justify-space-between align-center mb-1">
                <span class="month-label">{{ formatMonth(item.month) }}</span>
                <span class="hit-label">
                  {{ item.hitCount }}/{{ item.totalShots }}本
                  &nbsp;{{ formatHitRate(item.hitRate) }}
                </span>
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
      </v-window-item>

      <!-- 履歴タブ -->
      <v-window-item value="history">
        <div class="pa-4">
          <div v-if="loading" class="text-center pa-8">
            <v-progress-circular indeterminate color="primary" />
          </div>
          <div v-else-if="errorMessage" class="text-center pa-4 text-error">
            {{ errorMessage }}
          </div>
          <div v-else-if="records.length === 0" class="text-center pa-8 text-grey">
            <v-icon size="48">mdi-note-off-outline</v-icon>
            <p>記録がないでござる</p>
          </div>
          <v-expansion-panels v-else variant="accordion">
            <v-expansion-panel
              v-for="record in records"
              :key="record.recordId"
            >
              <v-expansion-panel-title>
                <div class="d-flex justify-space-between align-center w-100 pr-2">
                  <span class="date-label">{{ formatDate(record.practiceDate) }}</span>
                  <span class="type-label">{{ record.practiceType ?? '不明' }}</span>
                  <span class="score-label">{{ record.hitCount }}/{{ record.totalShots }}本</span>
                </div>
              </v-expansion-panel-title>
              <v-expansion-panel-text>
                <div class="arrow-pattern">
                  <span
                    v-for="arrow in record.arrows"
                    :key="arrow.arrowId"
                    :style="{ color: arrow.isHit ? 'green' : 'gray', fontSize: '1.2em' }"
                  >
                    {{ arrow.isHit ? '●' : '○' }}
                  </span>
                  <span v-if="record.arrows.length === 0" class="text-grey text-body-2">
                    矢データなし
                  </span>
                </div>
              </v-expansion-panel-text>
            </v-expansion-panel>
          </v-expansion-panels>
        </div>
      </v-window-item>
    </v-window>
  </div>
</template>

<style scoped>
.record-history {
  width: 100%;
  max-width: 600px;
  margin: 0 auto;
}

.tab-content {
  min-height: 400px;
}

.month-label {
  font-weight: bold;
  font-size: 1rem;
}

.hit-label {
  font-size: 0.95rem;
  color: #555;
}

.date-label {
  font-weight: 500;
  min-width: 100px;
}

.type-label {
  color: #666;
  font-size: 0.9rem;
}

.score-label {
  font-weight: bold;
  color: #2e7d32;
}

.arrow-pattern {
  letter-spacing: 4px;
  padding: 8px 0;
}
</style>
