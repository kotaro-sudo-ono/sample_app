import { ref, onMounted } from 'vue';
import { fetchMonthlySummaryByUser, type MonthlySummary } from '@/API/record/recordApi';
import { authStore } from '@/store/auth';

type View = 'summary' | 'calendar';

type PeriodOption = {
  label: string;
  value: number;
};

export const useRecordHistory = () => {
  const view = ref<View>('summary');
  const selectedMonth = ref<string>('');
  const monthlySummaries = ref<MonthlySummary[]>([]);
  const loading = ref(false);
  const errorMessage = ref('');

  const periodOptions: PeriodOption[] = [
    { label: '直近3ヶ月', value: 3 },
    { label: '直近6ヶ月', value: 6 },
    { label: '直近12ヶ月', value: 12 },
  ];
  const selectedPeriod = ref(3);

  const getUserId = (): string | null => {
    const auth = authStore();
    const token = auth.token;
    if (!token) {
      return null;
    }
    try {
      const base64 = token.split('.')[1].replace(/-/g, '+').replace(/_/g, '/');
      const padded = base64.padEnd(base64.length + ((4 - (base64.length % 4)) % 4), '=');
      const payload = JSON.parse(atob(padded));
      return payload.sub ?? null;
    } catch {
      return null;
    }
  };

  const generateMonthList = (months: number): string[] => {
    const result: string[] = [];
    const now = new Date();
    for (let i = 0; i < months; i++) {
      const d = new Date(now.getFullYear(), now.getMonth() - i, 1);
      result.push(`${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}`);
    }
    return result;
  };

  const fetchSummary = async () => {
    const userId = getUserId();
    if (!userId) {
      errorMessage.value = 'ログインしてください';
      return;
    }
    loading.value = true;
    errorMessage.value = '';
    try {
      const months = generateMonthList(selectedPeriod.value);
      const res = await fetchMonthlySummaryByUser(userId, months);
      monthlySummaries.value = res.data;
    } catch {
      errorMessage.value = 'サマリーの取得に失敗しました';
    } finally {
      loading.value = false;
    }
  };

  const formatMonth = (month: string): string => {
    const [year, mon] = month.split('-');
    return `${year}年${parseInt(mon)}月`;
  };

  const formatHitRate = (hitRate: number): string => {
    return `${Math.round(hitRate * 100)}%`;
  };

  const onMonthClick = (month: string) => {
    selectedMonth.value = month;
    view.value = 'calendar';
  };

  const backToSummary = () => {
    view.value = 'summary';
    selectedMonth.value = '';
  };

  onMounted(() => {
    fetchSummary();
  });

  return {
    view,
    selectedMonth,
    monthlySummaries,
    loading,
    errorMessage,
    periodOptions,
    selectedPeriod,
    fetchSummary,
    formatMonth,
    formatHitRate,
    onMonthClick,
    backToSummary,
  };
};
