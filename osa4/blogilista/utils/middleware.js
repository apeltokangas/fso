const unknownEndpoint = (request, respond) => {
  respond.status(404).send({ error: 'unknown endpoint' })
}

const errorHandler = (error, request, res, next) => {
  console.error(error.message)
  if (error.name === 'ValidationError') {
    return res.status(400).json({ error: error.message })
  }
  if (error.name === 'CastError') {
    return res.status(400).send({ error: 'malformatted id' })
  }
  next(error)
}

module.exports = { unknownEndpoint, errorHandler }
