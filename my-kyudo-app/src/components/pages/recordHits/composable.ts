import { ref } from 'vue';
import { practiceStore } from '@/store/practice';

export const useRecordHits = () => {
  const store = practiceStore();
  const savedMessage = ref('');

  const handleAddSession = (session: {
    date: string;
    stands: { arrows: { hit: boolean; position?: { x: number; y: number } }[] }[];
    notes: string;
    sessionTypeId: number;
  }) => {
    store.addSession(session);
    savedMessage.value = '記録を保存しました';
    setTimeout(() => (savedMessage.value = ''), 3000);
  };

  return { savedMessage, handleAddSession };
};
