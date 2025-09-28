<script setup lang="ts">
import { ref, computed } from 'vue';
import Button from '@/components/ui/button/Button.vue';
import { CalendarTimestamp } from 'vuetify/lib/labs/VCalendar/types.mjs';
import DialogTemplate from '@/components/ui/dialogTemplate/DialogTemplate.vue';

// カレンダーの表示タイプ
const type = ref<'month' | 'week' | 'day'>('month');
const types = ['month', 'week', 'day'] as const;

// イベント重なりモード
const mode = ref<'stack' | 'column'>('stack');
const modes = ['stack', 'column'] as const;

// カレンダー表示範囲の日付
const calendarViewDate = ref<string>('');

// 選択中の日付
const selectedDate = ref<string | undefined>(undefined);
const showDialog = computed(() => selectedDate.value !== undefined);

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
  // 選択中の同じ日をクリックしたら解除

  if (selectedDate.value === timestamp.date) {
    selectedDate.value = undefined;
  } else {
    // 新しい日だけ選択
    selectedDate.value = timestamp.date;
  }
  console.log(selectedDate.value);
};

// ダイアログ閉じる
const clearSelectDate = () => {
  selectedDate.value = undefined;
  console.log(selectedDate.value);
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
      <DialogTemplate :model-value="showDialog" @cancel="clearSelectDate" />
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
/* 選択日の丸ハイライトを消す */
::v-deep(.v-icon-btn--variant-tonal .v-icon-btn__underlay) {
  background-color: transparent !important;
  border-radius: 0 !important;
}
</style>
