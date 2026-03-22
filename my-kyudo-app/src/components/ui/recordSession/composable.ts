import { ref, computed } from 'vue';
import { PracticeTypes } from '@/types/practiceType';
import type { Arrow, Stand } from '@/store/practice';

type Session = {
  date: string;
  stands: Stand[];
  notes: string;
  sessionTypeId: number;
};

type AddSessionEmit = (e: 'add-session', session: Omit<Session, 'id'>) => void;

export const useRecordSession = (emit: AddSessionEmit) => {
  const standCount = ref(1);
  const stands = ref<Stand[]>([{ arrows: Array.from({ length: 4 }, () => ({ hit: false })) }]);
  const notes = ref('');
  const sessionTypeId = ref<number>(PracticeTypes.Tournament.id);
  const showSuccess = ref(false);
  const dialogOpen = ref(false);
  const selectedArrow = ref<{ standIndex: number; arrowIndex: number }>();

  const sessionTypeLabel = computed(
    () => Object.values(PracticeTypes).find((p) => p.id === sessionTypeId.value)?.label || ' '
  );
  const totalArrows = computed(() => stands.value.reduce((sum, s) => sum + s.arrows.length, 0));
  const totalHits = computed(() =>
    stands.value.reduce((sum, s) => sum + s.arrows.filter((a) => a.hit).length, 0)
  );

  const addStand = () => {
    standCount.value++;
    stands.value.push({ arrows: Array.from({ length: 4 }, () => ({ hit: false })) });
  };

  const removeStand = () => {
    if (standCount.value > 1) {
      standCount.value--;
      stands.value.pop();
    }
  };

  const addArrowToStand = (index: number) => {
    stands.value[index].arrows.push({ hit: false });
  };

  const removeArrowFromStand = (index: number) => {
    if (stands.value[index].arrows.length > 1) stands.value[index].arrows.pop();
  };

  const openDialog = (standIndex: number, arrowIndex: number) => {
    selectedArrow.value = { standIndex, arrowIndex };
    dialogOpen.value = true;
  };

  const isInsideTarget = (pos: { x: number; y: number }): boolean => {
    const dx = pos.x - 0.5;
    const dy = pos.y - 0.5;
    const targetRadius = 260 / 300 / 2;
    return dx * dx + dy * dy <= targetRadius * targetRadius;
  };

  const handleSelectPosition = (pos?: { x: number; y: number }) => {
    if (!selectedArrow.value) return;
    const { standIndex, arrowIndex } = selectedArrow.value;
    const s = [...stands.value];
    s[standIndex].arrows[arrowIndex] = {
      hit: !!pos && isInsideTarget(pos),
      position: pos,
    };
    stands.value = s;
  };

  const setAllHits = (standIndex: number, hits: number) => {
    const s = [...stands.value];
    s[standIndex].arrows = s[standIndex].arrows.map((_, i) => ({
      hit: i < hits,
      position: i < hits ? { x: 0.5, y: 0.5 } : undefined,
    }));
    stands.value = s;
  };

  const handleSubmit = () => {
    const newSession: Session = {
      date: new Date().toISOString(),
      stands: stands.value,
      notes: notes.value,
      sessionTypeId: sessionTypeId.value,
    };
    emit('add-session', newSession);

    standCount.value = 1;
    stands.value = [{ arrows: Array.from({ length: 4 }, () => ({ hit: false })) }];
    notes.value = '';
    showSuccess.value = true;
    setTimeout(() => (showSuccess.value = false), 2000);
  };

  return {
    standCount,
    stands,
    notes,
    sessionTypeId,
    showSuccess,
    dialogOpen,
    selectedArrow,
    sessionTypeLabel,
    totalArrows,
    totalHits,
    addStand,
    removeStand,
    addArrowToStand,
    removeArrowFromStand,
    openDialog,
    handleSelectPosition,
    setAllHits,
    handleSubmit,
  };
};
