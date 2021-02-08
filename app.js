const uuid = require('uuid')
const fs = require('fs')
const { format, differenceInMilliseconds } = require('date-fns')

const logger = require('./logger')
const cache = require('./cache')
const model = require('./model.json')

const addObjectsToRedis = async () => {
    const ids = []
    const items = []
    try {

        for (const position of Array.from(Array(10000).keys())) {
            const data = [...model]
            const id = uuid.v4()
            data[2] = `${id}`
            items.push(data)
        }

        for (const item of items) {
            const id = item[2]
            const before = new Date()
            const result = await cache.set(`objects.${id}`, JSON.stringify(item), 'EX', 43200)
            const after = new Date()
            const timeLeft = differenceInMilliseconds(after, before)
            ids.push(id)
            logger.info('Objeto adicionado ao redis', { result, id, timeLeft })
        }

        try {
            const currentFileAsString = fs.readFileSync('report.json', { encoding:'utf8', flag:'r' })
            const earlierItems = JSON.parse(currentFileAsString)
            const newItems = [ ...earlierItems, ...ids]
            fs.writeFileSync('report.json', JSON.stringify(newItems, null, 4))
        } catch (err) {
            fs.writeFileSync('report.json', JSON.stringify(ids, null, 4))
        }

        return {
            total: ids.length
        }
    } catch (err) {
        logger.error(err)
    }

}

const getObjectsFromRedis = async () => {
    try {
        const reportAsString = fs.readFileSync('report.json', { encoding:'utf8', flag:'r' })
        const items = JSON.parse(reportAsString)
        const result = []
    
        for (const position of Array.from(Array(50).keys())) {
            const index = Math.floor(Math.random() * ((items.length -1) - 0 + 1)) + 0
            const id = items[index]
            const before = new Date()
            const itemFromCache = await cache.get(`objects.${id}`)
            const after = new Date()
            const timeLeft = differenceInMilliseconds(after, before)
            const parsedItem = JSON.parse(itemFromCache)
            result.push(timeLeft)
        }

        const slowestExecution = Math.max.apply(null, result)
        return {
            slowestExecution
        }
    } catch (err) {
        if (err.code === 'ENOENT') {
            logger.info('Arquivo report.json não existe ainda')
        } else {
            logger.error(err)
        }
        return {}
    }

}

module.exports = {
    addObjectsToRedis,
    getObjectsFromRedis
}