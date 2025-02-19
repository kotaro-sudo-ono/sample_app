<script setup>
import { ref, onMounted, onUnmounted } from 'vue';
import Button from '/Users/opm007852/kotaro.ono/sample_app/my-kyudo-app/src/components/Button.vue';

const showDialog = ref(false);

const isShowDialog = () => {
  showDialog.value = !showDialog.value;
};
const triggerShake = ref(false); // 振動状態を管理
const dialogElement = ref(null); // ダイアログ要素を参照するための変数

// ダイアログ外またはオーバーレイ部分をクリックした場合に振動
const overlayClick = (event) => {
  const clickDialogOutside = event.target.closest('.dialog');
  if (!clickDialogOutside) {
    triggerShake.value = true;
    setTimeout(() => {
      triggerShake.value = false;
    }, 500);
  }
};
const handleOutsideClick = (event) => {
  if (!dialogElement.value.contains(event.target) && !showDialog) {
    console.log('aaa');
    showDialog.value = false;
  }
};
// コンポーネントがマウントされたときにイベントリスナーを追加
onMounted(() => {
  window.addEventListener('click', handleOutsideClick);
});

// コンポーネントがアンマウントされたときにイベントリスナーを削除
onUnmounted(() => {
  window.removeEventListener('click', handleOutsideClick);
});
</script>

<template>
  <div v-show="showDialog" class="overlay" @click="overlayClick"></div>

  <div
    v-show="showDialog"
    ref="dialogElement"
    :class="{ dialog: true, shake: triggerShake }"
  >
    <h2>ダイアログタイトル</h2>
    <slot>
      <p>ダイアログの内容...</p>
    </slot>
    <Button @click="isShowDialog" :text="'ダイアログを閉じる'" />
  </div>
  <div v-show="!showDialog">
    <Button @click="isShowDialog" :text="'ダイアログを開く'" />
  </div>
</template>

<style scoped>
.overlay {
  position: fixed;
  width: 50%;
  height: 50%;
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
  width: 300px;
  text-align: center;
  border: 1px solid #1867c0;
  border-radius: 18px;
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

/* transformはtransform: translate(-50%, -50%)で位置を変更するため要素がずれる
  0% {
    transform: translate(2px, 0px);
  }
  5% {
    transform: translate(-2px, 0px);
  }
  10% {
    transform: translate(2px, 0px);
  }
  15% {
    transform: translate(-2px, 0px);
  }
  20% {
    transform: translate(2px, 0px);
  }
  25% {
    transform: translate(-2px, 0px);
  }
  30% {
    transform: translate(0px, 0px);
  }
} */
</style>
