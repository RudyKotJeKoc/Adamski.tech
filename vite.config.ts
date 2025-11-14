import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],

  build: {
    // Code splitting optimization
    rollupOptions: {
      output: {
        manualChunks: {
          // Vendor chunks for better caching
          'react-vendor': ['react', 'react-dom', 'react-router-dom'],

          // Component chunks (lazy loaded)
          'timeline': ['./src/components/InteractiveTimeline'],
          'audio': ['./src/components/AudioPlayer'],
          'skills': ['./src/components/SkillsOverview', './src/components/RadarChart'],
        },
      },
    },

    // Optimize chunk size
    chunkSizeWarningLimit: 1000,

    // Enable source maps for production debugging (optional)
    sourcemap: false,

    // Minify with terser for better compression
    minify: 'terser',
    terserOptions: {
      compress: {
        drop_console: true, // Remove console.log in production
        drop_debugger: true,
      },
    },
  },

  // Performance optimizations
  server: {
    // Faster HMR
    hmr: {
      overlay: true,
    },
  },

  // CSS code splitting
  css: {
    devSourcemap: true,
  },
});
