import { useRouter } from 'vue-router';

export const useRoutePage = () => {
  const router = useRouter();

  const toRecordCalender = () => router.push({ name: 'recordCalender' });
  const toRecordHits = () => router.push({ name: 'recordHits' });
  const toRecordHistory = () => router.push({ name: 'recordHistory' });

  return { toRecordCalender, toRecordHits, toRecordHistory };
};
