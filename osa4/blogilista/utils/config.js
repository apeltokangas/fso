require('dotenv').config()

const PORT = process.env.PORT
const mongourl = process.env.MONGODB_URI

module.exports = { mongourl, PORT }