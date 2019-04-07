const moment = require('moment')
const {
  dealBody
} = require('../utils/tools')
const validate = require('../utils/validate')
const {
  comment
} = require('../utils/joiSchema')
const {
  insertComment,
  findCommentCountByPostId,
  findCommentPageByPostId,
  findCommentDetailById,
  deleteCommentById
} = require('../dao/comment')
const {
  updateCommentsById
} = require('../dao/post')
const {
  checkLogin
} = require('../middlewares/checkLogin')

module.exports = {
  async postCommentAdd (ctx) {
    // 检查是否登录
    checkLogin(ctx)
    
    let { content, postId } = ctx.request.body
    let userId = ctx.session.id
    content = content.trim()

    // 校验
    validate({content, postId, userId}, comment)

    // 新增
    let resComment = await insertComment({content, postId, userId})
    let commentCount = await findCommentCountByPostId(postId)
    await updateCommentsById({ id: postId, comments: commentCount})
    return ctx.body = dealBody({
      data: {
        id: resComment.get('id')
      },
      message: '评论成功'
    })
  },
  async getCommentList (ctx) {
    let { postId, current, pageSize} = ctx.query

    // 查询
    let total = await findCommentCountByPostId(postId)
    let list = await findCommentPageByPostId({ postId, page: current, pageSize })
    return ctx.body = dealBody({
      data: {
        list,
        total
      }
    })
  },
  async postCommentDelete (ctx) {
    // 检查是否登录
    checkLogin(ctx)

    let { commentId } = ctx.request.body
    let userId = ctx.session.id

    // 判断是否是作者
    let resComment = await findCommentDetailById(commentId)
    if (resComment.get('userId') !== userId) {
      throw new Error('不是该作者，无法删除!')
    }

    // 删除
    await deleteCommentById(commentId)
    let postId = resComment.get('postId')
    let commentCount = await findCommentCountByPostId(postId)
    await updateCommentsById({ id: postId, comments: commentCount})
    return ctx.body = dealBody({
      message: '删除成功'
    })

  }
}