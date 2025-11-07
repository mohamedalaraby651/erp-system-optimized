import { defineConfig } from 'vite'
import pages from '@hono/vite-cloudflare-pages'
import { viteStaticCopy } from 'vite-plugin-static-copy'
import viteCompression from 'vite-plugin-compression'

export default defineConfig({
  plugins: [
    pages(),
    // Copy static files
    viteStaticCopy({
      targets: [
        {
          src: 'public/static/*',
          dest: 'static'
        }
      ]
    }),
    // GZIP Compression
    viteCompression({
      verbose: true,
      disable: false,
      threshold: 10240, // Only compress files > 10KB
      algorithm: 'gzip',
      ext: '.gz',
      deleteOriginFile: false
    }),
    // Brotli Compression (better than GZIP)
    viteCompression({
      verbose: true,
      disable: false,
      threshold: 10240,
      algorithm: 'brotliCompress',
      ext: '.br',
      deleteOriginFile: false
    })
  ],
  
  // Development Server Configuration
  server: {
    port: 3000,
    host: '0.0.0.0',
    strictPort: true,
    hmr: {
      overlay: true
    },
    cors: true,
    headers: {
      'Cache-Control': 'no-cache',
      'Access-Control-Allow-Origin': '*'
    }
  },
  
  // Build Configuration
  build: {
    outDir: 'dist',
    assetsDir: 'assets',
    emptyOutDir: true,
    
    // Minification
    minify: 'terser',
    terserOptions: {
      compress: {
        drop_console: true, // Remove console.log in production
        drop_debugger: true,
        pure_funcs: ['console.log', 'console.info', 'console.debug']
      },
      format: {
        comments: false // Remove comments
      }
    },
    
    // Source maps (disable for production)
    sourcemap: false,
    
    // CSS Code Splitting
    cssCodeSplit: true,
    
    // Chunk Size Warnings
    chunkSizeWarningLimit: 500,
    
    // Rollup Options
    rollupOptions: {
      output: {
        // Manual chunks for better caching
        manualChunks: {
          // Vendor libraries
          'vendor-charts': ['chart.js'],
          'vendor-http': ['axios'],
          'vendor-excel': ['xlsx'],
          'vendor-pdf': ['jspdf', 'html2canvas'],
          
          // Core application
          'core-app': ['/src/index.tsx'],
          'core-routes': [
            '/src/routes/auth.ts',
            '/src/routes/users.ts',
            '/src/routes/dashboard.ts'
          ]
        },
        
        // Asset file naming
        assetFileNames: (assetInfo) => {
          const info = assetInfo.name.split('.')
          const ext = info[info.length - 1]
          
          if (/png|jpe?g|svg|gif|tiff|bmp|ico/i.test(ext)) {
            return `assets/images/[name]-[hash][extname]`
          }
          if (/woff|woff2|eot|ttf|otf/i.test(ext)) {
            return `assets/fonts/[name]-[hash][extname]`
          }
          return `assets/[name]-[hash][extname]`
        },
        
        // Chunk file naming
        chunkFileNames: 'assets/js/[name]-[hash].js',
        entryFileNames: 'assets/js/[name]-[hash].js'
      }
    },
    
    // Asset inlining (inline small files as base64)
    assetsInlineLimit: 4096 // 4KB
  },
  
  // Optimization
  optimizeDeps: {
    include: [
      'chart.js',
      'axios'
    ],
    exclude: [
      'wrangler'
    ]
  },
  
  // CSS Configuration
  css: {
    postcss: {
      plugins: [
        require('cssnano')({
          preset: ['default', {
            discardComments: {
              removeAll: true
            },
            normalizeWhitespace: true,
            minifyFontValues: true,
            minifyGradients: true
          }]
        })
      ]
    }
  },
  
  // Performance
  esbuild: {
    drop: ['console', 'debugger'], // Remove console and debugger in production
    legalComments: 'none',
    minifyIdentifiers: true,
    minifySyntax: true,
    minifyWhitespace: true
  }
})
