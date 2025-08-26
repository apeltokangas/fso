const app = require('./app')
const config = require('./utils/config')
const mongoose = require('mongoose')
const logger = require('./utils/logger')


mongoose.connect(config.mongourl)
    .then(() => {
        logger.info('connected to MongoDB')
        app.listen(config.PORT, () => {
            logger.info(`Server running on port ${config.PORT}`)
        })
    })
    .catch((error) => {
        logger.error('error connecting to MongoDB:', error.message)
    })