<script setup lang="ts"></script>

<template>
  <v-container class="home-container" fluid>
    <v-row justify="center" align="center" class="fill-height">
      <v-col cols="12" sm="8" md="6" class="text-center">
        <div class="crest-icon mb-4">
          <v-icon size="72" color="primary">mdi-bullseye</v-icon>
        </div>

        <h1 class="app-heading mb-2">弓道記録</h1>
        <p class="app-sub mb-8">的中を記録し、稽古の歩みを振り返る</p>

        <v-divider class="divider mb-8" />

        <div class="btn-group">
          <v-btn
            :to="{ name: 'signIn' }"
            color="primary"
            size="large"
            class="auth-btn mb-4"
            block
          >
            ログイン
          </v-btn>
          <v-btn
            :to="{ name: 'signUp' }"
            variant="outlined"
            color="primary"
            size="large"
            class="auth-btn"
            block
          >
            新規登録
          </v-btn>
        </div>
      </v-col>
    </v-row>
  </v-container>
</template>

<style scoped>
.home-container {
  min-height: calc(100vh - 64px);
  display: flex;
  align-items: center;
  background-color: rgb(var(--v-theme-background));
}

.crest-icon {
  opacity: 0.85;
}

.app-heading {
  font-size: 2.4rem;
  font-weight: 700;
  letter-spacing: 0.15em;
  color: rgb(var(--v-theme-primary));
}

.app-sub {
  font-size: 1rem;
  letter-spacing: 0.08em;
  color: rgb(var(--v-theme-on-background));
  opacity: 0.7;
}

.divider {
  max-width: 120px;
  margin: 0 auto;
  border-color: rgb(var(--v-theme-secondary));
  opacity: 0.5;
}

.btn-group {
  max-width: 280px;
  margin: 0 auto;
}

.auth-btn {
  font-weight: 500;
  letter-spacing: 0.1em;
}
</style>
