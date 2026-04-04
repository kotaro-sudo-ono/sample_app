<script setup lang="ts">
import { useRoutePage } from './composable';

const { toRecordCalender, toRecordHits, toRecordHistory } = useRoutePage();

type NavCard = {
  label: string;
  description: string;
  icon: string;
  action: () => void;
};

const navCards: NavCard[] = [
  {
    label: '記録確認',
    description: 'カレンダーで稽古を振り返る',
    icon: 'mdi-calendar-month',
    action: toRecordCalender,
  },
  {
    label: '記録入力',
    description: '今日の的中を記録する',
    icon: 'mdi-bullseye',
    action: toRecordHits,
  },
  {
    label: '記録を見る',
    description: '過去の記録を一覧で確認する',
    icon: 'mdi-chart-bar',
    action: toRecordHistory,
  },
];
</script>

<template>
  <v-container class="dashboard-container">
    <h2 class="dashboard-heading mb-6">稽古メニュー</h2>

    <v-row>
      <v-col
        v-for="card in navCards"
        :key="card.label"
        cols="12"
        sm="4"
      >
        <v-card
          class="nav-card"
          color="surface"
          elevation="2"
          rounded="lg"
          @click="card.action"
          hover
        >
          <v-card-text class="text-center pa-6">
            <v-icon size="48" color="primary" class="mb-3">{{ card.icon }}</v-icon>
            <div class="card-label mb-1">{{ card.label }}</div>
            <div class="card-desc">{{ card.description }}</div>
          </v-card-text>
        </v-card>
      </v-col>
    </v-row>
  </v-container>
</template>

<style scoped>
.dashboard-container {
  padding-top: 32px;
}

.dashboard-heading {
  font-size: 1.2rem;
  font-weight: 700;
  letter-spacing: 0.1em;
  color: rgb(var(--v-theme-primary));
  text-align: center;
}

.nav-card {
  cursor: pointer;
  border: 1px solid rgba(var(--v-theme-primary), 0.15);
  transition: box-shadow 0.2s, transform 0.15s;
}

.nav-card:hover {
  transform: translateY(-2px);
}

.card-label {
  font-size: 1.1rem;
  font-weight: 700;
  letter-spacing: 0.08em;
  color: rgb(var(--v-theme-primary));
}

.card-desc {
  font-size: 0.85rem;
  color: rgb(var(--v-theme-on-surface));
  opacity: 0.7;
  letter-spacing: 0.03em;
}
</style>
