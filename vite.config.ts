import tailwindcss from '@tailwindcss/vite';
import react from '@vitejs/plugin-react';
import svgr from 'vite-plugin-svgr';
import { defineConfig, loadEnv } from 'vite';
import { fileURLToPath, URL } from 'node:url';

export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, process.cwd(), '');
  return {
    plugins: [react(), tailwindcss(), svgr()],
    resolve: {
      alias: { '@': fileURLToPath(new URL('./src', import.meta.url)) },
    },
    server: {
      port: 3000,
      strictPort: true,
      proxy: env.API_PROXY_TARGET
        ? {
            '/backend': {
              target: env.API_PROXY_TARGET,
              changeOrigin: true,
              rewrite: (path) => path.replace(/^\/backend/, ''),
              configure: (proxy) => {
                proxy.on('proxyReq', (request) => request.removeHeader('origin'));
              },
            },
          }
        : undefined,
    },
  };
});
