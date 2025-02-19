<script setup lang="ts">
import { ref } from 'vue';
import Button from '../button/Button.vue';

const props = defineProps({
  dialogTitle: {
    type: String,
    default: 'ダイアログタイトル'
  },
  modelValue: {
    type: Boolean,
    required: true
  }
});

const emit = defineEmits<{
  cancel: [];
}>();

const close = () => {
  emit('cancel')
}

const triggerShake = ref(false); // 振動状態を管理
const dialogElement = ref(null); // ダイアログ要素を参照するための変数

// ダイアログ外またはオーバーレイ部分をクリックした場合に振動
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
</script>

<template>
  <div v-show="modelValue" class="overlay" @click="overlayClick"></div>
  <div
    v-show="modelValue"
    ref="dialogElement"
    :class="{ dialog: true, shake: triggerShake }"
  >
    <div>
      <h2>{{dialogTitle}}</h2>
    </div>
    <div class="content">
      <slot name="content" >
        <p>ダイアログの内容...</p>
      </slot>
    </div>
    <div class="close">
      <Button @click="close" :text="'ダイアログを閉じる'" />
    </div>
  </div>
</template>

<style lang="scss" scoped>
$header_height: 30%; 
$content_height: 60%;  
$close_height: 10%; 

.overlay {
  position: fixed;
  width: 75%;
  height: 75%;
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
  z-index: 1000; /* オーバーレイより上に表示されるように */
  width: 50%;
  height: 50%;
  text-align: center;
  border: 1px solid #1867c0;
  border-radius: 18px;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
}

.header {
  height: $header_height;
  display: flex;
  align-items: center;
  justify-content: center;

}

.content {
  height: $content_height;
}

.close {
  height: $close_height;
  display: flex;
  align-items: center;
  justify-content: center;
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
