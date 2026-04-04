import { ref, computed } from 'vue';
import { practiceStore, type PracticeSession, type Stand } from '@/store/practice';
import { notificationStore } from '@/store/notification';
import { fetchAiCoachAdvice } from '@/API/ai/aiSummaryApi';

export const useRecordHits = (sessionId?: string) => {
  const store = practiceStore();

  const editingSession = computed<PracticeSession | undefined>(() => {
    const session = store.getSessions.find((s) => s.id === sessionId);
    if (!session) {
      return undefined;
    }
    const stands = session.stands.filter((stand) =>
      stand.arrows.some((arrow) => arrow.hit || arrow.position !== undefined)
    );
    return { ...session, stands };
  });

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
    notificationStore().show('記録を更新しました', 'success');
  };

  // 診断
  const selectedStandIndices = ref<number[]>([]);
  const diagnosisLoading = ref(false);
  const diagnosisAdviceText = ref('');

  const toggleStand = (index: number) => {
    const pos = selectedStandIndices.value.indexOf(index);
    if (pos === -1) {
      selectedStandIndices.value.push(index);
    } else {
      selectedStandIndices.value.splice(pos, 1);
    }
  };

  const handleDiagnose = async () => {
    if (!editingSession.value || selectedStandIndices.value.length === 0) {
      return;
    }
    const filteredStands = selectedStandIndices.value
      .slice()
      .sort((a, b) => a - b)
      .map((index) => ({
        arrows: editingSession.value!.stands[index].arrows.filter(
          (arrow) => arrow.hit || arrow.position !== undefined
        ),
      }))
      .filter((stand) => stand.arrows.length > 0);

    const filteredSession: PracticeSession = {
      ...editingSession.value,
      stands: filteredStands,
      totalArrows: filteredStands.reduce((sum, stand) => sum + stand.arrows.length, 0),
      totalHits: filteredStands.reduce(
        (sum, stand) => sum + stand.arrows.filter((arrow) => arrow.hit).length,
        0
      ),
    };
    diagnosisLoading.value = true;
    diagnosisAdviceText.value = '';
    try {
      diagnosisAdviceText.value = await fetchAiCoachAdvice([filteredSession]);
    } catch (error) {
      const message = error instanceof Error ? error.message : '診断中にエラーが発生しました。';
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
    selectedStandIndices,
    toggleStand,
    diagnosisLoading,
    diagnosisAdviceText,
    handleDiagnose,
    handleReDiagnose,
    isAiCoachDialogOpen,
    openAiCoachDialog,
  };
};
