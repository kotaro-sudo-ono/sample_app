import { ref, watch } from 'vue';
import type { Ref } from 'vue';

type MarkerPosition = {
  x: number;
  y: number;
};

export const useTargetDialog = (
  open: Ref<boolean>,
  getCurrentPosition: () => MarkerPosition | undefined,
  emit: (e: 'select', pos?: MarkerPosition) => void
) => {
  const marker = ref<MarkerPosition>();
  const targetRef = ref<HTMLElement>();

  watch(open, (v) => {
    if (v) {
      const pos = getCurrentPosition();
      if (pos) {
        marker.value = pos;
      }
    } else {
      marker.value = undefined;
    }
  });

  const handleTargetClick = (e: MouseEvent) => {
    const el = targetRef.value;
    if (!el) {
      return;
    }
    const rect = el.getBoundingClientRect();
    const x = (e.clientX - rect.left) / rect.width;
    const y = (e.clientY - rect.top) / rect.height;
    marker.value = { x, y };
  };

  const handleConfirm = () => {
    emit('select', marker.value);
    open.value = false;
  };

  const handleMiss = () => {
    emit('select', undefined);
    open.value = false;
  };

  const handleReset = () => {
    marker.value = undefined;
  };

  return { marker, targetRef, handleTargetClick, handleConfirm, handleMiss, handleReset };
};
