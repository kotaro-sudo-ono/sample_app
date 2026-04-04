<script setup lang="ts">
import Button from '@/components/ui/button/Button.vue';
import { ref } from 'vue';
import { useSignIn } from './composable';

const email = ref('');
const password = ref('');
const showPassword = ref(false);

const { loginForm, loginError } = useSignIn(email, password);
</script>

<template>
  <div class="auth-page">
    <header class="auth-header">
      <v-btn variant="text" :to="{ name: 'homeGuest' }" prepend-icon="mdi-chevron-left" color="primary">
        弓道記録
      </v-btn>
    </header>

    <main class="auth-main">
      <v-card class="auth-card" elevation="0" rounded="lg">
        <div class="auth-card-header">
          <v-icon size="40" color="primary">mdi-bullseye</v-icon>
          <h1 class="auth-title">ログイン</h1>
          <p class="auth-subtitle">稽古の記録へ</p>
        </div>

        <v-divider class="my-4" />

        <v-form class="auth-form">
          <v-text-field
            clearable
            prepend-inner-icon="mdi-email-outline"
            v-model="email"
            label="メールアドレス"
            placeholder="johndoe@gmail.com"
            type="email"
            variant="outlined"
            color="primary"
          />
          <v-text-field
            v-model="password"
            :type="showPassword ? 'text' : 'password'"
            label="パスワード"
            prepend-inner-icon="mdi-key-outline"
            :append-inner-icon="showPassword ? 'mdi-eye-off' : 'mdi-eye'"
            @click:append-inner="showPassword = !showPassword"
            variant="outlined"
            color="primary"
          />

          <span v-if="loginError" class="error-message">{{ loginError }}</span>

          <Button text="ログイン" @click-button="loginForm" />
        </v-form>

        <div class="auth-footer">
          <span class="auth-footer-text">アカウントをお持ちでない方は</span>
          <v-btn variant="text" color="primary" :to="{ name: 'signUp' }" size="small">
            新規登録
          </v-btn>
        </div>
      </v-card>
    </main>
  </div>
</template>

<style scoped>
.auth-page {
  min-height: 100vh;
  background: rgb(var(--v-theme-background));
  display: flex;
  flex-direction: column;
}

.auth-header {
  padding: 12px 16px;
}

.auth-main {
  flex: 1;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 24px 16px;
}

.auth-card {
  width: 100%;
  max-width: 420px;
  padding: 32px 28px;
  border: 1px solid rgba(59, 42, 26, 0.2);
  background: rgb(var(--v-theme-surface));
}

.auth-card-header {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 8px;
  margin-bottom: 4px;
}

.auth-title {
  font-size: 1.6rem;
  font-weight: 700;
  letter-spacing: 0.12em;
  color: rgb(var(--v-theme-primary));
  margin: 0;
}

.auth-subtitle {
  font-size: 0.875rem;
  color: rgba(59, 42, 26, 0.6);
  margin: 0;
  letter-spacing: 0.05em;
}

.auth-form {
  display: flex;
  flex-direction: column;
  gap: 4px;
}

.error-message {
  color: rgb(var(--v-theme-error));
  font-size: 0.875rem;
  font-weight: 600;
}

.auth-footer {
  display: flex;
  align-items: center;
  justify-content: center;
  margin-top: 16px;
  flex-wrap: wrap;
}

.auth-footer-text {
  font-size: 0.875rem;
  color: rgba(59, 42, 26, 0.6);
}
</style>
