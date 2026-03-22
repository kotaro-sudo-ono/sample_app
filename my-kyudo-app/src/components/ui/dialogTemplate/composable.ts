import { ref } from 'vue';

export const useDialogTemplate = (emit: (e: 'cancel') => void) => {
  const triggerShake = ref(false);

  const close = () => {
    emit('cancel');
  };

  const overlayClick = (event: MouseEvent) => {
    const target = event.target as HTMLElement;
    const clickDialogOutside = target.closest('.dialog');
    if (!clickDialogOutside) {
      triggerShake.value = true;
      setTimeout(() => {
        triggerShake.value = false;
      }, 500);
    }
  };

  return { triggerShake, close, overlayClick };
};
