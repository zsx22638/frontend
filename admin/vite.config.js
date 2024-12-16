import { defineConfig } from 'vite';
import vue from '@vitejs/plugin-vue';
import path from 'path';
import ElementPlus from 'unplugin-element-plus/vite';


export default defineConfig({
  plugins: [
      vue(),
    ElementPlus({ // 自动导入组件样式
    useSource: true,
  })
  ],

  resolve: {
    alias: {
      '@': path.resolve(__dirname, 'src'), // 将 `@` 指向 `src` 目录
    },
  },
  server: {
    port: 8888,
  },
});
