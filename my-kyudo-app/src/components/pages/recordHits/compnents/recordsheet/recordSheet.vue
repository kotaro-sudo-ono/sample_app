<script setup lang="ts">
import Button from '@/components/ui/button/Button.vue';
import { computed, ref } from 'vue';

type RecordState = {
  name: string;
  totalShots: number;
  hits: number;
  records: (1 | 0 | undefined)[];
};

const record = ref<RecordState>({
  name: '',
  totalShots: 0,
  hits: 0,
  records: [undefined, undefined, undefined, undefined],
});

const toggleMark = (record: RecordState, index: number) => {
  const current = record.records[index];
  if (current === undefined) record.records[index] = 1;
  else if (current === 1) record.records[index] = 0;
  else record.records[index] = undefined;

  record.hits = record.records.filter((r) => r === 1).length;
  record.totalShots = record.records.filter((r) => r !== undefined).length;
};

const addShot = () => {
  record.value.records.unshift(undefined);
};

const accuracy = computed(() =>
  record.value.totalShots === 0 ? 0 : (record.value.hits / record.value.totalShots) * 100
);
</script>
<template>
  <div class="record-container">
    <Button icon="mdi-plus" @click-button="addShot" class="add-btn" color=""></Button>
    <div class="marks">
      <Button
        v-for="(mark, index) in record.records"
        :key="index"
        class="mark-btn"
        @click="toggleMark(record, index)"
        :text="mark === 1 ? '◯' : mark === 0 ? '✖' : ''"
        color=""
      />
    </div>

    <div class="record-info">
      <p>名前: {{ record.name || 'kotaro' }}</p>
      <p>的中率: {{ accuracy.toFixed(1) }}%</p>
    </div>
  </div>
</template>

<style scoped>
.record-container {
  width: 150px;
  height: 400px; /* 全体の高さを固定して比率が効くようにする */
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 3px;
}

.add-btn {
  margin-bottom: 5%;
}

.marks {
  width: 100%;
  height: 100%;
  overflow-y: scroll;
  display: flex;
  flex-direction: column;
  background-color: #fff;
}

.marks::-webkit-scrollbar {
  display: none; /* Chrome, Safari, 新Edge */
}

.mark-btn {
  width: 100%;
  height: 25%;
  font-size: 32px;
  font-weight: bold;
}

.record-info {
  width: 100%;
  height: 30%; /* 下の情報欄は残り30%のうち25%（少し余白あり） */
  text-align: center;
  display: flex;
  flex-direction: column;
  justify-content: flex-end;
}
</style>
