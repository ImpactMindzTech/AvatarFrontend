import react from '@vitejs/plugin-react';
import { defineConfig } from 'vite';
import path from 'path';
import { visualizer } from 'rollup-plugin-visualizer';
import compression from 'vite-plugin-compression';

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [
    react(),
    visualizer({ open: true }),
    compression({ // Add this section
      verbose: true,
      disable: false,
      threshold: 10240, // Only compress files larger than this size
      algorithm: 'gzip', // You can also use 'brotliCompress'
      ext: '.gz', // File extension for compressed files
    }),
  ],

  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
  },
  build: {
    rollupOptions: {
      output: {
        manualChunks(id) {
          // Create a vendor chunk for node_modules
          if (id.includes('node_modules')) {
            return 'vendor';
          }
          // Create a components chunk for your components
          if (id.includes('src/components')) {
            return 'components';
          }
          // You can add additional conditions to split other chunks as needed
        },
      },
      chunkSizeWarningLimit: 600, // Adjust the limit as needed
    },
  },
});