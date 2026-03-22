import { ref, onMounted } from 'vue';
import {
  fetchMonthlySummaryByUser,
  fetchRecordsByUser,
  type MonthlySummary,
  type RecordItem,
} from '@/API/record/recordApi';
import { authStore } from '@/store/auth';

export const useRecordHistory = () => {
  const activeTab = ref<'summary' | 'history'>('summary');
  const monthlySummaries = ref<MonthlySummary[]>([]);
  const records = ref<RecordItem[]>([]);
  const loading = ref(false);
  const errorMessage = ref('');

  const getUserId = (): string | null => {
    const auth = authStore();
    const token = auth.token;
    if (!token) return null;
    try {
      const payload = JSON.parse(atob(token.split('.')[1]));
      return payload.sub ?? null;
    } catch {
      return null;
    }
  };

  const formatMonth = (month: string): string => {
    const [year, mon] = month.split('-');
    return `${year}年${parseInt(mon)}月`;
  };

  const formatDate = (dateStr?: string): string => {
    if (!dateStr) return '不明';
    const d = new Date(dateStr);
    return `${d.getFullYear()}/${String(d.getMonth() + 1).padStart(2, '0')}/${String(d.getDate()).padStart(2, '0')}`;
  };

  const formatHitRate = (hitRate: number): string => {
    return `${Math.round(hitRate * 100)}%`;
  };

  const fetchMonthlySummary = async () => {
    const userId = getUserId();
    if (!userId) {
      errorMessage.value = 'ログインしてください';
      return;
    }
    loading.value = true;
    try {
      const res = await fetchMonthlySummaryByUser(userId);
      monthlySummaries.value = res.data;
    } catch {
      errorMessage.value = 'サマリーの取得に失敗しました';
    } finally {
      loading.value = false;
    }
  };

  const fetchRecords = async () => {
    const userId = getUserId();
    if (!userId) {
      errorMessage.value = 'ログインが必要です';
      return;
    }
    loading.value = true;
    try {
      const res = await fetchRecordsByUser(userId);
      records.value = res.data.slice().sort((a, b) => {
        const da = a.practiceDate ? new Date(a.practiceDate).getTime() : 0;
        const db = b.practiceDate ? new Date(b.practiceDate).getTime() : 0;
        return db - da;
      });
    } catch {
      errorMessage.value = '履歴の取得に失敗しました';
    } finally {
      loading.value = false;
    }
  };

  onMounted(() => {
    fetchMonthlySummary();
    fetchRecords();
  });

  return {
    activeTab,
    monthlySummaries,
    records,
    loading,
    errorMessage,
    formatMonth,
    formatDate,
    formatHitRate,
  };
};
