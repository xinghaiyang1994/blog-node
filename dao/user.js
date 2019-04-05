const User = require('../models/user')

module.exports = {
  // 注册用户
  insertUser (data) {
    return User.forge(data).save()
  }
}
