import { ref, computed, onMounted } from 'vue';
import { practiceStore, type PracticeSession, type Stand } from '@/store/practice';
import { authStore } from '@/store/auth';
import type { CalendarTimestamp } from 'vuetify/lib/labs/VCalendar/types.mjs';

export const useRecordCalender = (initialMonth?: string) => {
  const store = practiceStore();

  const type = ref<'month' | 'week' | 'day'>('month');
  const types = ['month', 'week', 'day'] as const;
  const mode = ref<'stack' | 'column'>('stack');

  const nowJSTDate = new Date(Date.now() + 9 * 60 * 60 * 1000).toISOString().substring(0, 10);
  const initialDate = initialMonth ? `${initialMonth}-01` : nowJSTDate;
  const calendarViewDate = ref<string>(initialDate);
  const selectedDate = ref<string | undefined>(undefined);

  const showDialog = computed(() => selectedDate.value !== undefined);

  const calendarEvents = computed(() => {
    const dateMap = new Map<string, { hits: number; arrows: number }>();
    store.sessions.forEach((session) => {
      const date = session.date.substring(0, 10);
      const existing = dateMap.get(date) ?? { hits: 0, arrows: 0 };
      dateMap.set(date, {
        hits: existing.hits + session.totalHits,
        arrows: existing.arrows + session.totalArrows,
      });
    });
    return Array.from(dateMap.entries()).map(([date, { hits, arrows }]) => {
      const rate = arrows > 0 ? Math.round((hits / arrows) * 100) : 0;
      return {
        title: `${rate}%`,
        start: date,
        end: date,
        color: rate >= 70 ? 'green' : rate >= 50 ? 'orange' : 'red',
      };
    });
  });

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

  const editingSession = ref<PracticeSession | null>(null);

  const startEdit = (session: PracticeSession) => {
    editingSession.value = session;
  };

  const stopEdit = () => {
    editingSession.value = null;
  };

  const handleUpdateSession = (data: { id: string; date: string; stands: Stand[]; notes: string; sessionTypeId: number }) => {
    store.updateSession({
      id: data.id,
      date: data.date,
      stands: data.stands,
      notes: data.notes,
      sessionTypeId: data.sessionTypeId,
      totalArrows: data.stands.reduce((sum, stand) => sum + stand.arrows.length, 0),
      totalHits: data.stands.reduce((sum, stand) => sum + stand.arrows.filter((arrow) => arrow.hit).length, 0),
    });
    stopEdit();
  };

  const formatAccuracy = (session: PracticeSession) => {
    if (session.totalArrows === 0) return '0.0';
    return ((session.totalHits / session.totalArrows) * 100).toFixed(1);
  };

  const getUserId = (): string | null => {
    const auth = authStore();
    const token = auth.token;
    if (!token) return null;
    try {
      const base64 = token.split('.')[1].replace(/-/g, '+').replace(/_/g, '/');
      const padded = base64.padEnd(base64.length + ((4 - (base64.length % 4)) % 4), '=');
      const payload = JSON.parse(atob(padded));
      return payload.sub ?? null;
    } catch {
      return null;
    }
  };

  onMounted(async () => {
    const userId = getUserId();
    if (userId) {
      await store.fetchFromBackend(userId);
    }
  });

  return {
    type,
    types,
    mode,
    calendarViewDate,
    selectedDate,
    showDialog,
    calendarEvents,
    selectedSessions,
    currentPeriod,
    movePeriod,
    onDateClick,
    clearSelectDate,
    deleteSession,
    formatAccuracy,
    editingSession,
    startEdit,
    stopEdit,
    handleUpdateSession,
  };
};
