import { computed } from 'vue';
import RecordHits from '../../recordHits.vue';

type RecordState = {
  name: String;
  totalShots: number;
  hits: number;
  history: (1 | 0)[];
};

export const useRecordsheet = () => {};
