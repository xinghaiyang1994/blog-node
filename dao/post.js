const Post = require('../models/post')

module.exports = {
  // 新增文章
  insertPost (model) {
    return Post.forge(model).save()
  },
  findPostAllCount () {
    return Post.forge().count()
  },
  findPostAllPage ({ page, pageSize }) {
    return Post.forge().orderBy('gmt_modified', 'DESC').fetchPage({
      page, 
      pageSize,
      withRelated: [
        {
          user (query) {
            return query.column('id', 'name', 'avator')
          }
        }
      ]
    })
  },
  findPostAllCountByUserId (userId) {
    return Post.forge().where({ user_id: userId }).count()
  },
  findPostAllPageByUserId ({ page, pageSize, userId }) {
    return Post.forge().where({ user_id: userId }).orderBy('gmt_modified', 'DESC').fetchPage({
      page, 
      pageSize,
      withRelated: [
        {
          user (query) {
            return query.column('id', 'name', 'avator')
          }
        }
      ]
    })
  },
  findPostDetailById (id) {
    return Post.forge().where({ id }).fetch({
      withRelated: [
        {
          user (query) {
            return query.column('id', 'name', 'avator')
          }
        }
      ]
    })
  },
  updatePvById ({ id, pv}) {
    // TODO 还可以一条 sql
    return Post.forge({ id }).save({ pv })
  },
  deletePostById (id) {
    return Post.forge().where({ id }).destroy()
  },
  updatePost ({ id, title, md, content, gmtModified }) {
    return Post.forge({ id }).save({ title, md, content, gmtModified })
  }





  // // 通过名称查找用户
  // findUserByName (name) {
  //   return User.forge().where({
  //     name
  //   }).fetch()
  // },
  // // 通过 id 查找用户
  // findUserById (id) {
  //   return User.forge().where({
  //     id
  //   }).fetch()
  // }
}
