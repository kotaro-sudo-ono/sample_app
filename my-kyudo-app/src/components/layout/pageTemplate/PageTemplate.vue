<script setup lang="ts"></script>

<template>
  <div class="page-container">
    <!-- 中央にコンテンツ -->
    <div class="content">
      <slot name="content-center"></slot>
    </div>
  </div>
</template>
<style scoped lang="scss">
$navBar: 64px;

.page-container {
  position: relative;
  width: 100%;
  height: calc(100% - $navBar);
}

.content {
  display: flex;
  justify-content: center;
  align-items: center;
  height: 100%;
  padding: 20px;
  background-color: #f9f9f9;
  margin: 10px;
}
</style>
