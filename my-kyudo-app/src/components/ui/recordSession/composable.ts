import { ref, computed, watch } from 'vue';
import { PracticeTypes } from '@/types/practiceType';
import type { PracticeSession, Stand } from '@/store/practice';

const nowJST = () => {
  const now = new Date();
  const jstDate = new Date(now.getTime() + 9 * 60 * 60 * 1000);
  return jstDate.toISOString().replace('Z', '+09:00');
};

type Session = {
  date: string;
  stands: Stand[];
  notes: string;
  sessionTypeId: number;
};

type SessionEmit = {
  (e: 'add-session', session: Omit<Session, 'id'>): void;
  (e: 'update-session', session: Session & { id: string }): void;
};

export const useRecordSession = (emit: SessionEmit, editSession?: PracticeSession) => {
  const isEditMode = !!editSession;

  const standCount = ref(isEditMode ? editSession!.stands.length : 1);
  const stands = ref<Stand[]>(
    isEditMode
      ? editSession!.stands.map((s) => ({ arrows: s.arrows.map((a) => ({ ...a })) }))
      : [{ arrows: Array.from({ length: 4 }, () => ({ hit: false })) }]
  );
  const notes = ref(isEditMode ? editSession!.notes : '');
  const sessionTypeId = ref<number>(isEditMode ? editSession!.sessionTypeId : PracticeTypes.Tournament.id);
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
      if (selectedArrow.value && selectedArrow.value.standIndex >= stands.value.length) {
        selectedArrow.value = undefined;
        dialogOpen.value = false;
      }
    }
  };

  const addArrowToStand = (index: number) => {
    stands.value[index].arrows.push({ hit: false });
  };

  const removeArrowFromStand = (index: number) => {
    if (stands.value[index].arrows.length > 1) {
      stands.value[index].arrows.pop();
      if (
        selectedArrow.value &&
        selectedArrow.value.standIndex === index &&
        selectedArrow.value.arrowIndex >= stands.value[index].arrows.length
      ) {
        selectedArrow.value = undefined;
        dialogOpen.value = false;
      }
    }
  };

  watch(dialogOpen, (isOpen) => {
    if (!isOpen) selectedArrow.value = undefined;
  });

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
    const sessionData: Session = {
      date: isEditMode ? editSession!.date : nowJST(),
      stands: stands.value,
      notes: notes.value,
      sessionTypeId: sessionTypeId.value,
    };

    if (isEditMode) {
      emit('update-session', { ...sessionData, id: editSession!.id });
    } else {
      emit('add-session', sessionData);
      standCount.value = 1;
      stands.value = [{ arrows: Array.from({ length: 4 }, () => ({ hit: false })) }];
      notes.value = '';
      showSuccess.value = true;
      setTimeout(() => (showSuccess.value = false), 2000);
    }
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
