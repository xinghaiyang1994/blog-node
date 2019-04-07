const Comment = require('../models/comment')

module.exports = {
  // 新增文章
  insertComment (model) {
    return Comment.forge(model).save()
  },
  // 查询评论数量
  findCommentCountByPostId (postId) {
    return Comment.forge().where({ 
      post_id: postId
    }).count()
  },
  // 评论列表翻页
  findCommentPageByPostId ({ postId, page, pageSize }) {
    return Comment.forge().where({
      post_id: postId
    }).fetchPage({
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
  // 获取单个评论详情
  findCommentDetailById (id) {
    return Comment.forge().where({ id }).fetch()
  },
  // 删除单个评论
  deleteCommentById (id) {
    return Comment.forge().where({ id }).destroy()
  }
}
