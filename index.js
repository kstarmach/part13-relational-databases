const express = require('express')
const app = express()
require('express-async-errors')

const { PORT } = require('./util/config')
const { connectToDatabase } = require('./util/db')
const middleware = require('./util/middleware')

const blogsRouter = require('./controllers/blogs')
const userRouter = require('./controllers/users')
const loginRouter = require('./controllers/login')
const authorsRouter = require('./controllers/authors')
const readinglistRouter = require('./controllers/readinglist')
const logoutRouter = require('./controllers/logout')

app.use(express.json())

app.use('/api/blogs', blogsRouter)
app.use('/api/users', userRouter)
app.use('/api/login', loginRouter)
app.use('/api/logout', logoutRouter)
app.use('/api/authors', authorsRouter)
app.use('/api/readinglists', readinglistRouter)

app.use(middleware.errorHandler)

const start = async () => {
  await connectToDatabase()
  app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`)
  })
}

start()
