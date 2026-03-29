import { ref, computed, watch, type Ref } from 'vue';
import { practiceStore } from '@/store/practice';
import { notificationStore } from '@/store/notification';
import { fetchAiCoachAdvice } from '@/API/ai/aiSummaryApi';

export const useAiCoachDialog = (open: Ref<boolean>) => {
  const store = practiceStore();

  const isLoading = ref(false);
  const adviceText = ref('');
  const errorMessage = ref('');
  const selectedSessionIds = ref<string[]>([]);

  const allSessions = computed(() =>
    [...store.getSessions].sort(
      (a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()
    )
  );

  const selectedSessions = computed(() =>
    allSessions.value.filter((session) => selectedSessionIds.value.includes(session.id))
  );

  const toggleSession = (id: string) => {
    const index = selectedSessionIds.value.indexOf(id);
    if (index === -1) {
      selectedSessionIds.value.push(id);
    } else {
      selectedSessionIds.value.splice(index, 1);
    }
  };

  const handleAnalyze = async () => {
    isLoading.value = true;
    errorMessage.value = '';
    adviceText.value = '';
    try {
      adviceText.value = await fetchAiCoachAdvice(selectedSessions.value);
    } catch (error) {
      const message = error instanceof Error ? error.message : '分析中にエラーが発生しました。';
      errorMessage.value = message;
      notificationStore().show(message);
    } finally {
      isLoading.value = false;
    }
  };

  const handleReAnalyze = async () => {
    adviceText.value = '';
    await handleAnalyze();
  };

  watch(open, (newValue) => {
    if (newValue) {
      selectedSessionIds.value = [];
      adviceText.value = '';
      errorMessage.value = '';
    }
  });

  return {
    isLoading,
    adviceText,
    errorMessage,
    selectedSessionIds,
    allSessions,
    selectedSessions,
    toggleSession,
    handleAnalyze,
    handleReAnalyze,
  };
};
