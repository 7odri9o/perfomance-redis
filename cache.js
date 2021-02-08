const redis = require("redis")
const util = require("util")

const config = require('./config')

const redisClient = redis.createClient(config.redis)

const cache = {
  get: util.promisify(redisClient.get).bind(redisClient),
  set: util.promisify(redisClient.set).bind(redisClient),
}

module.exports = cache
