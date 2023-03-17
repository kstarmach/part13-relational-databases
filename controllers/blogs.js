const router = require('express').Router()
const { blogFinder, tokenExtractor } = require('../util/middleware')
const { Blog, User } = require('../models')

router.get('/', async (req, res) => {
  const blogs = await Blog.findAll({
    attributes: { exclude: ['userId'] },
    include: {
      model: User,
      attributes: ['name'],
    },
  })
  res.json(blogs)
})

router.post('/', tokenExtractor, async (req, res) => {
  try {
    const user = await User.findByPk(req.decodedToken.id)
    const blog = await Blog.create({
      ...req.body,
      userId: user.id,
      date: new Date(),
    })
    res.json(blog)
  } catch (error) {
    return res.status(400).json({ error })
  }
})

router.get('/:id', blogFinder, async (req, res, next) => {
  try {
    if (req.blog) {
      res.json(req.blog)
    } else {
      res.status(404).end()
    }
  } catch (exception) {
    next(exception)
  }
})

router.delete('/:id', tokenExtractor, blogFinder, async (req, res) => {
  if (req.decodedToken.id === req.blog.userId) {
    await req.blog.destroy()
  }
  res.status(204).end()
})

router.put('/:id', blogFinder, async (req, res) => {
  if (req.blog) {
    req.blog.likes = req.body.likes
    await req.blog.save()
    res.json(req.blog)
  } else {
    res.status(404).end()
  }
})

const errorHandler = (error, request, response, next) => {
  console.error(error.message)

  if (error.name === 'CastError') {
    return response.status(400).send({ error: 'malformatted id' })
  }

  next(error)
}

module.exports = router
