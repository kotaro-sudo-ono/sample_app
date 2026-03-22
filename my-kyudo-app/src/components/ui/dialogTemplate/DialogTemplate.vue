<script setup lang="ts">
import Button from '../button/Button.vue';
import { useDialogTemplate } from './composable';

const props = defineProps({
  dialogTitle: {
    type: String,
    default: 'ダイアログタイトル',
  },
  modelValue: {
    type: Boolean,
    required: true,
  },
});

const emit = defineEmits<{
  cancel: [];
}>();

const { triggerShake, close, overlayClick } = useDialogTemplate(emit);
</script>

<template>
  <div v-show="modelValue" class="overlay" @click="overlayClick">
    <div :class="{ dialog: true, shake: triggerShake }">
      <div>
        <h2>{{ dialogTitle }}</h2>
      </div>
      <div class="content">
        <slot name="content">
          <p>ダイアログの内容...</p>
        </slot>
      </div>
      <div class="close">
        <slot name="close">
          <Button @click="close" text="ダイアログを閉じる" />
        </slot>
      </div>
    </div>
  </div>
</template>

<style lang="scss" scoped>
.overlay {
  position: fixed;
  width: 100%;
  height: 100%;
  background: rgba(0, 0, 0, 0.5);
  z-index: 999;
}
.dialog {
  position: fixed;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  padding: 20px;
  background-color: white;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
  z-index: 1000;
  width: 50%;
  max-height: 75%; /* 親オーバーレイ内で最大値 */
  text-align: center;
  border: 1px solid #1867c0;
  border-radius: 18px;

  display: flex;
  flex-direction: column;
}

.header {
  flex: 0 0 auto; /* 高さ自動 */
  display: flex;
  align-items: center;
  justify-content: center;
}

.content {
  flex: 1 1 auto; /* 残りのスペースを占有 */
  overflow-y: auto; /* はみ出す場合はスクロール */
}

.close {
  flex: 0 0 auto;
}
.shake {
  animation: shakeAnimation 2s infinite;
}

@keyframes shakeAnimation {
  0% {
    margin-left: 2px;
  }
  5% {
    margin-left: -2px;
  }
  10% {
    margin-left: 2px;
  }
  15% {
    margin-left: -2px;
  }
  20% {
    margin-left: 2px;
  }
  25% {
    margin-left: -2px;
  }
  30% {
    margin-left: 0px;
  }
}
</style>
