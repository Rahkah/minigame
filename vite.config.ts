import { defineConfig } from 'vite';

export default defineConfig({
  // Relative base ensures assets load reliably on GitHub Pages subpath (/minigame/) and custom domains.
  base: './',
  server: {
    host: true,
    port: 5173,
  },
  preview: {
    host: true,
    port: 4173,
  },
  build: {
    outDir: 'dist',
    assetsDir: 'assets',
    target: 'es2020',
    sourcemap: false,
  },
});
