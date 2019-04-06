const User = require('../models/user')

module.exports = {
  // 注册用户
  insertUser (model) {
    return User.forge(model).save()
  },
  // 通过名称查找用户
  findUserByName (name) {
    return User.forge().where({
      name
    }).fetch()
  },
  // 通过 id 查找用户
  findUserById (id) {
    return User.forge().where({
      id
    }).fetch()
  }
}
