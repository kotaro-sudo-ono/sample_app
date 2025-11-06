<script setup lang="ts">
import { ref, watch } from 'vue';
import Button from '../button/Button.vue';
import DialogTemplate from '../dialogTemplate/DialogTemplate.vue';

interface MarkerPosition {
  x: number;
  y: number;
}

// defineModelで親からopenをバインディング
const open = defineModel<boolean>('open', { default: false });

const props = defineProps<{
  arrowNumber: number;
  currentPosition?: MarkerPosition;
}>();

const emit = defineEmits<{
  (e: 'select', pos?: MarkerPosition): void;
}>();

const targetRef = ref<HTMLElement>();
const marker = ref<MarkerPosition>();

// 開いた時に既存位置をセット
watch(open, (v) => {
  if (v && props.currentPosition) {
    marker.value = props.currentPosition;
  } else if (!v) {
    marker.value = undefined;
  }
});

const handleTargetClick = (e: MouseEvent) => {
  const el = targetRef.value;
  if (!el) return;
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
</script>

<template>
  <DialogTemplate v-model="open" :dialogTitle="`${props.arrowNumber}本目の的中位置`" @cancel="open = false">
    <template #content>
      <p>的をクリックして矢が当たった位置を記録してください。</p>

      <div class="target-wrapper">
        <div ref="targetRef" class="target" @click="handleTargetClick">
          <!-- 的デザイン -->
          <div class="ring ring-outer">
            <div class="ring ring-white">
              <div class="ring ring-inner">
                <div class="ring ring-white">
                  <div class="ring ring-center" />
                </div>
              </div>
            </div>
          </div>

          <!-- マーカー -->
          <div v-if="marker" class="marker" :style="{ left: marker.x * 100 + '%', top: marker.y * 100 + '%' }">
            <div class="marker-ring"></div>
            <div class="marker-dot"></div>
          </div>
        </div>
        <p class="note">※ 的の外側をクリックしても記録できます。</p>
      </div>
    </template>

    <template #close>
      <template v-if="marker">
        <div class="text-row">
          <Button text="この位置で記録" @click="handleConfirm" />
          <Button text="やり直す" @click="handleReset" />
        </div>
      </template>
      <template v-else>
        <Button text="外れ（位置不明）" @click="handleMiss" />
      </template>
    </template>
  </DialogTemplate>
</template>

<style scoped>
.target-wrapper {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  margin-top: 1rem;
}

.target {
  position: relative;
  width: 300px;
  height: 300px;
  background-color: #f4f4f4;
  border-radius: 12px;
  cursor: crosshair;
  display: flex;
  align-items: center;
  justify-content: center;
  overflow: hidden;
}

.ring {
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
}

.ring-outer {
  width: 260px;
  height: 260px;
  background-color: #2f2f2f;
}

.ring-white {
  width: 85%;
  height: 85%;
  background-color: #fff;
}

.ring-inner {
  width: 70%;
  height: 70%;
  background-color: #2f2f2f;
}

.ring-center {
  width: 40%;
  height: 40%;
  background-color: #cfd3d6;
  border-radius: 50%;
  box-shadow: inset 0 0 6px rgba(0, 0, 0, 0.3);
}

.marker {
  position: absolute;
  transform: translate(-50%, -50%);
  z-index: 10;
  pointer-events: none;
}

.marker-ring {
  width: 20px;
  height: 20px;
  border-radius: 50%;
  background-color: rgba(132, 204, 22, 0.6);
  animation: pulse 1.2s infinite;
}

.marker-dot {
  position: absolute;
  top: 5px;
  left: 5px;
  width: 10px;
  height: 10px;
  background-color: #8bc34a;
  border-radius: 50%;
  box-shadow: 0 0 6px rgba(139, 195, 74, 0.8);
}

.note {
  font-size: 0.75rem;
  color: #888;
  text-align: center;
  margin-top: 6px;
}

@keyframes pulse {
  0% {
    transform: scale(1);
    opacity: 0.7;
  }
  100% {
    transform: scale(1.8);
    opacity: 0;
  }
}
.text-row {
  gap: 2px;
}
</style>
