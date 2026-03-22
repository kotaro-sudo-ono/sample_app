import vue from '@vitejs/plugin-vue';
import path from 'path';
import { defineConfig } from 'vite';
import vuetify from 'vite-plugin-vuetify';

export default defineConfig({
  plugins: [
    vue(),
    vuetify({ autoImport: true }), // これでコンポーネント自動importされる
  ],
  resolve: {
    alias: {
      '@': path.resolve(__dirname, 'src'), // ここで @ を src にマッピング
    },
  },
  server: {
    port: 5173,
    proxy: {
      '/api': 'http://localhost:8081',
    },
  },
});
