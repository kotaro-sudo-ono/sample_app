<script setup lang="ts">
import TargetDialog from '../targetDialog/targetDialog.vue';
import { PracticeTypes } from '@/types/practiceType';
import type { PracticeSession } from '@/store/practice';
import { useRecordSession } from './composable';

type StandData = { arrows: { hit: boolean; position?: { x: number; y: number } }[] };
type SessionData = { date: string; stands: StandData[]; notes: string; sessionTypeId: number };

const props = defineProps<{ editSession?: PracticeSession }>();

const emit = defineEmits<{
  (e: 'add-session', session: SessionData): void;
  (e: 'update-session', session: SessionData & { id: string }): void;
}>();

const {
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
  handleSubmit,
} = useRecordSession(emit, props.editSession);

const isEditMode = !!props.editSession;
</script>

<template>
  <v-card>
    <v-card-title>{{ isEditMode ? '記録を編集' : `${sessionTypeLabel}記録を追加` }}</v-card-title>
    <v-card-subtitle>{{ isEditMode ? '内容を変更して保存してください' : '本日の練習成果を記録しましょう' }}</v-card-subtitle>

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
              :color="arrow.hit ? 'success' : arrow.position ? 'error' : undefined"
              :variant="arrow.hit || arrow.position ? 'flat' : 'outlined'"
              class="arrow-btn"
              @click="openDialog(sIndex, aIndex)"
            >
              <v-icon>{{ arrow.hit ? 'mdi-bullseye' : arrow.position ? 'mdi-close' : 'mdi-circle-outline' }}</v-icon>
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
          {{ isEditMode ? '変更を保存' : showSuccess ? '記録しました' : '記録を保存' }}
        </v-btn>
      </v-form>
    </v-card-text>
  </v-card>

  <!-- 的中ダイアログ -->
  <TargetDialog
    v-model:open="dialogOpen"
    v-if="selectedArrow"
    :arrow-number="selectedArrow.arrowIndex + 1"
    :current-position="stands[selectedArrow.standIndex]?.arrows[selectedArrow.arrowIndex]?.position"
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
