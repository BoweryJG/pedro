import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import { resolve } from 'path'
import { bundleAnalyzer } from './vite-plugin-visualizer'

// https://vite.dev/config/
export default defineConfig(({ mode }) => {
  // const env = loadEnv(mode, process.cwd(), '') // Unused variable
  const isDevelopment = mode === 'development'

  return {
    plugins: [
      react({
        // Reduce bundle size in production by using automatic JSX runtime
        jsxRuntime: 'automatic',
        // Exclude HMR and refresh in production
        ...(isDevelopment ? {} : { fastRefresh: false })
      }),
      bundleAnalyzer()
    ].filter(Boolean),
    
    // Build optimizations
    build: {
      // Output directory
      outDir: 'dist',
      
      // Enable source maps in production for debugging (optional)
      sourcemap: isDevelopment ? 'inline' : false,
      
      // Minification options
      minify: isDevelopment ? false : 'terser',
      terserOptions: {
        compress: {
          drop_console: !isDevelopment,
          drop_debugger: !isDevelopment,
          pure_funcs: !isDevelopment ? ['console.log', 'console.info', 'console.debug'] : []
        },
        format: {
          comments: false
        }
      },
      
      // Enable CSS code splitting
      cssCodeSplit: true,
      
      // Chunk size warnings
      chunkSizeWarningLimit: 500,
      
      // Rollup options for code splitting
      rollupOptions: {
        output: {
          // Manual chunk optimization
          manualChunks: {
            // Vendor chunks
            'react-vendor': ['react', 'react-dom', 'react-router-dom'],
            'mui-vendor': ['@mui/material', '@mui/icons-material', '@emotion/react', '@emotion/styled'],
            'utils': ['axios', 'dayjs', 'zustand'],
            'animation': ['framer-motion', 'gsap', 'react-intersection-observer'],
            'charts': ['@mui/x-charts', '@mui/x-date-pickers'],
            'media': ['react-player', 'swiper'],
            'markdown': ['react-markdown', 'remark-gfm']
          },
          
          // Asset file naming
          assetFileNames: (assetInfo) => {
            const info = assetInfo.name.split('.')
            const ext = info[info.length - 1]
            if (/png|jpe?g|svg|gif|tiff|bmp|ico/i.test(ext)) {
              return `assets/images/[name]-[hash][extname]`
            } else if (/woff|woff2|eot|ttf|otf/i.test(ext)) {
              return `assets/fonts/[name]-[hash][extname]`
            }
            return `assets/[name]-[hash][extname]`
          },
          
          // Chunk file naming
          chunkFileNames: 'js/[name]-[hash].js',
          
          // Entry file naming
          entryFileNames: 'js/[name]-[hash].js'
        },
        
        // Tree shaking
        treeshake: {
          preset: 'recommended',
          moduleSideEffects: false
        }
      },
      
      // Target modern browsers for smaller bundles
      target: 'es2020',
      
      // Asset handling
      assetsInlineLimit: 4096, // 4kb
      
      // CSS minification
      cssMinify: !isDevelopment,
      
      // Report compressed size
      reportCompressedSize: false // Disable to speed up builds
    },
    
    // Optimization options
    optimizeDeps: {
      include: [
        'react',
        'react-dom',
        'react-router-dom',
        '@mui/material',
        '@emotion/react',
        '@emotion/styled'
      ],
      exclude: ['@mui/icons-material'] // Exclude large icon sets from pre-bundling
    },
    
    // Server configuration
    server: {
      port: 5173,
      strictPort: false,
      open: true
    },
    
    // Preview configuration
    preview: {
      port: 4173,
      strictPort: false,
      open: true
    },
    
    // Define global constants
    define: {
      // Replace process.env usage with import.meta.env
      'process.env.NODE_ENV': JSON.stringify(mode),
      // Add build metadata
      __BUILD_DATE__: JSON.stringify(new Date().toISOString()),
      __BUILD_VERSION__: JSON.stringify(process.env.npm_package_version || '0.0.0')
    },
    
    // Resolve configuration
    resolve: {
      alias: {
        '@': resolve(__dirname, './src'),
        '@components': resolve(__dirname, './src/components'),
        '@pages': resolve(__dirname, './src/pages'),
        '@utils': resolve(__dirname, './src/utils'),
        '@hooks': resolve(__dirname, './src/hooks'),
        '@services': resolve(__dirname, './src/services'),
        '@assets': resolve(__dirname, './src/assets')
      }
    },
    
    // Enable caching for faster rebuilds
    cacheDir: 'node_modules/.vite',
    
    // Performance optimizations
    esbuild: {
      // Remove debugger statements in production
      drop: !isDevelopment ? ['debugger'] : [],
      // Legal comments handling
      legalComments: 'none'
    }
  }
})
