import {defineConfig} from 'vite';
import react from '@vitejs/plugin-react';
import path from 'path';
import {splitVendorChunkPlugin} from 'vite';
import {createHtmlPlugin} from 'vite-plugin-html';
import fs from 'fs';

// Safety check: if hash.json doesn't exist, use an empty object string
const getHash = () => {
  try {
    return fs.readFileSync('public/definitions/hash.json', 'utf8');
  } catch (e) {
    return '{}';
  }
};

const hash = getHash();

// https://vitejs.dev/config/
export default defineConfig({
  // Set to '/' for custom domains like configurator.stuple.net
  base: '/', 
  plugins: [
    react(),
    createHtmlPlugin({
      inject: {
        data: {
          hash,
        },
      },
    }),
    splitVendorChunkPlugin(),
  ],
  assetsInclude: ['**/*.glb'],
  envDir: '.',
  server: {open: true},
  resolve: {
    alias: {
      src: path.resolve(__dirname, './src'),
      assets: path.resolve(__dirname, './src/assets'),
    },
  },
  build: {
    // This helps with the 'Some chunks are larger than 500 kBs' warning you saw
    chunkSizeWarningLimit: 1000, 
  },
  optimizeDeps: {
    include: ['@the-via/reader'],
    esbuildOptions: {
      define: {
        global: 'globalThis',
      },
      plugins: [],
    },
  },
});