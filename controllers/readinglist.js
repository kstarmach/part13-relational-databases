const router = require('express').Router()
const { ReadingList } = require('../models')
const { tokenExtractor } = require('../util/middleware')

router.get('/', async (req, res) => {
  const reading_list = await ReadingList.findAll({})
  res.json(reading_list)
})

router.post('/', async (req, res) => {
  const reading_list = await ReadingList.create(req.body)
  res.json(reading_list)
})

router.put('/:id', tokenExtractor, async (req, res) => {
  const reading_list = await ReadingList.findByPk(req.params.id)
  if (reading_list.userId === req.decodedToken.id) {
    reading_list.read = req.body.read
    await reading_list.save()
    res.json(reading_list)
  } else {
    res.status(404).end()
  }
})

module.exports = router
