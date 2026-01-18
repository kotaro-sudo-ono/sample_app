<script setup lang="ts">
import { ref, computed } from 'vue';
import TargetDialog from '../targetDialog/targetDialog.vue';
import {  getTypeId, PracticeTypeKey, PracticeTypes } from '@/types/practiceType';

interface Arrow {
  hit: boolean;
  position?: { x: number; y: number };
}

interface Stand {
  arrows: Arrow[];
}

interface Session {
  date: string;
  stands: Stand[];
  notes: string;
  sessionTypeId: number;
}

const emit = defineEmits<{
  (e: 'add-session', session: Omit<Session, 'id'>): void;
}>();


const standCount = ref(1);
const stands = ref<Stand[]>([{ arrows: Array(4).fill({ hit: false }) }]);
const notes = ref('');
const sessionTypeId = ref<number>(PracticeTypes.Tournament.id);
const showSuccess = ref(false);

const dialogOpen = ref(false);
const selectedArrow = ref<{ standIndex: number; arrowIndex: number }>();


const addStand = () => {
  standCount.value++;
  stands.value.push({ arrows: Array(4).fill({ hit: false }) });
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

const handleSelectPosition = (pos?: { x: number; y: number }) => {
  if (!selectedArrow.value) return;
  const { standIndex, arrowIndex } = selectedArrow.value;
  const s = [...stands.value];
  s[standIndex].arrows[arrowIndex] = {
    hit: !!pos,
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

const sessionTypeLabel = computed(() => {
return Object.values(PracticeTypes).find(p => p.id === sessionTypeId.value)?.label || " ";
});

// 合計値
const totalArrows = computed(() => stands.value.reduce((sum, s) => sum + s.arrows.length, 0));
const totalHits = computed(() => stands.value.reduce((sum, s) => sum + s.arrows.filter((a) => a.hit).length, 0));

// 記録送信
const handleSubmit = () => {
  const newSession: Session = {
    date: new Date().toISOString(),
    stands: stands.value,
    notes: notes.value,
    sessionTypeId: sessionTypeId.value,
  };
  emit('add-session', newSession);

  // リセット
  standCount.value = 1;
  stands.value = [{ arrows: Array(4).fill({ hit: false }) }];
  notes.value = '';


  showSuccess.value = true;
  setTimeout(() => (showSuccess.value = false), 2000);
};
</script>

<template>
  <v-card>
    <v-card-title>{{ sessionTypeLabel }}記録を追加</v-card-title>
    <v-card-subtitle>本日の練習成果を記録しましょう</v-card-subtitle>

    <v-card-text>
      <v-form @submit.prevent="handleSubmit" class="form-content">
        <!-- 種別選択 -->
        <v-select
          v-model="sessionTypeId"
          :items="Object.values(PracticeTypes).map(p => ({ label: p.label, value: p.id }))"
          label="練習種別"
          item-title="label"
          item-value="value"
        />

        <!-- 立数 -->
        <div class="section">
          <div class="label">立数</div>
          <div class="stand-control">
            <v-btn icon="mdi-minus" variant="outlined" @click="removeStand" :disabled="standCount <= 1" />
            <div class="stand-count">
              <span class="text-h5">{{ standCount }}</span
              ><span class="ml-1 text-grey">立</span>
            </div>
            <v-btn icon="mdi-plus" variant="outlined" @click="addStand" />
          </div>
        </div>

        <!-- 各立 -->
        <div v-for="(stand, sIndex) in stands" :key="sIndex" class="stand-block">
          <div class="stand-header">
            <div class="left">
              <span>第{{ sIndex + 1 }}立</span>
              <div class="arrow-control">
                <v-btn
                  icon="mdi-minus"
                  variant="plain"
                  @click="removeArrowFromStand(sIndex)"
                  :disabled="stand.arrows.length <= 1"
                />
                <span class="arrow-count">{{ stand.arrows.length }}射</span>
                <v-btn icon="mdi-plus" variant="plain" @click="addArrowToStand(sIndex)" />
              </div>
            </div>
            <div class="right">{{ stand.arrows.filter((a) => a.hit).length }}/{{ stand.arrows.length }} 中</div>
          </div>

          <!-- 矢ボタン群 -->
          <div class="arrow-grid">
            <v-btn
              v-for="(arrow, aIndex) in stand.arrows"
              :key="aIndex"
              :color="arrow.hit ? 'success' : undefined"
              :variant="arrow.hit ? 'flat' : 'outlined'"
              class="arrow-btn"
              @click="openDialog(sIndex, aIndex)"
            >
              <v-icon>{{ arrow.hit ? 'mdi-bullseye' : 'mdi-circle-outline' }}</v-icon>
              <span>{{ aIndex + 1 }}</span>
            </v-btn>
          </div>
        </div>

        <!-- 合計 -->
        <v-divider class="my-4" />
        <div class="total">
          <span>合計</span>
          <div class="text-right">
            <div>
              <span class="text-h5">{{ totalHits }}</span>
              <span class="mx-1 text-grey">/</span>
              <span class="text-grey">{{ totalArrows }} 中</span>
            </div>
            <div class="text-caption text-grey">
              {{ totalArrows ? ((totalHits / totalArrows) * 100).toFixed(1) : 0 }}%
            </div>
          </div>
        </div>

        <!-- メモ -->
        <v-textarea
          v-model="notes"
          label="メモ"
          placeholder="気づいたことや改善点などを記録..."
          rows="3"
          variant="outlined"
        />

        <!-- 送信ボタン -->
        <v-btn type="submit" block color="primary" size="large">
          <v-icon start>{{ showSuccess ? 'mdi-check-circle' : 'mdi-content-save' }}</v-icon>
          {{ showSuccess ? '記録しました' : '記録を保存' }}
        </v-btn>
      </v-form>
    </v-card-text>
  </v-card>

  <!-- 的中ダイアログ -->
  <TargetDialog
    v-model:open="dialogOpen"
    v-if="selectedArrow"
    :arrow-number="selectedArrow.arrowIndex + 1"
    :current-position="stands[selectedArrow.standIndex].arrows[selectedArrow.arrowIndex].position"
    @select="handleSelectPosition"
  />
</template>

<style scoped>
.form-content {
  display: flex;
  flex-direction: column;
  gap: 20px;
}

.section {
  display: flex;
  flex-direction: column;
  gap: 8px;
}

.label {
  font-size: 0.9rem;
  color: #555;
}

.stand-control {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 12px;
}

.stand-count {
  text-align: center;
  min-width: 60px;
}

.stand-block {
  background-color: #f8f9fa;
  padding: 16px;
  border-radius: 12px;
  margin-top: 10px;
}

.stand-header {
  display: flex;
  justify-content: space-between;
  margin-bottom: 8px;
  font-weight: 500;
}

.arrow-control {
  display: flex;
  align-items: center;
  gap: 4px;
}

.arrow-count {
  font-size: 0.8rem;
  color: #777;
}

.arrow-grid {
  display: grid;
  gap: 6px;
  grid-template-columns: repeat(auto-fit, minmax(50px, 1fr));
}

.arrow-btn {
  flex-direction: column;
  min-height: 60px;
}

.total {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.text-grey {
  color: #777;
}
</style>
