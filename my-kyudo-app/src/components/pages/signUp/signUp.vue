<script setup lang="ts">
import { computed, ref } from 'vue';
import { useSignUp } from './composable';
import Button from '@/components/ui/button/Button.vue';

const email = ref('');
const name = ref('');
const password = ref('');
const showPassword = ref(false);

const { submitForm, emailError, nameError, passwordError, showEmailError, showNameError, showPasswordError } =
  useSignUp(email, name, password);

const isButtonDisabled = computed(() => {
  return !!showEmailError.value || !!showNameError.value || !!showPasswordError.value;
});
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
          <h1 class="auth-title">新規登録</h1>
          <p class="auth-subtitle">弓道の歩みを記録する</p>
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
            :error="!!emailError"
            :error-messages="emailError"
          />

          <v-text-field
            prepend-inner-icon="mdi-account"
            clearable
            v-model="name"
            label="ユーザー名"
            variant="outlined"
            color="primary"
            :error="!!nameError"
            :error-messages="nameError"
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
            :error="!!passwordError"
            :error-messages="passwordError"
          />

          <div :class="{ shake: isButtonDisabled }">
            <Button text="登録" @clickButton="submitForm" />
            <span v-if="isButtonDisabled" class="error-message">入力内容が正しくありません！</span>
          </div>
        </v-form>

        <div class="auth-footer">
          <span class="auth-footer-text">すでにアカウントをお持ちの方は</span>
          <v-btn variant="text" color="primary" :to="{ name: 'signIn' }" size="small">
            ログイン
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
  display: block;
  margin-top: 8px;
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

.shake {
  animation: shake 0.82s cubic-bezier(0.36, 0.07, 0.19, 0.97) both;
  transform: translate3d(0, 0, 0);
}

@keyframes shake {
  10%, 90% { transform: translate3d(-1px, 0, 0); }
  20%, 80% { transform: translate3d(2px, 0, 0); }
  30%, 50%, 70% { transform: translate3d(-4px, 0, 0); }
  40%, 60% { transform: translate3d(4px, 0, 0); }
}
</style>
