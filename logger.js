const winston = require('winston')

const config = require('./config')

const logger = winston.createLogger({
  level: 'info',
  format: winston.format.combine(
    winston.format.timestamp({
      format: 'YYYY-MM-DD HH:mm:ss'
    }),
    winston.format.errors({ stack: true }),
    winston.format.splat(),
    winston.format.json()
  ),
  defaultMeta: { service: config.appName },
  transports: [
    new winston.transports.File({ filename: config.logger.errorLogPathFile === undefined ? 'logs/error.log' : config.logger.errorLogPathFile, level: 'error' }),
    new winston.transports.File({ filename: config.logger.combinedLogPathFile === undefined ? 'logs/combined.log' : config.logger.combinedLogPathFile })
  ]
})

if (config.nodeEnv !== 'production' && config.nodeEnv !== 'test') {
  logger.add(new winston.transports.Console({
    format: winston.format.combine(
      winston.format.prettyPrint()
    )
  }))
}

module.exports = logger
