import { defineConfig } from 'vitest/config';
import react from '@vitejs/plugin-react';
import * as dotenv from 'dotenv';

export default defineConfig({
  plugins: [
    react(),
  ],
  test: {
    env: dotenv.config({ path: '.env.test' }).parsed,
    exclude: ['.vercel', '.next', 'node_modules'],
  },
});
