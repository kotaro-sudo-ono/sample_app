<script setup>
import { ref } from 'vue';
import axios from 'axios';
import { useRouter } from 'vue-router';

const email = ref('');
const name = ref('');
const emailRules = [
  (v) => !!v || 'Email is required',
  (v) => /.+@.+\..+/.test(v) || 'E-mail must be valid',
];
const nameRules = [
  (v) => !!v || 'name is required',
  (v) => (v && v.length >= 6) || 'name must be at least 6 characters',
];
</script>

<template>
  <v-container class="content">
    <v-row class="row-content">
      <div class="main-content">
        <v-card-title class="headline">Log In</v-card-title>

        <div>Account</div>

        <v-text-field
          density="compact"
          placeholder="Email address"
          prepend-inner-icon="mdi-email-outline"
          variant="outlined"
        ></v-text-field>

        <div class="word-container">
          Password

          <a href="#" rel="noopener noreferrer" target="_blank">
            Forgot logIn password?</a
          >
        </div>

        <v-text-field
          :append-inner-icon="visible ? 'mdi-eye-off' : 'mdi-eye'"
          :type="visible ? 'text' : 'password'"
          density="compact"
          placeholder="Enter your password"
          prepend-inner-icon="mdi-lock-outline"
          variant="outlined"
          @click:append-inner="visible = !visible"
        ></v-text-field>

        <v-btn class="mb-8" color="blue" size="large" variant="tonal" block>
          Log In
        </v-btn>

        <v-list-item class="link" link to="/signUp">
          Sign up now <v-icon icon="mdi-chevron-right"></v-icon>
        </v-list-item>
      </div>
    </v-row>
  </v-container>
</template>

<style scoped>
.content {
  height: 100%;
  max-width: 3000px;
}
.row-content {
  height: 100%;
  align-items: center;
  justify-content: center;
}
.headline {
  color: #1867c0;
  font-size: 30px;
}
.main-content {
  width: 600px;
  padding: 20px;
  border: 1px solid #1867c0;
  border-radius: 12px;
}
.word-container {
  display: flex;
  align-items: center;
  justify-content: space-between;
}
.link {
  justify-items: center;
}
</style>
