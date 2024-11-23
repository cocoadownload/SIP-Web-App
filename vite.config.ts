/// <reference types="vitest" />

import legacy from '@vitejs/plugin-legacy'
import react from '@vitejs/plugin-react'
import { defineConfig } from 'vite'
import dotenv from "dotenv";

dotenv.config();
// https://vitejs.dev/config/

export default defineConfig({
  plugins: [
    react(),
    legacy()
  ],  define: {
    "process.env": {
      SIP_USERNAME: JSON.stringify(process.env.SIP_USERNAME),
      SIP_PASSWORD: JSON.stringify(process.env.SIP_PASSWORD),
      SIP_SERVER: JSON.stringify(process.env.SIP_SERVER),
    },
  test: {
    globals: true,
    environment: 'jsdom',
    setupFiles: './src/setupTests.ts',
  }
}
})
