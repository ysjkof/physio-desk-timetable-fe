import { defineConfig, type PluginOption } from 'vite';
import react from '@vitejs/plugin-react';
import { visualizer } from 'rollup-plugin-visualizer';
import mdx from '@mdx-js/rollup';
import remarkGfm from 'remark-gfm';

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [
    react(),
    visualizer({ gzipSize: true }) as unknown as PluginOption, // rollup이나 vite의 version 문제 https://github.com/btd/rollup-plugin-visualizer/issues/127
    mdx({ remarkPlugins: [remarkGfm] }) as unknown as PluginOption,
  ],
});
