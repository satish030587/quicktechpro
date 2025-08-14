module.exports = {
  apps: [
    {
      name: 'quicktechpro',
      script: 'npm',
      args: 'start',
      cwd: '/var/www/quicktechpro.in',
      instances: 'max',
      exec_mode: 'cluster',
      env: {
        NODE_ENV: 'production',
        PORT: 3000,
        NEXT_TELEMETRY_DISABLED: 1
      },
      error_file: '/var/log/pm2/quicktechpro-error.log',
      out_file: '/var/log/pm2/quicktechpro-out.log',
      log_file: '/var/log/pm2/quicktechpro.log',
      time: true,
      max_memory_restart: '1G',
      node_args: '--max-old-space-size=1024',
      watch: false,
      ignore_watch: [
        'node_modules',
        '.next',
        'logs'
      ],
      env_production: {
        NODE_ENV: 'production',
        PORT: 3000
      }
    }
  ]
};
