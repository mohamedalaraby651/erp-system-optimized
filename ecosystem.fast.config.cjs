module.exports = {
  apps: [{
    name: 'webapp-fast',
    script: 'npx',
    args: 'vite preview --port 3000 --host 0.0.0.0',
    cwd: '/home/user/webapp',
    exec_mode: 'fork',
    instances: 1,
    autorestart: true,
    max_memory_restart: '150M',
    min_uptime: '5s',
    max_restarts: 5,
    env: {
      NODE_ENV: 'production',
      PORT: 3000
    },
    error_file: './logs/error.log',
    out_file: './logs/out.log',
    log_date_format: 'YYYY-MM-DD HH:mm Z'
  }]
}
