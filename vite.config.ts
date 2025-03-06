import path from 'path';
import react from '@vitejs/plugin-react';
import { defineConfig } from 'vite';

export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'),
    },
  },
  server: {
    allowedHosts: [
      'localhost',                       // Keep localhost for local development
      'c87e2057b542ad7a28db871d02912ff7.serveo.net', // Specific Serveo host
      '*.serveo.net'                     // Wildcard for all Serveo subdomains
    ]
  }
});