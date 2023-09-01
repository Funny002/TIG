import vue from '@vitejs/plugin-vue';
import { defineConfig } from 'vite';
import { resolve } from 'path';

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [vue()],
  cacheDir: './cache',
  publicDir: './public',
  resolve: {
    alias: {
      '@': resolve(__dirname, 'src'),
      '@games': resolve(__dirname, 'games'),
      '@utils': resolve(__dirname, 'src/utils'),
      '@views': resolve(__dirname, 'src/views'),
      '@modules': resolve(__dirname, 'src/components'),
    },
  },
});
