<template>
  <div class="page-container">
    <!-- 左上 -->
    <div class="corner top-left">
      <slot name="top-left"></slot>
    </div>

    <!-- 右上 -->
    <div class="corner top-right">
      <slot name="top-right"></slot>
    </div>

    <!-- 左下 -->
    <div class="corner bottom-left">
      <slot name="bottom-left"></slot>
    </div>

    <!-- 右下 -->
    <div class="corner bottom-right">
      <slot name="bottom-right"></slot>
    </div>

    <!-- 中央にコンテンツ -->
    <div class="content">
      <slot name="content-center"></slot>
      <!-- ダイアログの表示ボタン -->
    </div>
  </div>
</template>

<script setup></script>

<style scoped lang="scss">
$navBar: 64px;

.page-container {
  position: relative;
  width: 100%;
  height: calc(100% - $navBar);
}

.corner {
  position: absolute;
  width: 300px;
  height: 50px;
  background-color: rgba(0, 0, 0, 0.1);
  padding: 10px;
}

.top-left {
  top: 0;
  left: 0;
}

.top-right {
  top: 0;
  right: 0;
}

.bottom-left {
  bottom: 0;
  left: 0;
}

.bottom-right {
  bottom: 0;
  right: 0;
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

button {
  padding: 10px 20px;
  font-size: 16px;
  cursor: pointer;
}

.dialog button {
  margin-top: 20px;
}
</style>
