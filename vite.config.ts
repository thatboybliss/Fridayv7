import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

// Vercel exposes env vars to the build process directly.
// We support both plain names (set in Vercel dashboard) and VITE_ prefixed names.
const resolveEnv = (key: string) =>
  process.env[key] || process.env[`VITE_${key}`] || '';

export default defineConfig({
  plugins: [react()],
  define: {
    'process.env.GEMINI_API_KEY': JSON.stringify(resolveEnv('GEMINI_API_KEY')),
    'process.env.ANTHROPIC_API_KEY': JSON.stringify(resolveEnv('ANTHROPIC_API_KEY')),
    'process.env.GROK_API_KEY': JSON.stringify(resolveEnv('GROK_API_KEY')),
  },
  server: {
    port: 3000,
    host: true,
    headers: {
      // Required locally for SharedArrayBuffer (Web Audio API)
      'Cross-Origin-Opener-Policy': 'same-origin',
      'Cross-Origin-Embedder-Policy': 'require-corp',
    },
  },
  build: {
    outDir: 'dist',
    sourcemap: false,
    rollupOptions: {
      output: {
        manualChunks: {
          vendor: ['react', 'react-dom'],
          genai: ['@google/genai'],
          anthropic: ['@anthropic-ai/sdk'],
        },
      },
    },
  },
});
