module.exports = {
  apps: [
    {
      name: 'nest-app',
      exec_interpreter: 'node',
      script: './dist/src/main.js',
      exec_mode: 'fork',
      instances: 2,
      autorestart: true,
      watch: false,
      max_memory_restart: '300M',
      env: {
        NODE_ENV: 'production',
      },
    },
  ],
}
