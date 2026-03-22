import { defineStore } from 'pinia';

type NotificationType = 'error' | 'success' | 'warning';

export const notificationStore = defineStore('notification', {
  state: () => ({
    visible: false,
    message: '',
    type: 'error' as NotificationType,
  }),
  actions: {
    show(message: string, type: NotificationType = 'error') {
      this.message = message;
      this.type = type;
      this.visible = true;
    },
    hide() {
      this.visible = false;
    },
  },
});
