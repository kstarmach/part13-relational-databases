const router = require('express').Router()
const { validateToken } = require('../util/middleware')

router.delete('/', validateToken, async (req, res) => {
  await req.active_sessions.destroy()
  res.status(200).end()
})

module.exports = router
