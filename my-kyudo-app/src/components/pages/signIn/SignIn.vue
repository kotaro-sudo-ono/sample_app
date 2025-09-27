<script setup lang="ts">
import DialogTemplate from '@/components/ui/dialogTemplate/DialogTemplate.vue';
import PageTemplate from '@/components/layout/pageTemplate/PageTemplate.vue';
import Button from '@/components/ui/button/Button.vue';
import { ref } from 'vue';
import { useSignIn } from './composable';

const email = ref('');
const password = ref('');
const showPassword = ref(false);

const { loginForm } = useSignIn(email, password);
</script>

<template>
  <PageTemplate>
    <template #content-center>
      <DialogTemplate :model-value="true" dialog-title="ログイン">
        <template #content>
          <v-container class="container">
            <v-row class="main_content">
              <div class="main_content_set">
                <v-card-subtitle class="text-center">ログイン情報を登録</v-card-subtitle>

                <v-form class="form">
                  <v-text-field
                    clearable
                    prepend-inner-icon="mdi-email-outline"
                    v-model="email"
                    label="Email"
                    placeholder="johndoe@gmail.com"
                    type="email"
                    required
                    outlined
                  ></v-text-field>
                  <v-text-field
                    v-model="password"
                    :type="showPassword ? 'text' : 'password'"
                    label="Password"
                    prepend-inner-icon="mdi-key-outline"
                    :append-inner-icon="showPassword ? 'mdi-eye-off' : 'mdi-eye'"
                    @click:append-inner="showPassword = !showPassword"
                  />

                  <Button text="ログイン" @click-button="loginForm"/>
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

.error-message {
  color: #d32f2f; /* 濃い赤 */
  font-weight: bold;
  font-size: 14px;
  margin-top: 8px;
  display: block;
}
</style>
