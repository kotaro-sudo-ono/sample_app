<script setup lang="ts">
import { computed, ref } from 'vue';
import PageTemplate from '../shared/pageTemplate/PageTemplate.vue';
import DialogTemplate from '../shared/dialogTemplate/DialogTemplate.vue';
import { useSignUp } from './composable';

const email = ref('');
const name = ref('');
const password = ref('');

const { submitForm, emailError, nameError, passwordError, showEmailError, showNameError, showPasswordError } =
  useSignUp(email, name, password);

const isButtonDisabled = computed(() => {
  return !!showEmailError.value || !!showNameError.value || !!showPasswordError.value;
});
</script>

<template>
  <PageTemplate>
    <template #content-center>
      <DialogTemplate :model-value="true" dialog-title="新規登録">
        <template #content>
          <v-container class="container">
            <v-row class="main_content">
              <div class="main_content_set">
                <v-card-subtitle class="text-center">登録情報を入力</v-card-subtitle>

                <v-form class="form" @submit.prevent="submitForm">
                  <v-text-field
                    clearable
                    prepend-inner-icon="mdi-email-outline"
                    v-model="email"
                    label="Email"
                    placeholder="johndoe@gmail.com"
                    type="email"
                    required
                    outlined
                    :error="!!emailError"
                    :error-messages="emailError"
                  ></v-text-field>

                  <v-text-field
                    prepend-inner-icon="mdi-account"
                    clearable
                    v-model="name"
                    label="name"
                    type="name"
                    required
                    outlined
                    :error="!!nameError"
                    :error-messages="nameError"
                  >
                  </v-text-field>

                  <v-text-field
                    prepend-inner-icon="mdi-key-outline"
                    clearable
                    v-model="password"
                    label="password"
                    type="password"
                    required
                    outlined
                    :error="!!showPasswordError"
                    :error-messages="passwordError"
                  >
                  </v-text-field>
                  <div :class="{ shake: isButtonDisabled }">
                    <v-btn class="btn" type="submit" color="primary" block>登録</v-btn>
                    <span v-if="isButtonDisabled" class="error-message"> 入力内容が正しくありません！ </span>
                  </div>
                </v-form>

                <v-divider></v-divider>
              </div>
            </v-row>
          </v-container>
        </template>
        <template #close>
          <div />
        </template>
      </DialogTemplate>
    </template>
  </PageTemplate>
</template>

<style scoped>
.headline {
  color: #1867c0;
  font-size: 30px;
}
.text-center {
  color: #1867c0;
  font-size: 30px;
}
.container {
  height: 100%;
  max-width: 3000px;
}
.main_content {
  height: 100%;
  align-items: center;
  justify-content: center;
}
.main_content_set {
  width: 600px;
  border-radius: 12px;
  border: 1px solid #1867c0;
}
.btn {
  border-radius: 12px;
}
.form {
  padding: 10px;
}

:deep(.v-input--density-default .v-field--variant-filled) {
  border-radius: 18px;
}

.error-message {
  color: #d32f2f; /* 濃い赤 */
  font-weight: bold;
  font-size: 14px;
  margin-top: 8px;
  display: block;
}

.shake {
  animation: shake 0.82s cubic-bezier(0.36, 0.07, 0.19, 0.97) both;
  transform: translate3d(0, 0, 0);
}

@keyframes shake {
  10%,
  90% {
    transform: translate3d(-1px, 0, 0);
  }

  20%,
  80% {
    transform: translate3d(2px, 0, 0);
  }

  30%,
  50%,
  70% {
    transform: translate3d(-4px, 0, 0);
  }

  40%,
  60% {
    transform: translate3d(4px, 0, 0);
  }
}
</style>
