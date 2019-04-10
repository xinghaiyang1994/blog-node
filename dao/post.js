const Post = require('../models/post')

module.exports = {
  // 新增文章
  insertPost (model) {
    return Post.forge(model).save()
  },
  // 获取所有文章数量
  findPostAllCount () {
    return Post.forge().count()
  },
  // 获取所有文章列表（翻页）
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
  // 获取单个人的所有文章数量
  findPostAllCountByUserId (userId) {
    return Post.forge().where({ user_id: userId }).count()
  },
  // 获取单个人的文字列表（翻页）
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
  // 获取单个文章详情
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
  // 更新单个文章的 pv
  updatePvById ({ id, pv}) {
    // TODO 还可以一条 sql
    return Post.forge({ id }).save({ pv })
  },
  // 更新单个文章的评论数
  updateCommentsById ({ id, comments}) {
    // TODO 还可以一条 sql
    return Post.forge({ id }).save({ comments })
  },
  // 删除单个文章
  deletePostById (id) {
    return Post.forge().where({ id }).destroy()
  },
  // 更新单个文章
  updatePost ({ id, title, md, content, gmtModified }) {
    return Post.forge({ id }).save({ title, md, content, gmtModified })
  }
}
