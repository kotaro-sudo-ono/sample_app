<script setup lang="ts">
import { ref, computed } from 'vue';
import Button from '@/components/ui/button/Button.vue';
import { CalendarTimestamp } from 'vuetify/lib/labs/VCalendar/types.mjs';
import DialogTemplate from '@/components/ui/dialogTemplate/DialogTemplate.vue';
import { practiceStore, type PracticeSession } from '@/store/practice';
import { getTypeName, type PracticeType } from '@/types/practiceType';

const store = practiceStore();

// カレンダーの表示タイプ
const type = ref<'month' | 'week' | 'day'>('month');
const types = ['month', 'week', 'day'] as const;

// イベント重なりモード
const mode = ref<'stack' | 'column'>('stack');

// カレンダー表示範囲の日付
const calendarViewDate = ref<string>('');

// 選択中の日付
const selectedDate = ref<string | undefined>(undefined);
const showDialog = computed(() => selectedDate.value !== undefined);

// 選択日のセッション一覧
const selectedSessions = computed<PracticeSession[]>(() => {
  if (!selectedDate.value) return [];
  return store.getSessionsByDate(selectedDate.value);
});

// 現在表示中の期間
const currentPeriod = computed(() => {
  const date = calendarViewDate.value ? new Date(calendarViewDate.value) : new Date();
  switch (type.value) {
    case 'month':
      return `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}`;
    case 'week':
    case 'day':
      return date.toISOString().substring(0, 10);
  }
});

// 表示期間を移動する
const movePeriod = (offset: number) => {
  const date = new Date(calendarViewDate.value);

  switch (type.value) {
    case 'month':
      date.setMonth(date.getMonth() + offset);
      break;
    case 'week':
      date.setDate(date.getDate() + offset * 7);
      break;
    case 'day':
      date.setDate(date.getDate() + offset);
      break;
  }

  calendarViewDate.value = date.toISOString().substring(0, 10);
};

// 日付クリック処理（常に1日だけ選択）
const onDateClick = (_event: Event, timestamp: CalendarTimestamp) => {
  if (selectedDate.value === timestamp.date) {
    selectedDate.value = undefined;
  } else {
    selectedDate.value = timestamp.date;
  }
};

// ダイアログ閉じる
const clearSelectDate = () => {
  selectedDate.value = undefined;
};

// セッション削除
const deleteSession = (id: string) => {
  store.deleteSession(id);
};

// 的中率フォーマット
const formatAccuracy = (session: PracticeSession) => {
  if (session.totalArrows === 0) return '0.0';
  return ((session.totalHits / session.totalArrows) * 100).toFixed(1);
};
</script>

<template>
  <div class="calendar">
    <!-- カレンダー上部ヘッダー -->
    <v-sheet class="calendar-header d-flex" tile>
      <Button icon="mdi-chevron-left" @clickButton="movePeriod(-1)" class="calendar-btn" />
      <div class="current-period">{{ currentPeriod }}</div>
      <Button icon="mdi-chevron-right" @clickButton="movePeriod(1)" class="calendar-btn" />
      <v-select
        v-model="type"
        :items="types"
        class="type-select"
        density="comfortable"
        label="表示範囲"
        variant="outlined"
        hide-details
      />
    </v-sheet>

    <!-- カレンダー本体 -->
    <v-sheet class="calendar-body">
      <v-calendar
        ref="calendar"
        v-model="calendarViewDate"
        :type="type"
        :event-overlap-mode="mode"
        :event-overlap-threshold="30"
        :events="[]"
        @click:date="onDateClick"
      />

      <!-- 記録詳細ダイアログ -->
      <DialogTemplate
        :model-value="showDialog"
        :dialog-title="selectedDate ? `${selectedDate} の記録` : '記録'"
        @cancel="clearSelectDate"
      >
        <template #content>
          <div v-if="selectedSessions.length === 0" class="no-records">
            <v-icon size="48" color="grey">mdi-note-off-outline</v-icon>
            <p>この日の記録はありません</p>
          </div>
          <div v-else class="session-list">
            <v-card
              v-for="session in selectedSessions"
              :key="session.id"
              variant="outlined"
              class="session-card mb-3"
            >
              <v-card-title class="d-flex justify-space-between align-center">
                <span>{{ getTypeName(session.sessionTypeId as PracticeType) }}</span>
                <v-chip color="primary" size="small">
                  {{ session.totalHits }}/{{ session.totalArrows }} 中
                  ({{ formatAccuracy(session) }}%)
                </v-chip>
              </v-card-title>
              <v-card-text>
                <div v-for="(stand, sIndex) in session.stands" :key="sIndex" class="stand-summary">
                  <span class="stand-label">第{{ sIndex + 1 }}立:</span>
                  <span
                    v-for="(arrow, aIndex) in stand.arrows"
                    :key="aIndex"
                    class="arrow-mark"
                    :class="{ hit: arrow.hit }"
                  >
                    {{ arrow.hit ? '◯' : '✕' }}
                  </span>
                  <span class="stand-result">
                    ({{ stand.arrows.filter((a) => a.hit).length }}/{{ stand.arrows.length }})
                  </span>
                </div>
                <p v-if="session.notes" class="session-notes mt-2">
                  <v-icon size="16">mdi-note-text</v-icon>
                  {{ session.notes }}
                </p>
              </v-card-text>
              <v-card-actions>
                <v-btn
                  size="small"
                  color="error"
                  variant="text"
                  @click="deleteSession(session.id)"
                >
                  <v-icon start>mdi-delete</v-icon>
                  削除
                </v-btn>
              </v-card-actions>
            </v-card>
          </div>
        </template>
        <template #close>
          <Button text="閉じる" @click="clearSelectDate" />
        </template>
      </DialogTemplate>
    </v-sheet>
  </div>
</template>

<style scoped>
.calendar {
  width: 100%;
  height: 100%;
}

.calendar-header {
  width: 100%;
  justify-content: space-between;
  align-items: center;
  padding: 8px;
  box-sizing: border-box;
  height: 10%;
}

.calendar-body {
  height: 90%;
}

.calendar-btn {
  flex: 0 0 40px;
  min-width: 0;
  padding: 0;
  margin: 0 20px;
}

.current-period {
  flex: 1;
  text-align: center;
  font-weight: bold;
}

.type-select {
  flex: 0 0 120px;
}

/* 選択日の丸ハイライトを消す */
::v-deep(.v-icon-btn--variant-tonal .v-icon-btn__underlay) {
  background-color: transparent !important;
  border-radius: 0 !important;
}

.no-records {
  text-align: center;
  padding: 24px;
  color: #888;
}

.session-list {
  max-height: 400px;
  overflow-y: auto;
}

.session-card {
  border-radius: 8px;
}

.stand-summary {
  margin-bottom: 4px;
}

.stand-label {
  font-weight: 500;
  margin-right: 8px;
}

.arrow-mark {
  font-size: 1.1rem;
  margin: 0 2px;
  color: #d32f2f;
}

.arrow-mark.hit {
  color: #2e7d32;
}

.stand-result {
  font-size: 0.85rem;
  color: #777;
  margin-left: 4px;
}

.session-notes {
  font-size: 0.85rem;
  color: #555;
  background: #f5f5f5;
  padding: 8px;
  border-radius: 4px;
}
</style>
