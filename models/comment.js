const db = require('../middlewares/db')
const User = require('./user')
const Post = require('./post')

module.exports = db.Model.extend({
  tableName: 'comment',     // 表名
  hidden: ['gmtCreate'],
  user () {
    return this.belongsTo(User)
  },
  post () {
    return this.belongsTo(Post)
  }
})

