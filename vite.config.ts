import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  server: {
    watch: {
      usePolling: true,
    },
    hmr: {
      overlay: true,
      // Thêm cấu hình để ổn định HMR
      clientPort: 5173,
      protocol: 'ws',
    },
    port: 5173,
    host: true,
  },
});