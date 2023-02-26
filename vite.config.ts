/// <reference types="vitest" />
import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import { visualizer } from 'rollup-plugin-visualizer';
import mdx from '@mdx-js/rollup';
import remarkGfm from 'remark-gfm';

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [
    react(),
    visualizer({ gzipSize: true }),
    mdx({ remarkPlugins: [remarkGfm] }),
  ],
  test: {
    include: ['test/*'],
    coverage: { provider: 'c8', reporter: ['html-spa'] },
  },
});
