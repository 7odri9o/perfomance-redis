const { CronJob } = require('cron')

const logger = require('./logger')
const app = require('./app')

const execute = async () => {
    
    let isRunning = false
    logger.info('Cron Get Objects From Redis - Antes da Criação do Job')

    const onComplete = function (job, result) {
        const nextDate = job.nextDates().format('YYYY-MM-DD HH:mm:ss')
        const nextRun = `Próxima Execução: ${nextDate}`
        logger.info('Cron Get Objects From Redis - Execução finalizada', { nextRun, result })
      }
    

    const onTick = async function () {
        if (!isRunning) {
        isRunning = true

        try {
            const result = await app.getObjectsFromRedis()
            job.onComplete(job, result)
        } catch (err) {
            logger.error(err)
        }

        isRunning = false
        } else {
        const result = {
            triggeredIncidents: 0,
            message: 'O cron já está em execução'
        }
        logger.info(`Cron Get Objects From Redis - ${result.message}`)
        job.onComplete(job, result)
        }
    }

    const job = new CronJob('*/10 * * * * *', onTick, onComplete, false, 'America/Sao_Paulo')

    logger.info('Cron Get Objects From Redis - Depois da Criação do Job')

    job.start()

}

module.exports = {
    execute
}