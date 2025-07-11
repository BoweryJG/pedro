module.exports = {
  apps: [
    {
      // Application configuration
      name: 'pedro-backend',
      script: './src/index.js',
      
      // Cluster mode configuration
      instances: process.env.NODE_ENV === 'production' ? 'max' : 1,
      exec_mode: process.env.NODE_ENV === 'production' ? 'cluster' : 'fork',
      
      // Memory management
      max_memory_restart: '1G',
      
      // Environment variables
      env: {
        NODE_ENV: 'development',
        PORT: 3001
      },
      env_production: {
        NODE_ENV: 'production',
        PORT: process.env.PORT || 3001
      },
      
      // Restart policies
      min_uptime: '10s',
      max_restarts: 10,
      restart_delay: 4000,
      autorestart: true,
      
      // Graceful shutdown
      kill_timeout: 5000,
      wait_ready: true,
      listen_timeout: 10000,
      
      // Error handling
      error_file: './logs/error.log',
      out_file: './logs/out.log',
      merge_logs: true,
      time: true,
      
      // Log rotation
      log_date_format: 'YYYY-MM-DD HH:mm:ss Z',
      log_type: 'json',
      
      // Development watch configuration
      watch: process.env.NODE_ENV !== 'production',
      watch_delay: 1000,
      ignore_watch: [
        'node_modules',
        'logs',
        '.git',
        '.env*',
        '*.log',
        'uploads',
        'temp',
        '.DS_Store',
        '*.pid',
        'coverage',
        '.nyc_output',
        '.vscode',
        '.idea',
        '*.swp',
        '*.swo',
        '*~',
        'npm-debug.log*',
        'yarn-debug.log*',
        'yarn-error.log*',
        'pnpm-debug.log*',
        '.npm',
        'dist',
        'build',
        '.cache'
      ],
      
      // Additional production optimizations
      node_args: process.env.NODE_ENV === 'production' 
        ? '--max-old-space-size=1024 --optimize-for-size' 
        : '',
      
      // Health monitoring
      cron_restart: '0 2 * * *', // Restart daily at 2 AM
      
      // Source maps support for better error tracking
      source_map_support: true,
      
      // Interpreter arguments
      interpreter_args: '--harmony',
      
      // Working directory
      cwd: './',
      
      // Additional environment-specific configurations
      ...(process.env.NODE_ENV === 'production' && {
        // Production-specific settings
        combine_logs: true,
        vizion: false, // Disable vizion features in production
      })
    }
  ],
  
  // Deploy configuration (optional)
  deploy: {
    production: {
      user: process.env.DEPLOY_USER || 'deploy',
      host: process.env.DEPLOY_HOST || 'your-server.com',
      ref: 'origin/main',
      repo: 'git@github.com:your-repo/pedro.git',
      path: '/var/www/pedro',
      'pre-deploy-local': '',
      'post-deploy': 'cd backend && npm install --production && pm2 reload ecosystem.config.js --env production',
      'pre-setup': ''
    },
    development: {
      user: 'developer',
      host: 'dev.your-server.com',
      ref: 'origin/develop',
      repo: 'git@github.com:your-repo/pedro.git',
      path: '/var/www/pedro-dev',
      'post-deploy': 'cd backend && npm install && pm2 reload ecosystem.config.js --env development',
      env: {
        NODE_ENV: 'development'
      }
    }
  }
};