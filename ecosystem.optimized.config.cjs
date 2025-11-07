module.exports = {
  apps: [
    {
      // Application Name
      name: 'webapp-optimized',
      
      // Use Vite Preview (Much faster than wrangler)
      script: 'npx',
      args: 'vite preview --port 3000 --host 0.0.0.0 --strictPort',
      
      // Working Directory
      cwd: '/home/user/webapp',
      
      // Execution Mode: Cluster for better performance
      exec_mode: 'cluster',
      instances: 2, // Run 2 instances
      
      // Environment Variables
      env: {
        NODE_ENV: 'production',
        PORT: 3000,
        HOST: '0.0.0.0'
      },
      
      // Advanced PM2 Settings
      max_memory_restart: '200M', // Restart if memory exceeds 200MB
      min_uptime: '10s', // Min uptime before considering stable
      max_restarts: 10, // Max restarts in 1 minute
      autorestart: true,
      
      // Logs
      error_file: '/home/user/webapp/logs/error.log',
      out_file: '/home/user/webapp/logs/out.log',
      log_date_format: 'YYYY-MM-DD HH:mm:ss Z',
      merge_logs: true,
      
      // Monitoring
      watch: false, // Disable file watching for production
      ignore_watch: ['node_modules', 'logs', '.git'],
      
      // Performance
      kill_timeout: 5000,
      listen_timeout: 3000,
      shutdown_with_message: true,
      
      // Graceful Shutdown
      wait_ready: true,
      
      // Node.js Options
      node_args: [
        '--max-old-space-size=512', // Max heap size 512MB
        '--optimize_for_size' // Optimize for size not speed
      ]
    },
    
    // Alternative: Simple single instance (fallback)
    {
      name: 'webapp-simple',
      script: 'npx',
      args: 'vite preview --port 3001 --host 0.0.0.0',
      exec_mode: 'fork',
      instances: 1,
      autorestart: true,
      max_memory_restart: '150M',
      env: {
        NODE_ENV: 'production',
        PORT: 3001
      },
      enabled: false // Disabled by default
    }
  ]
}
