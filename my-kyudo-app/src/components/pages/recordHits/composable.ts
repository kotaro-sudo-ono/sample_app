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

  return { handleAddSession };
};
