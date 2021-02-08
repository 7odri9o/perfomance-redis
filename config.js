module.exports = {
    nodeEnv: process.env.NODE_ENV,
    appName: process.env.APP_NAME,
    logger: {
        errorLogPathFile: process.env.ERROR_LOG_PATH_FILE,
        combinedLogPathFile: process.env.COMBINED_LOG_PATH_FILE
    },
    redis: {
        port: process.env.REDIS_PORT,
        host: process.env.REDIS_HOST
    }
}