import { defineConfig } from 'vite';
import vue from '@vitejs/plugin-vue';
import vuetify from 'vite-plugin-vuetify';

// Viteの設定
export default defineConfig({
  plugins: [
    vue(),
    vuetify({
      autoImport: true, // Vuetifyのコンポーネントを自動インポート
    }),
  ],
  optimizeDeps: {
    include: ['vuetify'], // Vuetifyを依存関係としてインクルード
  },
  css: {
    // ViteのCSSの設定を追加
    preprocessorOptions: {
      css: {
        additionalData: `@import "vuetify/styles";`, // Vuetifyのスタイルをインポート
      },
    },
  },
});
