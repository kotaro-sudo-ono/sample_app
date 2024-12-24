<script setup>
import { ref } from 'vue';
import axios from 'axios';

const email = ref('');
const name = ref('');

const nameValid = (value) => {
  return value ? true : '名前を入力してください。';
};
const rules = {
  required: (value) => !!value || 'Required.',
  counter: (value) => value.length <= 20 || 'Max 20 characters',
  email: (value) => {
    const pattern =
      /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
    return pattern.test(value) || 'Invalid e-mail.';
  },
};
const formIsValid = ref(false);

const submitForm = async () => {
  const data = {
    email: email.value,
    name: name.value,
  };
  console.log('date', data);

  try {
    // Validation
    if (!email.value || !name.value) {
      console.log('入力が正しくありません');
      return;
    }

    const response = await axios.post(
      'http://localhost:8081/user/register',
      data
    );

    console.log('Logged in successfully:', response.data);
  } catch (error) {
    if (error.response) {
      console.error('Error response:', error.response.data);
      console.error('Status code:', error.response.status);
    } else if (error.request) {
      console.error('Error request:', error.request);
    } else {
      console.error('Error:', error.message);
    }
  }
};
</script>

<template>
  <v-container class="container">
    <v-row class="main_content">
      <div class="main_content_set">
        <v-card-title class="headline">Sign Up</v-card-title>
        <v-card-subtitle class="text-center">登録情報を入力</v-card-subtitle>

        <v-form v-model="formIsValid" class="form" @submit.prevent="submitForm">
          <v-text-field
            clearable
            prepend-inner-icon="mdi-email-outline"
            v-model="email"
            label="Email"
            placeholder="johndoe@gmail.com"
            type="email"
            :rules="[rules.counter, rules.email, rules.required]"
            required
            outlined
          ></v-text-field>

          <v-text-field
            prepend-inner-icon="mdi-account"
            clearable
            v-model="name"
            label="name"
            type="name"
            :rules="[nameValid(name)]"
            required
            outlined
          ></v-text-field>

          <v-btn
            class="btn"
            type="submit"
            color="primary"
            block
            :disabled="!formIsValid"
            >Sign In</v-btn
          >
        </v-form>

        <v-divider></v-divider>
      </div>
    </v-row>
  </v-container>
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
</style>
