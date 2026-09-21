import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import path from 'path';

export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: {
      '@midnight-ntwrk/midnight-js-network-id': path.resolve(__dirname, 'src/shims/midnight-sdk.ts'),
      '@midnight-ntwrk/dapp-connector-api': path.resolve(__dirname, 'src/shims/midnight-sdk.ts'),
      '@midnight-ntwrk/compact-runtime': path.resolve(__dirname, 'src/shims/midnight-sdk.ts')
    }
  },
  server: {
    port: 5173,
    host: true
  }
});
