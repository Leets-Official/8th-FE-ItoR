import { fileURLToPath, URL } from 'node:url';
import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import tailwindcss from '@tailwindcss/vite';

export default defineConfig({
  plugins: [react(), tailwindcss()],
  resolve: {
    alias: { '@': fileURLToPath(new URL('./src', import.meta.url)) },
  },
  // 서버가 카카오에 넘기는 redirect_uri가 http://localhost:3000/oauth/kakao/success로 고정되어 있다
  server: { port: 3000, strictPort: true },
});
