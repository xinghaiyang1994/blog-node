const db = require('../middlewares/db')
const User = require('./user')

module.exports = db.Model.extend({
  tableName: 'post',     // 表名
  hidden: ['gmtCreate'],
  user () {
    return this.belongsTo(User, 'user_id')
  }
})

