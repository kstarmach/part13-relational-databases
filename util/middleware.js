const { Blog } = require('../models')

const errorHandler = (error, req, res, next) => {
  console.error(error)

  if (error.name === 'SequelizeDatabaseError') {
    return response.status(400).send({ error: error.message })
  }

  if (error.name === 'SyntaxError') {
    return response.status(400).send({ error: 'Wrong syntax' })
  }
  if (error.name === 'SequelizeValidationError') {
    return response.status(400).send({ error: 'required must not be null' })
  }
  if (error.name === 'CastError') {
    return response.status(400).send({ error: 'malformatted id' })
  }

  next(error)
}

const blogFinder = async (req, res, next) => {
  req.blog = await Blog.findByPk(req.params.id)
  next()
}

module.exports = {
  blogFinder,
  errorHandler,
}
