const router = require('express').Router()
const {
  blogFinder,
  tokenExtractor,
  validateToken,
} = require('../util/middleware')
const { Blog, User } = require('../models')
const { Op } = require('sequelize')

router.get('/', validateToken, async (req, res) => {
  const blogs = await Blog.findAll({
    order: [['likes', 'DESC']],
    attributes: { exclude: ['userId'] },
    include: {
      model: User,
      attributes: ['name'],
    },
    where: {
      [Op.or]: {
        title: {
          [Op.substring]: req.query.search ? req.query.search : '',
        },

        author: {
          [Op.substring]: req.query.search ? req.query.search : '',
        },
      },
    },
  })
  res.json(blogs)
})

router.post('/', tokenExtractor, async (req, res) => {
  const user = await User.findByPk(req.decodedToken.id)
  const blog = await Blog.create({
    ...req.body,
    userId: user.id,
    date: new Date(),
  })
  res.json(blog)
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

module.exports = router
