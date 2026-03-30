import { ref, computed } from 'vue';
import { useRouter } from 'vue-router';
import { practiceStore, type PracticeSession, type Stand } from '@/store/practice';
import { notificationStore } from '@/store/notification';
import { fetchAiCoachAdvice } from '@/API/ai/aiSummaryApi';

export const useRecordHits = (sessionId?: string) => {
  const store = practiceStore();
  const router = useRouter();

  const editingSession = computed<PracticeSession | undefined>(
    () => store.getSessions.find((session) => session.id === sessionId)
  );

  const handleAddSession = (session: {
    date: string;
    stands: { arrows: { hit: boolean; position?: { x: number; y: number } }[] }[];
    notes: string;
    sessionTypeId: number;
  }) => {
    store.addSession(session);
  };

  const handleUpdateSession = (data: {
    id: string;
    date: string;
    stands: Stand[];
    notes: string;
    sessionTypeId: number;
  }) => {
    store.updateSession({
      id: data.id,
      date: data.date,
      stands: data.stands,
      notes: data.notes,
      sessionTypeId: data.sessionTypeId,
      totalArrows: data.stands.reduce((sum, stand) => sum + stand.arrows.length, 0),
      totalHits: data.stands.reduce(
        (sum, stand) => sum + stand.arrows.filter((arrow) => arrow.hit).length,
        0
      ),
    });
    router.back();
  };

  // 診断
  const diagnosisLoading = ref(false);
  const diagnosisAdviceText = ref('');
  const diagnosisErrorMessage = ref('');

  const handleDiagnose = async () => {
    if (!editingSession.value) return;
    diagnosisLoading.value = true;
    diagnosisAdviceText.value = '';
    diagnosisErrorMessage.value = '';
    try {
      diagnosisAdviceText.value = await fetchAiCoachAdvice([editingSession.value]);
    } catch (error) {
      const message = error instanceof Error ? error.message : '診断中にエラーが発生しました。';
      diagnosisErrorMessage.value = message;
      notificationStore().show(message);
    } finally {
      diagnosisLoading.value = false;
    }
  };

  const handleReDiagnose = async () => {
    diagnosisAdviceText.value = '';
    await handleDiagnose();
  };

  const isAiCoachDialogOpen = ref(false);
  const openAiCoachDialog = () => {
    isAiCoachDialogOpen.value = true;
  };

  return {
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
  };
};
