<script setup lang="ts">
const email = defineModel<string>('email');
const password = defineModel<string>('password');

const resetFields = () => {
  email.value = '';
  password.value = '';
};
</script>

<template>
  <div>
    <div class="input">
      <label for="email">Email</label>
      <input
        id="email"
        autocomplete="off"
        type="text"
        v-model="email"
        placeholder="Enter your email"
      />
    </div>
    <div class="input">
      <label for="password">Password</label>
      <input
        id="password"
        autocomplete="off"
        type="password"
        v-model="password"
        placeholder="password"
      />
    </div>
    <div class="input">
      <v-btn prepend-icon="$vuetify" variant="tonal" @click="resetFields">
        Button
      </v-btn>
    </div>
  </div>
  <router-view />
</template>

<style scoped>
.input {
  display: grid;
  justify-items: center;
  padding: 10px;
}
input {
  border: 2px solid black;
}
</style>
