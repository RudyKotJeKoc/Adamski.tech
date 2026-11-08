import { defineConfig, type Plugin } from 'vite';
import react from '@vitejs/plugin-react';

/**
 * CSP strony głównej jako <meta> (tylko build produkcyjny — w dev zablokowałaby skrypty HMR).
 * Każdy dokument HTML ma własną politykę: panel /admin/ potrzebuje 'unsafe-eval' (Decap CMS),
 * a strona — nie. Nagłówek w public/_headers zawiera tylko dyrektywy niedostępne w <meta>.
 */
const SITE_CSP = [
  "default-src 'self'",
  "script-src 'self'",
  "style-src 'self' 'unsafe-inline'",
  "img-src 'self' data: https:",
  "font-src 'self'",
  "connect-src 'self'",
  'frame-src https://www.youtube-nocookie.com',
  "media-src 'self'",
  "object-src 'none'",
  "base-uri 'self'",
  "form-action 'self'"
].join('; ');

const cspMeta = (): Plugin => ({
  name: 'adamski-csp-meta',
  apply: 'build',
  transformIndexHtml: {
    order: 'pre',
    handler: (html) =>
      html.replace('<meta charset="utf-8" />', `<meta charset="utf-8" />\n    <meta http-equiv="Content-Security-Policy" content="${SITE_CSP}" />`)
  }
});

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react(), cspMeta()],

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

    // Fonty jako osobne pliki: lżejszy CSS i zgodność z CSP (font-src 'self', bez data:)
    assetsInlineLimit: (filePath: string) => (/\.(woff2?|ttf|otf)$/i.test(filePath) ? false : undefined),

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
