const { Blog } = require('../models')
const jwt = require('jsonwebtoken')
const { SECRET } = require('./config')

const errorHandler = (error, req, res, next) => {
  if (error.name === 'SequelizeDatabaseError') {
    return res.status(400).send({ error: error.message })
  }

  if (error.name === 'SyntaxError') {
    return res.status(400).send({ error: 'Wrong syntax' })
  }

  if (error.name === 'SequelizeValidationError') {
    return res.status(400).send({ error: error.message })
  }

  if (error.name === 'CastError') {
    return res.status(400).send({ error: 'malformatted id' })
  }

  next(error)
}

const blogFinder = async (req, res, next) => {
  req.blog = await Blog.findByPk(req.params.id)
  next()
}

const tokenExtractor = (req, res, next) => {
  const authorization = req.get('authorization')
  if (authorization && authorization.toLowerCase().startsWith('bearer ')) {
    try {
      req.decodedToken = jwt.verify(authorization.substring(7), SECRET)
    } catch {
      return res.status(401).json({ error: 'token invalid' })
    }
  } else {
    return res.status(401).json({ error: 'token missing' })
  }
  next()
}

const isAdmin = async (req, res, next) => {
  const user = await User.findByPk(req.decodedToken.id)
  if (!user.admin) {
    return res.status(401).json({ error: 'operation not allowed' })
  }
  next()
}

module.exports = {
  blogFinder,
  errorHandler,
  tokenExtractor,
  isAdmin,
}
