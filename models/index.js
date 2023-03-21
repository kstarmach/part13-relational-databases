const Blog = require('./blog')
const User = require('./user')
const ReadingList = require('./readinglist')
const ActiveSesions = require('./activesesions')

Blog.belongsTo(User)
User.hasMany(Blog)

User.belongsToMany(Blog, { through: ReadingList, as: 'readings' })
Blog.belongsToMany(User, { through: ReadingList, as: 'readinglists' })

module.exports = {
  Blog,
  User,
  ReadingList,
  ActiveSesions,
}
