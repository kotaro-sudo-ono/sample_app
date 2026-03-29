import { ref } from 'vue';
import { practiceStore } from '@/store/practice';

export const useRecordHits = () => {
  const store = practiceStore();

  const handleAddSession = (session: {
    date: string;
    stands: { arrows: { hit: boolean; position?: { x: number; y: number } }[] }[];
    notes: string;
    sessionTypeId: number;
  }) => {
    store.addSession(session);
  };

  const isAiCoachDialogOpen = ref(false);
  const openAiCoachDialog = () => {
    isAiCoachDialogOpen.value = true;
  };

  return { handleAddSession, isAiCoachDialogOpen, openAiCoachDialog };
};
