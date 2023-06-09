const { Blog, ActiveSesions } = require('../models')
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

const validateToken = async (req, res, next) => {
  const authorization = req.get('authorization')
  if (!authorization) return res.status(401).send({ message: 'Missing token' })

  const token = authorization.substring(7)
  if (!token) {
    return res.status(401).send({ message: 'Missing token' })
  }

  const active_sessions = await ActiveSesions.findOne({
    where: { token: token },
  })

  if (!active_sessions) {
    return res.status(401).json({ error: 'token is not valid try login again' })
  }

  req.active_sessions = active_sessions

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
  validateToken,
}
