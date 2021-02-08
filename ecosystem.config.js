require('dotenv').config()

module.exports = {
  apps: [
    {
      name: 'cronAddObjectsToRedis',
      script: 'server.js',
      instance: 1,
      env: {
          APP_NAME: "cronAddObjectsToRedis"
      },
      args: [ 'cron-add-objects-to-redis.js' ]
    },
    {
      name: 'cronGetObjectsFromRedis',
      script: 'server.js',
      instance: 1,
      env: {
          APP_NAME: "cronGetObjectsFromRedis"
      },
      args: [ 'cron-get-objects-from-redis.js' ]
    }
  ]
}
