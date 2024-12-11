module.exports = {
  apps: [
    {
      name: 'email-validator-frontend',
      script: 'npm',
      args: 'run preview',
      env: {
        NODE_ENV: 'production',
        PORT: 3000
      }
    },
    {
      name: 'email-validator-backend',
      script: 'server/index.js',
      env: {
        NODE_ENV: 'production',
        PORT: 3001
      }
    }
  ]
};