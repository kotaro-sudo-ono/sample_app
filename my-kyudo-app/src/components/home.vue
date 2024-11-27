<script setup lang="ts">
const handleClick = () => {
  console.log('ログイン画面へ');
};
</script>

<template>
  <h1>でろ</h1>
  <div>
    <v-card-title class="text-center">Welcome to KyudoApp</v-card-title>
    <div>
      <v-btn color="red" @click="handleClick"> Click Me </v-btn>
    </div>

    <v-btn color="secondary" to="{ name: 'login' }"> Go to Login </v-btn>
  </div>
</template>

<style scoped></style>
