import { ref, computed } from 'vue';
import { practiceStore, type PracticeSession } from '@/store/practice';
import type { CalendarTimestamp } from 'vuetify/lib/labs/VCalendar/types.mjs';

export const useRecordCalender = () => {
  const store = practiceStore();

  const type = ref<'month' | 'week' | 'day'>('month');
  const types = ['month', 'week', 'day'] as const;
  const mode = ref<'stack' | 'column'>('stack');
  const calendarViewDate = ref<string>('');
  const selectedDate = ref<string | undefined>(undefined);

  const showDialog = computed(() => selectedDate.value !== undefined);

  const selectedSessions = computed<PracticeSession[]>(() => {
    if (!selectedDate.value) return [];
    return store.getSessionsByDate(selectedDate.value);
  });

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

  const onDateClick = (_event: Event, timestamp: CalendarTimestamp) => {
    if (selectedDate.value === timestamp.date) {
      selectedDate.value = undefined;
    } else {
      selectedDate.value = timestamp.date;
    }
  };

  const clearSelectDate = () => {
    selectedDate.value = undefined;
  };

  const deleteSession = (id: string) => {
    store.deleteSession(id);
  };

  const formatAccuracy = (session: PracticeSession) => {
    if (session.totalArrows === 0) return '0.0';
    return ((session.totalHits / session.totalArrows) * 100).toFixed(1);
  };

  return {
    type,
    types,
    mode,
    calendarViewDate,
    selectedDate,
    showDialog,
    selectedSessions,
    currentPeriod,
    movePeriod,
    onDateClick,
    clearSelectDate,
    deleteSession,
    formatAccuracy,
  };
};
